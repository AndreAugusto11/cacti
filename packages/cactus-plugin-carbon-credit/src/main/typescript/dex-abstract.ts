import type { LogLevelDesc } from "@hyperledger/cactus-common";
import { Network } from "./public-api";
import { ethers } from "ethers";

/**
 * Common interface options for all Carbon Credit Marketplaces.
 */
export interface DexAbstractOptions {
  logLevel?: LogLevelDesc;
  provider: ethers.providers.JsonRpcProvider;
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
  public abstract swap(
    fromToken: string,
    toToken: string,
    amount: string,
  ): Promise<string>;

  /**
   * Abstract operation to get a quote for a token swap on the DEX.
   * @param {string} fromToken - The address or symbol of the token to swap from.
   * @param {string} amount - The amount of fromToken to swap.
   * @returns {Promise<string>} A promise that resolves to the quoted amount of toToken.
   * @throws Will throw an error if the quote retrieval fails.
   * @abstract
   */
  public abstract getUSDCQuote(
    fromToken: string,
    amount: string,
    network: Network,
  ): Promise<string>;
}
