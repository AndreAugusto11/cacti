import { Logger, LogLevelDesc } from "@hyperledger/cactus-common";
import { DexAbstract, DexAbstractOptions } from "../dex-abstract";
import { Network } from "../public-api";
import { ethers } from "ethers";
import dotenv from "dotenv";
import { getDefaultDex, getTokenByAddress, getTokenBySymbol } from "../utils";
import { Token } from "@uniswap/sdk-core";
import { FeeAmount, computePoolAddress } from "@uniswap/v3-sdk";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json";

dotenv.config({ path: "packages/cactus-plugin-carbon-credit/.env" });

export interface IUniswapLeafOptions extends DexAbstractOptions {}

export class UniswapLeaf extends DexAbstract {
  public static CLASS_NAME = "UniswapLeaf";

  protected readonly log: Logger;
  protected readonly logLevel: LogLevelDesc;
  private readonly provider: ethers.providers.JsonRpcProvider;

  constructor(public readonly options: IUniswapLeafOptions) {
    super();
    const fnTag = `${UniswapLeaf.CLASS_NAME}#constructor()`;
    if (!options) {
      throw new Error(`${fnTag} options was not defined.`);
    }
    if (!options.provider) {
      throw new Error(`${fnTag} options.provider was not defined.`);
    }
    this.logLevel = options.logLevel || "INFO";
    this.log = new Logger({
      label: UniswapLeaf.CLASS_NAME,
      level: this.logLevel,
    });
    this.provider = options.provider;
  }

  /**
   * Swap tokens on Uniswap.
   * @param {string} fromToken - The address or symbol of the token to swap from.
   * @param {string} toToken - The address or symbol of the token to swap to.
   * @param {string} amount - The amount of fromToken to swap.
   * @returns {Promise<string>} A promise that resolves to the transaction hash or swap result.
   */
  public async swap(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fromToken: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toToken: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    amount: string,
  ): Promise<string> {
    // Blank implementation
    return "";
  }

  /**
   * Get a quote for a token swap on Uniswap.
   * @param {string} fromToken - The address or symbol of the token to swap from.
   * @param {string} toToken - The address or symbol of the token to swap to.
   * @param {string} amount - The amount of fromToken to swap.
   * @returns {Promise<string>} A promise that resolves to the quoted amount of toToken.
   */
  public async getUSDCQuote(
    fromToken: string,
    amount: string,
    network: Network,
  ): Promise<string> {
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
        this.provider,
      );

      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [token0, token1, fee] = await Promise.all([
          poolContract.token0(),
          poolContract.token1(),
          poolContract.fee(),
          poolContract.liquidity(),
          poolContract.slot0(),
        ]);

        this.log.debug(
          `Found pool for ${SWAP_TOKEN.symbol}/${USDC_TOKEN.symbol} on fee tier ${fee} at address ${currentPoolAddress}`,
        );

        const quoterContract = new ethers.Contract(
          getDefaultDex(network).quoter,
          Quoter.abi,
          this.provider,
        );

        try {
          const result = await quoterContract.callStatic.quoteExactInputSingle({
            tokenIn: token1,
            tokenOut: token0,
            amountIn: amount,
            fee: fee,
            sqrtPriceLimitX96: 0,
          });

          return result.amountOut;
        } catch (error) {
          this.log.error(`Error during quoting: ${error}`);
          throw error;
        }
      } catch (error) {
        this.log.warn(
          `Pool not found for fee tier ${fee} on address ${currentPoolAddress}. Trying next fee tier...`,
        );
      }
    }

    throw new Error(
      `No pool found for ${SWAP_TOKEN.symbol}/${USDC_TOKEN.symbol} on any fee tier.`,
    );
  }
}
