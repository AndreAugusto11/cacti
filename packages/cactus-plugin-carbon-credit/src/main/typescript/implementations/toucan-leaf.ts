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
  GetPurchasePriceRequest,
  GetPurchasePriceResponse,
  VCUMetadata,
  Network,
} from "../public-api";
import ToucanClient from "toucan-sdk";
import { ethers } from "ethers";
import { utils } from "ethers";
import { Network as ToucanNetwork } from "toucan-sdk/dist/types";
import dotenv from "dotenv";
dotenv.config({ path: "packages/cactus-plugin-carbon-credit/.env" });

export interface IToucanLeafOptions extends CarbonMarketplaceAbstractOptions {}

export class ToucanLeaf extends CarbonMarketplaceAbstract {
  public static CLASS_NAME = "ToucanLeaf";

  protected readonly logger: Logger;
  protected readonly logLevel: LogLevelDesc;
  protected readonly gasConfig: GasTransactionConfig | undefined;

  private readonly signingCredential: Web3SigningCredentialPrivateKeyHex;

  private readonly toucanClient: ToucanClient;
  private readonly signer: ethers.Wallet;
  private readonly provider: ethers.providers.JsonRpcProvider;

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

    //const provider = new ethers.providers.JsonRpcProvider(
    //  "https://polygon-rpc.com/", https://celo-alfajores.drpc.org
    //);

    this.provider = new ethers.providers.JsonRpcProvider(
      process.env.POLYGON_RPC,
    );

    // Example: log RPC to confirm
    console.log("Using RPC:", process.env.POLYGON_RPC);

    this.signer = new ethers.Wallet(
      this.signingCredential.secret,
      this.provider,
    );

    const toucanNetwork = this.convertNetwork(options.network);

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async specificBuy(
    _request: SpecificBuyRequest,
  ): Promise<SpecificBuyResponse> {
    try {
      const fnTag = `${ToucanLeaf.CLASS_NAME}#specificBuy()`;
      this.logger.info(
        `Received specific buy request for ${_request.items} units.`,
      );

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
      const amountIn = utils.parseUnits(String(_request.paymentToken), 6); // not this amount. This will be the amount of carbon credits in tonnes
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

      // 3. Approve NCT + Redeem chosen TCO2s
      this.logger.debug(`${fnTag} Redeeming pool tokens for TCO2s...`);

      const nct = new ethers.Contract(
        process.env.NCT!,
        [
          "function approve(address spender, uint256 value) external returns (bool)",
        ],
        this.signer,
      );

      const tco2s = receipt.items.addresses; // TCO2 token addresses
      const tonnes = _request.items.map((item) =>
        utils.parseUnits(item.amount.toString(), 18),
      );
      const amount = tonnes.reduce((a, b) => a + b.toBigInt(), 0n).toString();

      await nct.approve(nct.target, 2n ** 256n); // infinite approval per #332
      await this.toucanClient.redeemMany("NCT", tco2s, tonnes);
      const tco2ListString = tco2s.map((addr: any, i: number) => ({
        address: addr,
        amount: tonnes[i],
      }));

      this.logger.info(`Buy operation completed successfully.`);

      return {
        txHashSwap,
        assetAmount: amount,
        tco2List: tco2ListString || [],
      };
    } catch (err) {
      this.logger.error("Error in buy:", err);
      throw new Error("Failed to buy VCUs");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async randomBuy(
    _request: RandomBuyRequest,
  ): Promise<RandomBuyResponse> {
    try {
      const fnTag = `${ToucanLeaf.CLASS_NAME}#randomBuy()`;
      this.logger.info(`Received buy request for ${_request.amount} units.`);

      // 2. Obter o saldo de CELO (token nativo) da carteira
      const nativeBalance = await this.provider.getBalance(
        this.signer.getAddress(),
      );
      // Usamos .getAddress() em vez de .address para garantir que o endereço é carregado, se necessário.

      // Defina um valor mínimo razoável para o gás (ex: 0.05 CELO, ou 5e16 wei)
      // Este é apenas um limite de segurança para a execução
      const MIN_FUNDS_REQUIRED = ethers.utils.parseEther("0.05");

      if (nativeBalance.lt(MIN_FUNDS_REQUIRED)) {
        this.logger.error(
          `${fnTag} Saldo de CELO insuficiente. Necessário: > ${ethers.utils.formatEther(MIN_FUNDS_REQUIRED)} CELO. Saldo Atual: ${ethers.utils.formatEther(nativeBalance)} CELO.`,
        );
        throw new Error(
          "Erro de Fundos Insuficientes: Adicione CELO à carteira para taxas de gás.",
        );
      }

      // // 1. Setup
      // const router = new ethers.Contract(
      //   process.env.ROUTER!, // Ex: SushiSwap em Polygon
      //   [
      //     "function swapExactTokensForTokens(uint256 amountIn,uint256 amountOutMin,address[] path,address to,uint256 deadline) external returns (uint256[] memory)",
      //   ],
      //   this.signer,
      // );

      // if (_request.paymentToken === undefined) {
      //   _request.paymentToken = process.env.USDC!;
      // }

      // const usdc = new ethers.Contract(
      //   _request.paymentToken,
      //   [
      //     "function approve(address spender, uint256 value) external returns (bool)",
      //   ],
      //   this.signer,
      // );

      // 2. Swap USDC → NCT
      // this.logger.debug(
      //   `${fnTag}  Swapping ${_request.paymentToken} for pool tokens...`,
      // );
      // const amountIn = utils.parseUnits(String(_request.amount), 6); // not this amount. This will be the amount of carbon credits in tonnes
      // const path = [_request.paymentToken, process.env.NCT!];
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
        process.env.NCT!,
        [
          "function approve(address spender, uint256 value) external returns (bool)",
          "function balanceOf(address account) external view returns (uint256)",
          "function redeemAuto(uint256 amount) external returns (uint256[] memory)",
          "event Redeem(address indexed tco2, uint256 amount)",
        ],
        this.signer,
      );

      const nctBalance = await nct.balanceOf(this.signer.address);
      await nct.approve(process.env.NCT!, 2n ** 256n); // infinite approval per #332
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

  public retire(_request: RetireRequest): Promise<RetireResponse> {
    throw new Error("Method not implemented.");
  }

  public async getAvailableTCO2s(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _request: GetAvailableTCO2sRequest,
  ): Promise<GetAvailableTCO2sResponse> {
    try {
      const fnTag = `${ToucanLeaf.CLASS_NAME}#getAvailableTCO2s()`;
      this.logger.info(
        `Fetching available VCUs for marketplace ${_request.marketplace}`,
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      const tco2List =
        _request.limit != null
          ? projects.slice(0, Number(_request.limit)).map((p) => p.addr)
          : projects.slice(0, 100).map((p) => p.addr);

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getVCUMetadata(
    _req: GetVCUMetadataRequest,
  ): Promise<VCUMetadata> {
    try {
      this.logger.info(
        `Fetching metadata for VCU with ID: ${_req.vcuIdentifier}`,
      );
      // Fetch redeemable TCO2s ordered by Toucan score
      const tco2Addresses: string[] =
        await this.toucanClient.getScoredTCO2s("NCT");

      // Pull project data
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

      // Find matching project + VCU
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
        totalSupply: Number(found.totalSupply),
        attributes: {
          region: found.attrs.region ?? "",
          vintage: found.attrs.vintage ?? "",
          methodology: found.attrs.methodology ?? "",
          other: found.attrs.other ?? "",
        },
      };
    } catch (err) {
      this.logger.error("Error in getVCUMetadata:", err);
      throw new Error(`VCU with ID ${_req.vcuIdentifier} not found.`);
    }
  }

  public async getPurchasePrice(
    request: GetPurchasePriceRequest,
  ): Promise<GetPurchasePriceResponse> {
    // Placeholder logic for price retrieval
    this.logger.info(
      `Fetching purchase price for ${request.amount} units of carbon credits.`,
    );

    // Sushi/Uniswap-v2-compatible router on Polygon
    const router = new ethers.Contract(
      "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
      [
        "function getAmountsIn(uint256 amountOut, address[] calldata path) external view returns (uint256[] memory)",
      ],
      this.provider,
    );
    // Inputs
    const USDC = process.env.USDC!; // e.g. 6 decimals
    const UNIT = request.unit; // Unit token to price (e.g. NCT, 18 decimals)
    const unitAmount = utils.parseUnits(request.amount.toString(), 18); // price 10 Units
    // USDC -> UNIT path
    const path = [USDC, UNIT];
    // amounts[0] = USDC required, amounts[1] = UNIT out
    const amounts = await router.getAmountsIn(unitAmount, path);
    const usdcRequired = amounts[0];

    this.logger.info(
      `The total purchase price for ${request.amount} units is ${usdcRequired} USDC.`,
    );

    return {
      price: usdcRequired.toString(),
    };
  }
}
