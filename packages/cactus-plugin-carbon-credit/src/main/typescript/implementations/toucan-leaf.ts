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
import { ethers } from "ethers";
import { Network as ToucanNetwork } from "toucan-sdk/dist/types";
import dotenv from "dotenv";
import {
  approveERC20IfNeeded,
  getERC20Balance,
  getTokenAddressBySymbol,
} from "../utils";

dotenv.config({ path: "packages/cactus-plugin-carbon-credit/.env" });

export interface IToucanLeafOptions extends CarbonMarketplaceAbstractOptions {}

export class ToucanLeaf extends CarbonMarketplaceAbstract {
  public static CLASS_NAME = "ToucanLeaf";

  protected readonly logger: Logger;
  protected readonly logLevel: LogLevelDesc;
  protected readonly gasConfig: GasTransactionConfig | undefined;

  private readonly signingCredential: Web3SigningCredentialPrivateKeyHex;

  private readonly toucanClient: ToucanClient;
  private readonly signer: ethers.Signer;
  private readonly provider: ethers.providers.JsonRpcProvider;
  private readonly dexImpl;

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

    this.provider = options.provider;

    this.dexImpl = options.dexImpl;

    this.signer = this.provider.getSigner(
      "0xfa0b641678f5115ad8a8de5752016bd1359681b9",
    );

    const toucanNetwork = this.convertNetwork(options.networkConfig.network);

    this.toucanClient = new ToucanClient(
      toucanNetwork,
      this.provider,
      this.signer,
    );
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
    try {
      const fnTag = `${ToucanLeaf.CLASS_NAME}#specificBuy()`;
      this.logger.info(
        `Received specific buy request for ${request.items} units.`,
      );

      const tco2Addresses = Object.keys(request.items);
      const tonnesBigInt = Object.values(request.items).map((v) => BigInt(v));
      const tonnes = tonnesBigInt.map((v) =>
        ethers.BigNumber.from(v.toString()),
      );
      const totalTonnes = tonnesBigInt
        .reduce((sum, t) => sum + t, 0n)
        .toString();

      const signer = this.provider.getSigner(
        "0xfa0b641678f5115ad8a8de5752016bd1359681b9",
      );

      const txHashSwap = await this.dexImpl.swapExactFromUSDC(
        signer,
        getTokenAddressBySymbol(request.network, "NCT"),
        BigInt(totalTonnes).toString(), // amount of NCT we want to buy
        request.network,
      );

      const usdc_balance = await getERC20Balance(
        getTokenAddressBySymbol(request.network, "USDC"),
        await signer.getAddress(),
        this.provider,
      );
      this.logger.info(
        `${fnTag} USDC balance after swap: ${ethers.utils.formatUnits(
          usdc_balance,
          6,
        )} USDC`,
      );

      const nct_balance = await getERC20Balance(
        getTokenAddressBySymbol(request.network, "NCT"),
        await signer.getAddress(),
        this.provider,
      );
      this.logger.info(
        `${fnTag} NCT balance after swap: ${ethers.utils.formatUnits(
          nct_balance,
          18,
        )} NCT`,
      );

      // 3. Approve NCT
      const approvalTx = await approveERC20IfNeeded(
        getTokenAddressBySymbol(request.network, "NCT"),
        signer,
        this.toucanClient.getPoolAddress("NCT"),
        BigInt(totalTonnes),
      );

      if (approvalTx) {
        this.logger.info(
          `${fnTag} Approved pool ${this.toucanClient.getPoolAddress("NCT")} to spend NCT. Approval tx hash: ${approvalTx}`,
        );
      }

      const receipt = await this.toucanClient.redeemMany(
        "NCT",
        tco2Addresses,
        tonnes,
      );

      this.logger.info(`Buy operation completed successfully.`);

      return {
        txHashSwap: txHashSwap,
        buyTxHash: receipt.transactionHash,
        assetAmount: totalTonnes,
        tco2List: tco2Addresses.map((addr, idx) => ({
          address: addr,
          amount: tonnesBigInt[idx].toString(),
        })),
      };
    } catch (err) {
      this.logger.error("Error in buy:", err);
      throw new Error("Failed to buy VCUs");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async randomBuy(
    request: RandomBuyRequest,
  ): Promise<RandomBuyResponse> {
    try {
      const fnTag = `${ToucanLeaf.CLASS_NAME}#randomBuy()`;
      this.logger.info(`Received buy request for ${request.amount} units.`);

      // // 1. Setup
      // const router = new ethers.Contract(
      //   process.env.ROUTER!, // Ex: SushiSwap em Polygon
      //   [
      //     "function swapExactTokensForTokens(uint256 amountIn,uint256 amountOutMin,address[] path,address to,uint256 deadline) external returns (uint256[] memory)",
      //   ],
      //   this.signer,
      // );

      // if (request.paymentToken === undefined) {
      //   request.paymentToken = process.env.USDC!;
      // }

      // const usdc = new ethers.Contract(
      //   request.paymentToken,
      //   [
      //     "function approve(address spender, uint256 value) external returns (bool)",
      //   ],
      //   this.signer,
      // );

      // 2. Swap USDC → NCT
      // this.logger.debug(
      //   `${fnTag}  Swapping ${request.paymentToken} for pool tokens...`,
      // );
      // const amountIn = utils.parseUnits(String(request.amount), 6); // not this amount. This will be the amount of carbon credits in tonnes
      // const path = [request.paymentToken, process.env.NCT!];
      // await usdc.approve(router.address, amountIn);

      // const swapTx = await router.swapExactTokensForTokens(
      //   amountIn,
      //   0, // set `amountOutMin` for real slippage control
      //   path,
      //   this.signer.address,
      //   Math.floor(Date.now() / 1000) + 60 * 10,
      // );

      // const receipt = await swapTx.wait();
      // const txHashSwap = receipt.hash;
      const txHashSwap = "txHashSwap_placeholder";

      // 3. Approve NCT + Redeem chosen TCO2s
      this.logger.debug(`${fnTag} Redeeming pool tokens for TCO2s...`);

      const nct = new ethers.Contract(
        getTokenAddressBySymbol(request.network, "NCT"),
        [
          "function approve(address spender, uint256 value) external returns (bool)",
          "function balanceOf(address account) external view returns (uint256)",
          "function redeemAuto(uint256 amount) external returns (uint256[] memory)",
          "event Redeem(address indexed tco2, uint256 amount)",
        ],
        this.signer,
      );

      const nctBalance = await nct.balanceOf(this.signer.getAddress());
      await nct.approve(
        await getTokenAddressBySymbol(request.network, "NCT"),
        2n ** 256n,
      ); // infinite approval per #332
      // For non-custodial front-ends consider limited approvals equal to `nctBalance` instead.
      const redeemTx = await nct.redeemAuto(nctBalance);
      const redeemReceipt = await redeemTx.wait();

      // 4. Parse events to build tco2List
      const tco2List: { address: string; amount: string }[] = [];
      for (const log of redeemReceipt.logs) {
        try {
          const parsed = nct.interface.parseLog(log);
          if (parsed && parsed.name === "Redeem") {
            const [tco2Addr, amt] = parsed.args;
            tco2List.push({
              address: tco2Addr,
              amount: amt.toString(),
            });
          }
        } catch {
          // ignore logs that don’t match
        }
      }

      this.logger.info(`Buy operation completed successfully.`);

      return {
        txHashSwap,
        assetAmount: nctBalance.toString(),
        tco2List,
      };
    } catch (err) {
      this.logger.error("Error in randomBuy:", err);
      throw new Error("Failed to random buy VCUs");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public retire(request: RetireRequest): Promise<RetireResponse> {
    throw new Error("Method not implemented.");
  }

  public async getAvailableTCO2s(
    request: GetAvailableTCO2sRequest,
  ): Promise<GetAvailableTCO2sResponse> {
    try {
      const fnTag = `${ToucanLeaf.CLASS_NAME}#getAvailableTCO2s()`;
      this.logger.info(
        `Fetching available VCUs for marketplace ${request.marketplace}`,
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

      this.logger.info(`There are ${projects.length} available VCUs.`);

      return {
        tco2List,
        totalCount: projects.length,
      };
    } catch (err) {
      this.logger.error("Error in getAvailableTCO2s:", err);
      throw new Error("Failed to fetch available VCUs");
    }
  }

  public async getVCUMetadata(
    req: GetVCUMetadataRequest,
  ): Promise<VCUMetadata> {
    this.logger.info(`Fetching metadata for VCU with ID: ${req.vcuIdentifier}`);

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
      throw new Error(`VCU with ID ${req.vcuIdentifier} not found.`);
    }
  }
}
