import { Logger, LogLevelDesc } from "@hyperledger/cactus-common";
import { DexAbstract, DexAbstractOptions } from "../dex-abstract";
import { Network } from "../public-api";
import { ethers, Signer } from "ethers";
import dotenv from "dotenv";
import {
  getDefaultDex,
  getERC20Allowance,
  getERC20Balance,
  getTokenByAddress,
  getTokenBySymbol,
} from "../utils";
import { Token } from "@uniswap/sdk-core";
import { FeeAmount, computePoolAddress } from "@uniswap/v3-sdk";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json";

import { Quote } from "../types";

dotenv.config({ path: "packages/cactus-plugin-carbon-credit/.env" });

export interface IUniswapOptions extends DexAbstractOptions {}

export class UniswapImpl extends DexAbstract {
  public static CLASS_NAME = "UniswapImpl";

  protected readonly log: Logger;
  protected readonly logLevel: LogLevelDesc;
  private readonly provider: ethers.providers.JsonRpcProvider;

  constructor(public readonly options: IUniswapOptions) {
    super();
    const fnTag = `${UniswapImpl.CLASS_NAME}#constructor()`;
    if (!options) {
      throw new Error(`${fnTag} options was not defined.`);
    }
    if (!options.provider) {
      throw new Error(`${fnTag} options.provider was not defined.`);
    }
    this.logLevel = options.logLevel || "INFO";
    this.log = new Logger({
      label: UniswapImpl.CLASS_NAME,
      level: this.logLevel,
    });
    this.provider = options.provider;
  }

  public async swapExactFromUSDC(
    signer: Signer,
    toToken: string,
    amountOut: string, // amount of NCT we want to buy
    network: Network,
  ): Promise<void> {
    const fnTag = `${UniswapImpl.CLASS_NAME}#swapFromUSDC()`;

    // Step 0: Get USDC quote for amountOut of NCT for allowance estimation
    const quote = await this.getUSDCQuote(toToken, amountOut, network);

    // Step 1: Determine router + USDC address
    const routerAddress = getDefaultDex(network).router;

    const USDC_ADDRESS = getTokenBySymbol(network, "USDC").address;

    const router = new ethers.Contract(
      routerAddress,
      [
        {
          inputs: [
            { internalType: "address", name: "_factoryV2", type: "address" },
            { internalType: "address", name: "factoryV3", type: "address" },
            {
              internalType: "address",
              name: "_positionManager",
              type: "address",
            },
            { internalType: "address", name: "_WETH9", type: "address" },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "WETH9",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "address", name: "token", type: "address" }],
          name: "approveMax",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [{ internalType: "address", name: "token", type: "address" }],
          name: "approveMaxMinusOne",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [{ internalType: "address", name: "token", type: "address" }],
          name: "approveZeroThenMax",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [{ internalType: "address", name: "token", type: "address" }],
          name: "approveZeroThenMaxMinusOne",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
          name: "callPositionManager",
          outputs: [{ internalType: "bytes", name: "result", type: "bytes" }],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "bytes[]", name: "paths", type: "bytes[]" },
            { internalType: "uint128[]", name: "amounts", type: "uint128[]" },
            {
              internalType: "uint24",
              name: "maximumTickDivergence",
              type: "uint24",
            },
            { internalType: "uint32", name: "secondsAgo", type: "uint32" },
          ],
          name: "checkOracleSlippage",
          outputs: [],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "bytes", name: "path", type: "bytes" },
            {
              internalType: "uint24",
              name: "maximumTickDivergence",
              type: "uint24",
            },
            { internalType: "uint32", name: "secondsAgo", type: "uint32" },
          ],
          name: "checkOracleSlippage",
          outputs: [],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                { internalType: "bytes", name: "path", type: "bytes" },
                { internalType: "address", name: "recipient", type: "address" },
                { internalType: "uint256", name: "amountIn", type: "uint256" },
                {
                  internalType: "uint256",
                  name: "amountOutMinimum",
                  type: "uint256",
                },
              ],
              internalType: "struct IV3SwapRouter.ExactInputParams",
              name: "params",
              type: "tuple",
            },
          ],
          name: "exactInput",
          outputs: [
            { internalType: "uint256", name: "amountOut", type: "uint256" },
          ],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                { internalType: "address", name: "tokenIn", type: "address" },
                { internalType: "address", name: "tokenOut", type: "address" },
                { internalType: "uint24", name: "fee", type: "uint24" },
                { internalType: "address", name: "recipient", type: "address" },
                { internalType: "uint256", name: "amountIn", type: "uint256" },
                {
                  internalType: "uint256",
                  name: "amountOutMinimum",
                  type: "uint256",
                },
                {
                  internalType: "uint160",
                  name: "sqrtPriceLimitX96",
                  type: "uint160",
                },
              ],
              internalType: "struct IV3SwapRouter.ExactInputSingleParams",
              name: "params",
              type: "tuple",
            },
          ],
          name: "exactInputSingle",
          outputs: [
            { internalType: "uint256", name: "amountOut", type: "uint256" },
          ],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                { internalType: "bytes", name: "path", type: "bytes" },
                { internalType: "address", name: "recipient", type: "address" },
                { internalType: "uint256", name: "amountOut", type: "uint256" },
                {
                  internalType: "uint256",
                  name: "amountInMaximum",
                  type: "uint256",
                },
              ],
              internalType: "struct IV3SwapRouter.ExactOutputParams",
              name: "params",
              type: "tuple",
            },
          ],
          name: "exactOutput",
          outputs: [
            { internalType: "uint256", name: "amountIn", type: "uint256" },
          ],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                { internalType: "address", name: "tokenIn", type: "address" },
                { internalType: "address", name: "tokenOut", type: "address" },
                { internalType: "uint24", name: "fee", type: "uint24" },
                { internalType: "address", name: "recipient", type: "address" },
                { internalType: "uint256", name: "amountOut", type: "uint256" },
                {
                  internalType: "uint256",
                  name: "amountInMaximum",
                  type: "uint256",
                },
                {
                  internalType: "uint160",
                  name: "sqrtPriceLimitX96",
                  type: "uint160",
                },
              ],
              internalType: "struct IV3SwapRouter.ExactOutputSingleParams",
              name: "params",
              type: "tuple",
            },
          ],
          name: "exactOutputSingle",
          outputs: [
            { internalType: "uint256", name: "amountIn", type: "uint256" },
          ],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "factory",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "factoryV2",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
          ],
          name: "getApprovalType",
          outputs: [
            {
              internalType: "enum IApproveAndCall.ApprovalType",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                { internalType: "address", name: "token0", type: "address" },
                { internalType: "address", name: "token1", type: "address" },
                { internalType: "uint256", name: "tokenId", type: "uint256" },
                {
                  internalType: "uint256",
                  name: "amount0Min",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "amount1Min",
                  type: "uint256",
                },
              ],
              internalType: "struct IApproveAndCall.IncreaseLiquidityParams",
              name: "params",
              type: "tuple",
            },
          ],
          name: "increaseLiquidity",
          outputs: [{ internalType: "bytes", name: "result", type: "bytes" }],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                { internalType: "address", name: "token0", type: "address" },
                { internalType: "address", name: "token1", type: "address" },
                { internalType: "uint24", name: "fee", type: "uint24" },
                { internalType: "int24", name: "tickLower", type: "int24" },
                { internalType: "int24", name: "tickUpper", type: "int24" },
                {
                  internalType: "uint256",
                  name: "amount0Min",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "amount1Min",
                  type: "uint256",
                },
                { internalType: "address", name: "recipient", type: "address" },
              ],
              internalType: "struct IApproveAndCall.MintParams",
              name: "params",
              type: "tuple",
            },
          ],
          name: "mint",
          outputs: [{ internalType: "bytes", name: "result", type: "bytes" }],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "previousBlockhash",
              type: "bytes32",
            },
            { internalType: "bytes[]", name: "data", type: "bytes[]" },
          ],
          name: "multicall",
          outputs: [{ internalType: "bytes[]", name: "", type: "bytes[]" }],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "deadline", type: "uint256" },
            { internalType: "bytes[]", name: "data", type: "bytes[]" },
          ],
          name: "multicall",
          outputs: [{ internalType: "bytes[]", name: "", type: "bytes[]" }],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [{ internalType: "bytes[]", name: "data", type: "bytes[]" }],
          name: "multicall",
          outputs: [
            { internalType: "bytes[]", name: "results", type: "bytes[]" },
          ],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "positionManager",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
          ],
          name: "pull",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "refundETH",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
          ],
          name: "selfPermit",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "nonce", type: "uint256" },
            { internalType: "uint256", name: "expiry", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
          ],
          name: "selfPermitAllowed",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "nonce", type: "uint256" },
            { internalType: "uint256", name: "expiry", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
          ],
          name: "selfPermitAllowedIfNecessary",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
          ],
          name: "selfPermitIfNecessary",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "amountIn", type: "uint256" },
            { internalType: "uint256", name: "amountOutMin", type: "uint256" },
            { internalType: "address[]", name: "path", type: "address[]" },
            { internalType: "address", name: "to", type: "address" },
          ],
          name: "swapExactTokensForTokens",
          outputs: [
            { internalType: "uint256", name: "amountOut", type: "uint256" },
          ],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "amountOut", type: "uint256" },
            { internalType: "uint256", name: "amountInMax", type: "uint256" },
            { internalType: "address[]", name: "path", type: "address[]" },
            { internalType: "address", name: "to", type: "address" },
          ],
          name: "swapTokensForExactTokens",
          outputs: [
            { internalType: "uint256", name: "amountIn", type: "uint256" },
          ],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "address", name: "recipient", type: "address" },
          ],
          name: "sweepToken",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
          ],
          name: "sweepToken",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "uint256", name: "feeBips", type: "uint256" },
            { internalType: "address", name: "feeRecipient", type: "address" },
          ],
          name: "sweepTokenWithFee",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "address", name: "recipient", type: "address" },
            { internalType: "uint256", name: "feeBips", type: "uint256" },
            { internalType: "address", name: "feeRecipient", type: "address" },
          ],
          name: "sweepTokenWithFee",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "int256", name: "amount0Delta", type: "int256" },
            { internalType: "int256", name: "amount1Delta", type: "int256" },
            { internalType: "bytes", name: "_data", type: "bytes" },
          ],
          name: "uniswapV3SwapCallback",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "address", name: "recipient", type: "address" },
          ],
          name: "unwrapWETH9",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
          ],
          name: "unwrapWETH9",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "address", name: "recipient", type: "address" },
            { internalType: "uint256", name: "feeBips", type: "uint256" },
            { internalType: "address", name: "feeRecipient", type: "address" },
          ],
          name: "unwrapWETH9WithFee",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "uint256", name: "feeBips", type: "uint256" },
            { internalType: "address", name: "feeRecipient", type: "address" },
          ],
          name: "unwrapWETH9WithFee",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [{ internalType: "uint256", name: "value", type: "uint256" }],
          name: "wrapETH",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        { stateMutability: "payable", type: "receive" },
      ],
      signer,
    );

    const current_balance = await getERC20Balance(
      USDC_ADDRESS,
      await signer.getAddress(),
      this.provider,
    );

    this.log.info(
      `${fnTag} Current USDC balance: ${ethers.utils.formatUnits(
        current_balance,
        6,
      )} USDC`,
    );

    // Step 2: Approve router to spend USDC (infinite approval for simplicity) if not already approved

    const allowance = await getERC20Allowance(
      USDC_ADDRESS,
      await signer.getAddress(),
      routerAddress,
      this.provider,
    );

    this.log.info(
      `${fnTag} Current allowance for router to spend USDC: ${ethers.utils.formatUnits(
        allowance,
        6,
      )} USDC`,
    );

    if (
      ethers.BigNumber.from(allowance).lt(ethers.BigNumber.from(quote.amountIn))
    ) {
      this.log.info(
        `${fnTag} Insufficient allowance for router to spend USDC: ${allowance} < ${quote.amountIn}`,
      );

      const usdcContract = new ethers.Contract(
        USDC_ADDRESS,
        [
          "function allowance(address owner, address spender) view returns (uint256)",
          "function approve(address spender,uint256 amount) returns (bool)",
        ],
        signer,
      );

      const approveTx = await usdcContract.approve(
        routerAddress,
        ethers.constants.MaxUint256,
      );
      await approveTx.wait();
      this.log.info(`${fnTag} Router approved for USDC`);
    }

    const recipient = ethers.utils.getAddress(await signer.getAddress());

    const params = {
      tokenIn: ethers.utils.getAddress(USDC_ADDRESS),
      tokenOut: ethers.utils.getAddress(toToken),
      fee: quote.fee,
      recipient,
      amountOut: ethers.BigNumber.from(amountOut),
      amountInMaximum: ethers.BigNumber.from(
        Math.ceil(Number(quote.amountIn) * 1.05).toString(),
      ), // add 5% slippage tolerance
      sqrtPriceLimitX96: ethers.BigNumber.from(0),
    };

    this.log.info(`${fnTag} Swap params: ${JSON.stringify(params)}`);

    const tx = await router.exactOutputSingle(params);
    const receipt = await tx.wait();
    this.log.info(`${fnTag} Swap successful: ${receipt.transactionHash}`);
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
        this.provider,
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
