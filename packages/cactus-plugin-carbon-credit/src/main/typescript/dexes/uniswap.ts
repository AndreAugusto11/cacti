import { Logger, LogLevelDesc } from "@hyperledger/cactus-common";
import { DexAbstract, DexAbstractOptions } from "../dex-abstract";
import { Network } from "../public-api";
import { ethers, Signer } from "ethers";
import dotenv from "dotenv";
import {
  approveERC20IfNeeded,
  getBalances,
  getDefaultDex,
  getTokenByAddress,
  getTokenBySymbol,
} from "../utils";
import { Token } from "@uniswap/sdk-core";
import { FeeAmount, computePoolAddress } from "@uniswap/v3-sdk";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json";
import routerABI from "../ABIs/uniswap-router.json";
import { Quote } from "../types";

dotenv.config({ path: "packages/cactus-plugin-carbon-credit/.env" });

export interface IUniswapOptions extends DexAbstractOptions {}

/**
 * An implementation of the DexAbstract class for Uniswap.
 * This class provides methods to interact with the Uniswap decentralized exchange,
 * including swapping tokens and fetching quotes.
 *
 * @extends DexAbstract
 * @example
 * ```typescript
 * import { UniswapImpl } from "./dexes/uniswap";
 * import { ethers } from "ethers";
 *
 * const provider = new ethers.providers.JsonRpcProvider("<RPC_URL>");
 * const uniswap = new UniswapImpl({ logLevel: "INFO" });
 * ```
 */
export class UniswapImpl extends DexAbstract {
  public static CLASS_NAME = "UniswapImpl";

  protected readonly log: Logger;
  protected readonly logLevel: LogLevelDesc;
  protected readonly signer: Signer;

  constructor(public readonly options: IUniswapOptions) {
    super();
    const fnTag = `${UniswapImpl.CLASS_NAME}#constructor()`;
    if (!options) {
      throw new Error(`${fnTag} options was not defined.`);
    }

    this.signer = options.signer;

    this.logLevel = options.logLevel || "INFO";
    this.log = new Logger({
      label: UniswapImpl.CLASS_NAME,
      level: this.logLevel,
    });
  }

  public async swapExactFromUSDC(
    toToken: string,
    amountOut: string, // amount of NCT we want to buy
    network: Network,
  ): Promise<string> {
    const fnTag = `${UniswapImpl.CLASS_NAME}#swapFromUSDC()`;

    // Step 0: Get USDC quote for amountOut of NCT for allowance estimation
    const quote = await this.getUSDCQuote(toToken, amountOut, network);

    // Step 1: Determine router + USDC address
    const routerAddress = getDefaultDex(network).router;

    const USDC_ADDRESS = getTokenBySymbol(network, "USDC").address;

    const router = new ethers.Contract(routerAddress, routerABI, this.signer);

    await getBalances(
      this.log,
      await this.signer.getAddress(),
      this.signer.provider!,
    );

    // Step 2: Approve router to spend USDC (infinite approval for simplicity) if not already approved
    const approvalTx = await approveERC20IfNeeded(
      USDC_ADDRESS,
      this.signer,
      routerAddress,
      BigInt(quote.amountIn),
    );

    if (approvalTx) {
      this.log.info(
        `${fnTag} Approved Uniswap router to spend USDC. Approval tx hash: ${approvalTx}`,
      );
    }

    const recipient = ethers.utils.getAddress(await this.signer.getAddress());

    const params = {
      tokenIn: ethers.utils.getAddress(USDC_ADDRESS),
      tokenOut: ethers.utils.getAddress(toToken),
      fee: quote.fee,
      recipient,
      amountOut: ethers.BigNumber.from(amountOut),
      amountInMaximum: ethers.BigNumber.from(
        ((BigInt(quote.amountIn) * 105n) / 100n).toString(),
      ), // add 5% slippage tolerance
      sqrtPriceLimitX96: ethers.BigNumber.from(0),
    };

    this.log.debug(`${fnTag} Swap params: ${JSON.stringify(params)}`);

    const tx = await router.exactOutputSingle(params);
    const receipt = await tx.wait();
    this.log.info(`${fnTag} Swap successful: ${receipt.transactionHash}`);

    await getBalances(
      this.log,
      await this.signer.getAddress(),
      this.signer.provider!,
    );

    return receipt.transactionHash;
  }

  public async getUSDCQuote(
    fromToken: string,
    amount: string,
    network: Network,
  ): Promise<Quote> {
    const fnTag = `${UniswapImpl.CLASS_NAME}#getUSDCQuote()`;

    const usdcInfo = getTokenBySymbol(network, "USDC");
    const USDC_TOKEN = new Token(
      usdcInfo.chainId,
      usdcInfo.address,
      usdcInfo.decimals,
      usdcInfo.symbol,
      usdcInfo.name,
    );

    const swapToken = getTokenByAddress(network, fromToken);
    const SWAP_TOKEN = new Token(
      swapToken.chainId,
      swapToken.address,
      swapToken.decimals,
      swapToken.symbol,
      swapToken.name,
    );

    let currentPoolAddress: string | null = null;
    let fee: FeeAmount | null = null;

    for (fee of [FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH]) {
      currentPoolAddress = computePoolAddress({
        factoryAddress: getDefaultDex(network).factory,
        tokenA: USDC_TOKEN,
        tokenB: SWAP_TOKEN,
        fee: fee,
        chainId: USDC_TOKEN.chainId,
      });

      const poolContract = new ethers.Contract(
        currentPoolAddress,
        IUniswapV3PoolABI.abi,
        this.signer,
      );

      try {
        const [token0, token1, fee] = await Promise.all([
          poolContract.token0(),
          poolContract.token1(),
          poolContract.fee(),
          poolContract.liquidity(),
          poolContract.slot0(),
        ]);

        this.log.debug(
          `${fnTag} Found pool for ${token0}/${token1} on fee tier ${fee} at address ${currentPoolAddress}`,
        );

        const quoterContract = new ethers.Contract(
          getDefaultDex(network).quoter,
          Quoter.abi,
          this.signer,
        );

        try {
          const result = await quoterContract.callStatic.quoteExactInputSingle({
            tokenIn: token1,
            tokenOut: token0,
            amountIn: amount,
            fee: fee,
            sqrtPriceLimitX96: 0,
          });

          return {
            amountIn: amount,
            amountOut: result.amountOut.toString(),
            poolAddress: currentPoolAddress,
            fee: fee,
            timestamp: Date.now(),
          } as Quote;
        } catch (error) {
          this.log.error(`${fnTag} Error during quoting: ${error}`);
          throw error;
        }
      } catch (error) {
        this.log.warn(
          `${fnTag} Pool not found for fee tier ${fee} on address ${currentPoolAddress}. Trying next fee tier...\nError: ${error}`,
        );
      }
    }

    throw new Error(
      `${fnTag} No pool found for ${SWAP_TOKEN.symbol}/${USDC_TOKEN.symbol} on any fee tier.`,
    );
  }
}
