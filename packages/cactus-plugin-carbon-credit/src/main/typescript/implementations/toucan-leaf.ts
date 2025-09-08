import {
  Logger,
  LogLevelDesc,
  LoggerProvider,
} from "@hyperledger/cactus-common";
import {
  GasTransactionConfig,
  isWeb3SigningCredentialNone,
  Web3SigningCredentialPrivateKeyHex,
} from "@hyperledger/cactus-plugin-ledger-connector-ethereum";
import {
  CarbonMarketplaceAbstract,
  CarbonMarketplaceAbstractOptions,
} from "../carbon-marketplace-abstract";
import { stringify as safeStableStringify } from "safe-stable-stringify";
import {
  BuyRequest,
  BuyResponse,
  RetireRequest,
  GetAvailableVCUsRequest,
  GetAvailableVCUsResponse,
  GetVCUMetadataRequest,
  VCUMetadata,
  Network,
} from "../public-api";
import { RetireEndpoint } from "../web-services/retire-endpoint";
import ToucanClient from "toucan-sdk";
import { ethers } from "ethers";
const { formatUnits } = ethers.utils;
import { Network as ToucanNetwork } from "toucan-sdk/dist/types";

export interface IToucanLeafOptions extends CarbonMarketplaceAbstractOptions {}

export class ToucanLeaf extends CarbonMarketplaceAbstract {
  public static CLASS_NAME = "ToucanLeaf";

  protected readonly logger: Logger;
  protected readonly logLevel: LogLevelDesc;
  protected readonly gasConfig: GasTransactionConfig | undefined;

  private readonly signingCredential: Web3SigningCredentialPrivateKeyHex;

  private readonly toucanClient: ToucanClient;

  constructor(public readonly options: IToucanLeafOptions) {
    super();
    const label = ToucanLeaf.CLASS_NAME;
    this.logLevel = options.logLevel || "INFO";
    this.logger = LoggerProvider.getOrCreate({ label, level: this.logLevel });

    this.logger.debug(
      `${ToucanLeaf.CLASS_NAME}#constructor options: ${safeStableStringify(options)}`,
    );

    this.gasConfig = options.gasConfig;

    if (isWeb3SigningCredentialNone(options.signingCredential)) {
      throw new Error(
        `${ToucanLeaf.CLASS_NAME}#constructor, options.signingCredential`,
      );
    }
    this.signingCredential = options.signingCredential;

    const provider = new ethers.providers.JsonRpcProvider("http://dummy");

    const signer = new ethers.Wallet(this.signingCredential.secret, provider);

    const toucanNetwork = this.convertNetwork(options.network);

    this.toucanClient = new ToucanClient(toucanNetwork, provider, signer);
  }

  private convertNetwork(network: Network): ToucanNetwork {
    switch (network) {
      case Network.Polygon:
        return "polygon";
      case Network.Alfajores:
        return "alfajores";
      case Network.Celo:
        return "celo";
      default:
        throw new Error(`Unsupported network: ${network}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public buy(_request: BuyRequest): Promise<BuyResponse> {
    throw new Error("Method not implemented.");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public retire(_request: RetireRequest): Promise<RetireEndpoint> {
    throw new Error("Method not implemented.");
  }

  public async getAvailableVCUs(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _request: GetAvailableVCUsRequest,
  ): Promise<GetAvailableVCUsResponse> {
    try {
      // Search for available TCO2s already sorted by quality score
      const tco2Addresses: string[] =
        await this.toucanClient.getScoredTCO2s("NCT");

      // Collect basic metadata to enable filtering and sorting
      let projects = await Promise.all(
        tco2Addresses.map(async (addr) => {
          const tco2 = await this.toucanClient.getTCO2Contract(addr);
          const [name, symbol, totalSupply] = await Promise.all([
            tco2.name(),
            tco2.symbol(),
            tco2.totalSupply(),
          ]);
          const attrs = await tco2.getAttributes();
          return { addr, name, symbol, totalSupply, ...attrs };
        }),
      );

      // Apply filters (region, vintage, etc.)
      if (_request.filterCriteria != undefined) {
        projects = projects.filter((p) => {
          // TODO: improve filtering to support multiple criteria
          return true;
        });
      }

      // Sort by supply if specified (by default it is already sorted by Toucan quality score)
      if (_request.orderBy === "supply") {
        projects.sort((a, b) => Number(b.totalSupply) - Number(a.totalSupply));
      }

      // Apply limit
      const objectsList =
        _request.limit != null
          ? projects.slice(0, Number(_request.limit)).map((p) => p.addr)
          : projects.slice(0, 100).map((p) => p.addr);

      return {
        objectsList,
        totalCount: projects.length,
      };
    } catch (err) {
      console.error("Error in getAvailableVCUs:", err);
      throw new Error("Failed to fetch available VCUs");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getVCUMetadata(
    _req: GetVCUMetadataRequest,
  ): Promise<VCUMetadata> {
    try {
      const tco2 = await this.toucanClient.getTCO2Contract(_req.vcuIdentifier);

      const [name, symbol, totalSupply] = await Promise.all([
        tco2.name(),
        tco2.symbol(),
        tco2.totalSupply(),
      ]);

      const attrs = await tco2.getAttributes();

      return {
        name,
        symbol,
        totalSupply: formatUnits(totalSupply, 18),
        ...attrs,
      };
    } catch (err) {
      console.error("Error in getVCUMetadata:", err);
      throw new Error("Failed to fetch VCU metadata");
    }
  }
}
