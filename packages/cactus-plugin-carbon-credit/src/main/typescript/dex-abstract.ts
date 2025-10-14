import type { LogLevelDesc } from "@hyperledger/cactus-common";
import { Network } from "./public-api";
import { ethers, Signer } from "ethers";
import { Quote } from "./types";

/**
 * Common interface options for all Carbon Credit Marketplaces.
 */
export interface DexAbstractOptions {
  logLevel?: LogLevelDesc;
  provider: ethers.providers.Provider;
}

export abstract class DexAbstract {
  /**
   * Logging level.
   *
   * @protected
   * @abstract
   * @readonly
   */
  protected abstract readonly logLevel: LogLevelDesc;

  /**
   * Abstract operation to swap tokens on the DEX.
   * @param {string} fromToken - The address or symbol of the token to swap from.
   * @param {string} toToken - The address or symbol of the token to swap to.
   * @param {string} amount - The amount of fromToken to swap.
   * @returns {Promise<string>} A promise that resolves to the transaction hash or swap result.
   * @throws Will throw an error if the swap fails.
   * @abstract
   */
  public abstract swapExactFromUSDC(
    signer: Signer,
    fromToken: string,
    toToken: string,
    amount: string,
  ): Promise<string>;

  /**
   * Abstract operation to get a quote for swapping from USDC to another token.
   * @param {string} fromToken - The address or symbol of the token to swap from USDC.
   * @param {string} amount - The amount of USDC to swap.
   * @param {Network} network - The network on which to get the quote.
   * @returns {Promise<Quote>} A promise that resolves to the quote details.
   * @throws Will throw an error if the quote retrieval fails.
   * @abstract
   */
  public abstract getUSDCQuote(
    fromToken: string,
    amount: string,
    network: Network,
  ): Promise<Quote>;
}
