import type { LogLevelDesc } from "@hyperledger/cactus-common";
import {
  GetAvailableTCO2sRequest,
  GetAvailableTCO2sResponse,
  GetVCUMetadataRequest,
  Network,
  SpecificBuyRequest,
  SpecificBuyResponse,
  RandomBuyResponse,
  RandomBuyRequest,
  RetireRequest,
  RetireResponse,
  VCUMetadata,
  GetPurchasePriceRequest,
  GetPurchasePriceResponse,
} from "./public-api";
import {
  GasTransactionConfig,
  Web3SigningCredentialPrivateKeyHex,
} from "@hyperledger/cactus-plugin-ledger-connector-ethereum";

/**
 * Common interface options for all Carbon Credit Marketplaces.
 */
export interface CarbonMarketplaceAbstractOptions {
  logLevel?: LogLevelDesc;
  signingCredential: Web3SigningCredentialPrivateKeyHex;
  network: Network;
  gasConfig?: GasTransactionConfig;
}

export abstract class CarbonMarketplaceAbstract {
  /**
   * Logging level.
   *
   * @protected
   * @abstract
   * @readonly
   */
  protected abstract readonly logLevel: LogLevelDesc;

  /**
   * Abstract operation that acquires a specific basket of carbon credits from a marketplace.
   * @param {SpecificBuyRequest} request - The request object containing details for the purchase.
   * @returns {Promise<SpecificBuyResponse>} A promise that resolves to the response of the purchase.
   * @throws Will throw an error if the purchase fails.
   * @abstract
   */
  public abstract specificBuy(
    request: SpecificBuyRequest,
  ): Promise<SpecificBuyResponse>;

  /**
   * Abstract operation that acquires a random basket of carbon credits from a marketplace.
   * @param {RandomBuyRequest} request - The request object containing details for the purchase.
   * @returns {Promise<RandomBuyResponse>} A promise that resolves to the response of the purchase.
   * @throws Will throw an error if the purchase fails.
   * @abstract
   */
  public abstract randomBuy(
    request: RandomBuyRequest,
  ): Promise<RandomBuyResponse>;

  /**
   * Abstract method to retire a VCU.
   * @param {string} vcuIdentifier - The identifier of the VCU to retire.
   * @returns {Promise<void>} A promise that resolves when the VCU is retired.
   * @throws Will throw an error if the retirement fails.
   * @abstract
   */
  public abstract retire(request: RetireRequest): Promise<RetireResponse>;

  /**
   * Abstract method to get available VCUs.
   * @returns {Promise<string[]>} A promise that resolves to an array of available VCU identifiers.
   * @throws Will throw an error if the retrieval fails.
   * @abstract
   */
  public abstract getAvailableTCO2s(
    request: GetAvailableTCO2sRequest,
  ): Promise<GetAvailableTCO2sResponse>;

  /**
   * Abstract method to get the metadata of a VCU.
   * @param {string} vcuIdentifier - The identifier of the VCU.
   * @returns {Promise<VCUMetadata>} A promise that resolves to the metadata of the VCU.
   * @throws Will throw an error if the retrieval fails.
   * @abstract
   */
  public abstract getVCUMetadata(
    req: GetVCUMetadataRequest,
  ): Promise<VCUMetadata>;

  /**
   * Abstract operation that retrieves the current price (in USDC) of a Unit token from a marketplace.
   * @param {GetPurchasePriceRequest} request - The request object containing details for the purchase.
   * @returns {Promise<GetPurchasePriceResponse>} The current price for the amount of Unit tokens in USDC.
   * @throws Will throw an error if the retrieval fails.
   * @abstract
   */
  public abstract getPurchasePrice(
    request: GetPurchasePriceRequest,
  ): Promise<GetPurchasePriceResponse>;
}
