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
import { parseUnits } from "ethers";
import { MaxUint256 } from "ethers";
import { Network as ToucanNetwork } from "toucan-sdk/dist/types";

export interface IToucanLeafOptions extends CarbonMarketplaceAbstractOptions {}

export class ToucanLeaf extends CarbonMarketplaceAbstract {
  public static CLASS_NAME = "ToucanLeaf";

  protected readonly logger: Logger;
  protected readonly logLevel: LogLevelDesc;
  protected readonly gasConfig: GasTransactionConfig | undefined;

  private readonly signingCredential: Web3SigningCredentialPrivateKeyHex;

  private readonly toucanClient: ToucanClient;
  private readonly signer: ethers.Wallet;

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

    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-rpc.com/",
    );

    this.signer = new ethers.Wallet(this.signingCredential.secret, provider);

    const toucanNetwork = this.convertNetwork(options.network);

    this.toucanClient = new ToucanClient(toucanNetwork, provider, this.signer);
  }

  private convertNetwork(network: Network): ToucanNetwork {
    switch (network) {
      case Network.Polygon:
        return "polygon";
      case Network.Alfajores:
        return "alfajores";
      case Network.Celo:
        return "celo";
      case Network.Base:
        return "base";
      case Network.BaseSepolia:
        return "base-sepolia";
      default:
        throw new Error(`Unsupported network: ${network}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async buy(_request: BuyRequest): Promise<BuyResponse> {
    try {
      const fnTag = `${ToucanLeaf.CLASS_NAME}#buy()`;
      this.logger.info(`Received buy request for ${_request.amount} units.`);

      // 1. Setup
      const router = new ethers.Contract(
        process.env.ROUTER!, // Ex: SushiSwap em Polygon
        [
          "function swapExactTokensForTokens(uint256 amountIn,uint256 amountOutMin,address[] path,address to,uint256 deadline) external returns (uint256[] memory)",
        ],
        this.signer,
      );

      const usdc = new ethers.Contract(
        _request.paymentToken,
        [
          "function approve(address spender, uint256 value) external returns (bool)",
        ],
        this.signer,
      );

      // 2. Swap USDC → NCT
      this.logger.debug(
        `${fnTag}  Swapping ${_request.paymentToken} for pool tokens...`,
      );
      const amountIn = parseUnits(_request.amount, 6);
      const path = [_request.paymentToken, process.env.NCT!];
      await usdc.approve(router.target, amountIn);

      const swapTx = await router.swapExactTokensForTokens(
        amountIn,
        0, // set `amountOutMin` for real slippage control
        path,
        this.signer.address,
        Math.floor(Date.now() / 1000) + 60 * 10,
      );

      const receipt = await swapTx.wait();
      const txHashSwap = receipt.hash;

      // 3. Redeem NCT para TCO2
      this.logger.debug(`${fnTag} Redeeming pool tokens for TCO2s...`);

      const nct = new ethers.Contract(
        process.env.NCT!,
        [
          "function approve(address spender, uint256 value) external returns (bool)",
        ],
        this.signer,
      );

      await nct.approve(process.env.NCT!, MaxUint256); // infinite approval per #332

      let tco2List: { address: string; amount: bigint }[] | undefined;
      const tco2s = ["0xABCD…", "0x1234…"]; // TCO2 token addresses
      const tonnes = [parseUnits("3", 18), parseUnits("2", 18)];

      const redeemStrategy = "specific"; // "specific" | "redeemMany" | "auto"

      if (redeemStrategy === "specific" && tco2s && tonnes) {
        await this.toucanClient.selectiveRedeem("NCT", tco2s, tonnes);
        tco2List = tco2s.map((addr, i) => ({
          address: addr,
          amount: tonnes[i],
        }));
      } else if (redeemStrategy === "redeemMany" && tco2s && tonnes) {
        const tx = await nct.redeemMany(tco2s, tonnes);
        await tx.wait();
        tco2List = tco2s.map((addr, i) => ({
          address: addr,
          amount: tonnes[i],
        }));
      } else {
        const nctBalance = await nct.balanceOf(this.signer.address);
        await nct.redeemAuto(nctBalance);
        // nesse caso não sabemos exatamente a lista sem parsear os eventos
      }

      const tco2ListString = tco2List?.map((t) => ({
        address: t.address,
        amount: t.amount.toString(),
      }));

      this.logger.info(`Buy operation completed successfully.`);

      return {
        txHashSwap,
        assetAmount: amountIn.toString(),
        tco2List: tco2ListString || [],
      };
    } catch (err) {
      console.error("Error in buy:", err);
      throw new Error("Failed to buy VCUs");
    }
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
      const fnTag = `${ToucanLeaf.CLASS_NAME}#getAvailableVCUs()`;
      this.logger.info(
        `Fetching available VCUs for platform ${_request.platform}`,
      );

      this.logger.debug(`${fnTag} Fetching available VCUs...`);

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

      this.logger.info(`There are ${projects.length} available VCUs.`);

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
      this.logger.info(
        `Fetching metadata for VCU with ID: ${_req.vcuIdentifier}`,
      );
      // Search for available TCO2s already sorted by quality score
      const tco2Addresses: string[] =
        await this.toucanClient.getScoredTCO2s("NCT");

      // Collect basic metadata to enable filtering and sorting
      const projects = await Promise.all(
        tco2Addresses.map(async (addr) => {
          const tco2 = await this.toucanClient.getTCO2Contract(addr);
          const [name, symbol, totalSupply] = await Promise.all([
            tco2.name(),
            tco2.symbol(),
            tco2.totalSupply(),
          ]);
          const attrs = await tco2.getAttributes();
          return { addr, name, symbol, totalSupply, attrs };
        }),
      );

      const found = projects.find(
        (p) =>
          p.addr === _req.vcuIdentifier &&
          p.attrs[0].projectId === _req.projectIdentifier,
      );
      if (!found) {
        throw new Error(`VCU with ID ${_req.vcuIdentifier} not found.`);
      }

      this.logger.info(
        `Fetched metadata for VCU ${_req.vcuIdentifier} successfully.`,
      );

      return {
        name: found.name,
        symbol: found.symbol,
        totalSupply: found.totalSupply,
        attributes: found.attrs, // Ensure 'attrs' is present in the found object
      };
    } catch (err) {
      console.error("Error in getVCUMetadata:", err);
      throw new Error(`VCU with ID ${_req.vcuIdentifier} not found.`);
    }
  }
}
