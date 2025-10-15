import {
  Logger,
  LogLevelDesc,
  LoggerProvider,
} from "@hyperledger/cactus-common";
import { GasTransactionConfig } from "@hyperledger/cactus-plugin-ledger-connector-ethereum";
import {
  CarbonMarketplaceAbstract,
  CarbonMarketplaceAbstractOptions,
} from "../carbon-marketplace-abstract";
import { stringify as safeStableStringify } from "safe-stable-stringify";
import {
  SpecificBuyRequest,
  SpecificBuyResponse,
  RandomBuyRequest,
  RandomBuyResponse,
  RetireRequest,
  RetireResponse,
  GetAvailableTCO2sRequest,
  GetAvailableTCO2sResponse,
  GetVCUMetadataRequest,
  VCUMetadata,
  Network,
} from "../public-api";
import ToucanClient from "toucan-sdk";
import { BigNumber, ethers } from "ethers";
import { Network as ToucanNetwork } from "toucan-sdk/dist/types";
import dotenv from "dotenv";
import { approveERC20IfNeeded, getTokenAddressBySymbol } from "../utils";
import { DexAbstract } from "../dex-abstract";

dotenv.config({ path: "packages/cactus-plugin-carbon-credit/.env" });

export interface IToucanLeafOptions extends CarbonMarketplaceAbstractOptions {}

export class ToucanLeaf extends CarbonMarketplaceAbstract {
  public static CLASS_NAME = "ToucanLeaf";

  protected readonly logger: Logger;
  protected readonly logLevel: LogLevelDesc;
  protected readonly gasConfig: GasTransactionConfig | undefined;

  private readonly toucanClient: ToucanClient;
  private readonly signer: ethers.Signer;

  private readonly dexImpl: DexAbstract;

  constructor(public readonly options: IToucanLeafOptions) {
    super();
    const label = this.className;
    this.logLevel = options.logLevel || "INFO";
    this.logger = LoggerProvider.getOrCreate({ label, level: this.logLevel });

    this.logger.debug(
      `${this.className}#constructor options: ${safeStableStringify(options)}`,
    );

    this.dexImpl = options.dexImpl;
    this.signer = options.signer;

    if (!this.signer.provider) {
      throw new Error(
        `${this.className}#constructor The provided signer does not have a provider.`,
      );
    }

    const toucanNetwork = this.convertNetwork(options.network);

    this.toucanClient = new ToucanClient(
      toucanNetwork,
      this.signer.provider,
      this.signer,
    );
  }

  public get className(): string {
    return ToucanLeaf.CLASS_NAME;
  }

  private convertNetwork(network: Network): ToucanNetwork {
    switch (network) {
      case Network.Polygon:
        return "polygon";
      case Network.Alfajores:
        return "alfajores";
      case Network.Celo:
        return "celo";
      // case Network.Base:
      //   return "base";
      // case Network.BaseSepolia:
      //   return "base-sepolia";
      default:
        throw new Error(`Unsupported network: ${network}`);
    }
  }

  public async specificBuy(
    request: SpecificBuyRequest,
  ): Promise<SpecificBuyResponse> {
    const fnTag = `${this.className}#specificBuy()`;
    this.logger.info(
      `${fnTag} Received specific buy request for ${request.items} units.`,
    );

    const tco2Addresses = Object.keys(request.items);
    const tonnesBigInt = Object.values(request.items).map((v) => BigInt(v));
    const tonnes = tonnesBigInt.map((v) => ethers.BigNumber.from(v.toString()));
    const totalTonnes = tonnesBigInt.reduce((sum, t) => sum + t, 0n).toString();

    const txHashSwap = await this.swapTokensAndApproveNCT(
      this.signer,
      totalTonnes,
      request.network,
    );

    this.logger.info(
      `${fnTag} Redeeming ${totalTonnes} units of NCT for specific TCO2s...`,
    );

    for (let i = 0; i < tco2Addresses.length; i++) {
      const addr = tco2Addresses[i];

      const NCT_ADDRESS = this.toucanClient.getPoolAddress("NCT");
      const tco2Contract = await this.toucanClient.getTCO2Contract(addr);
      const bal = await tco2Contract.attach(addr).balanceOf(NCT_ADDRESS);

      if (bal.lt(tonnes[i])) {
        throw new Error(
          `${fnTag} Not enough liquidity in the pool for TCO2 at address ${addr}. Available: ${bal.toString()}, required: ${tonnes[i].toString()}`,
        );
      }
    }

    const receipt = await this.toucanClient.redeemMany(
      "NCT",
      tco2Addresses,
      tonnes,
    );

    this.logger.info(`Specific buy operation completed successfully.`);

    return {
      txHashSwap: txHashSwap,
      buyTxHash: receipt.transactionHash,
      assetAmount: totalTonnes,
      tco2List: tco2Addresses.map((addr, idx) => ({
        address: addr,
        amount: tonnesBigInt[idx].toString(),
      })),
    };
  }

  public async randomBuy(
    request: RandomBuyRequest,
  ): Promise<RandomBuyResponse> {
    const fnTag = `${this.className}#randomBuy()`;
    this.logger.info(
      `${fnTag} Received buy request for ${request.amount} units.`,
    );

    const txHashSwap = await this.swapTokensAndApproveNCT(
      this.signer,
      request.amount,
      request.network,
    );

    const receipt = await this.toucanClient.redeemAuto(
      "NCT",
      BigNumber.from(request.amount),
    );

    this.logger.info(`Random buy operation completed successfully.`);

    return {
      txHashSwap,
      assetAmount: request.amount.toString(),
      tco2List: receipt.map((addr) => ({
        address: addr.address,
        amount: addr.amount.toString(),
      })),
    };
  }

  public async retire(request: RetireRequest): Promise<RetireResponse> {
    const fnTag = `${this.className}#retire()`;
    this.logger.info(`${fnTag} Retiring ${request.tco2s.length} TCO2s...`);

    const responses = [];

    for (let i = 0; i < request.tco2s.length; i++) {
      const tco2Address = request.tco2s[i];
      const amount = request.amounts[i];

      const response = await this.toucanClient.retireAndMintCertificate(
        request.entityName,
        request.beneficiaryAddress,
        request.beneficiaryName,
        request.retirementReason,
        BigNumber.from(amount),
        tco2Address,
      );

      // We need to collect the certificate ID from the event CertificateMinted (uint256 tokenId)
      // with signature 0x54b249c3cd4a5f80e81d2ad036b251d58d8f5482a926f25d12eabec192cf1ecd

      const certificateId = response.events
        ?.find(
          (event) =>
            event.topics[0] ===
            "0x54b249c3cd4a5f80e81d2ad036b251d58d8f5482a926f25d12eabec192cf1ecd",
        )
        ?.data.toString();

      this.logger.info(
        `${fnTag} Retired ${amount} units of TCO2 at address ${tco2Address}. Transaction hash: ${response.transactionHash}. Retirement certificate ID: ${parseInt(certificateId!, 16)}`,
      );

      if (!certificateId) {
        throw new Error(
          `${fnTag} Certificate ID not found in transaction events.`,
        );
      }

      responses.push({
        tco2Address,
        amount,
        certificateId: parseInt(certificateId, 16),
        txHash: response.transactionHash,
      });
    }

    this.logger.info(`${fnTag} Retire operation completed successfully.`);

    return {
      txHashRetires: responses.map((r) => r.txHash),
      retirementCertificateIds: responses.map((r) => r.certificateId),
    };
  }

  public async getAvailableTCO2s(
    request: GetAvailableTCO2sRequest,
  ): Promise<GetAvailableTCO2sResponse> {
    const fnTag = `${this.className}#getAvailableTCO2s()`;
    this.logger.info(
      `Fetching available TCO2s for marketplace ${request.marketplace}`,
    );

    this.logger.info(`${fnTag} Fetching available TCO2s...`);

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

        const region = attrs[0].region;
        const projectId = attrs[0].projectId;

        return { addr, name, symbol, totalSupply, region, projectId };
      }),
    );

    // Apply filters (region, vintage, etc.)
    if (request.filterCriteria != undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      projects = projects.filter((p) => {
        // TODO: improve filtering to support multiple criteria
        return true;
      });
    }

    // Sort by supply if specified (by default it is already sorted by Toucan quality score)
    if (request.orderBy === "supply") {
      projects.sort((a, b) => Number(b.totalSupply) - Number(a.totalSupply));
    }

    // Apply limit
    const tco2List = projects
      .slice(0, Math.min(Number(request.limit ?? 100), 100))
      .map((p) => ({
        address: p.addr,
        projectId: p.projectId,
      }));

    this.logger.info(`There are ${projects.length} available TCO2s.`);

    return {
      tco2List,
      totalCount: projects.length,
    };
  }

  public async getVCUMetadata(
    req: GetVCUMetadataRequest,
  ): Promise<VCUMetadata> {
    const fnTag = `${this.className}#getVCUMetadata()`;

    this.logger.info(
      `${fnTag} Fetching metadata for VCU with ID: ${req.vcuIdentifier}`,
    );

    try {
      const tco2 = await this.toucanClient.getTCO2Contract(req.vcuIdentifier);

      this.logger.info(
        `Fetched metadata for VCU ${req.vcuIdentifier} successfully.`,
      );

      const [name, symbol, totalSupply] = await Promise.all([
        tco2.name(),
        tco2.symbol(),
        tco2.totalSupply(),
      ]);
      const attrs = await tco2.getAttributes();

      return {
        name,
        symbol,
        totalSupply: Number(totalSupply),
        attributes: {
          region: attrs[0].region,
          totalVintageQuantity: attrs[1].totalVintageQuantity.toString(),
          methodology: attrs[0].methodology,
        },
      };
    } catch (err) {
      throw new Error(`VCU with ID ${req.vcuIdentifier} not found. ${err}`);
    }
  }

  /**
   * Before any buy function we need to perform a swap of USDC for the specific amount of NCT tokens
   * using the configured DEX implementation and approve the Toucan NCT pool to spend the acquired NCT tokens.
   *
   * This function performs the following steps:
   * 1. Swaps USDC for the specified amount of NCT tokens.
   * 2. Logs the USDC and NCT balances after the swap.
   * 3. Approves the Toucan NCT pool to spend the acquired NCT tokens if necessary.
   *
   * @param signer - The ethers.Signer instance used to sign transactions.
   * @param totalTonnes - The amount of NCT tokens to acquire and approve, specified as a string.
   * @param network - The network where these actions will be taken.
   * @returns A promise that resolves to the transaction hash of the swap operation.
   */
  public async swapTokensAndApproveNCT(
    signer: ethers.Signer,
    totalTonnes: string,
    network: Network,
  ): Promise<string> {
    const fnTag = `${this.className}#swapTokensAndApproveNCT()`;

    // 1. Swap USDC for NCT
    const txHashSwap = await this.dexImpl.swapExactFromUSDC(
      signer,
      getTokenAddressBySymbol(network, "NCT"),
      totalTonnes, // amount of NCT we want to buy
      network,
    );

    // 2. Approve Toucan NCT pool to spend NCT
    const approvalTx = await approveERC20IfNeeded(
      getTokenAddressBySymbol(network, "NCT"),
      signer,
      this.toucanClient.getPoolAddress("NCT"),
      BigInt(totalTonnes),
    );

    if (approvalTx) {
      this.logger.info(
        `${fnTag} Approved pool ${this.toucanClient.getPoolAddress("NCT")} to spend NCT. Approval tx hash: ${approvalTx}`,
      );
    }

    return txHashSwap;
  }
}
