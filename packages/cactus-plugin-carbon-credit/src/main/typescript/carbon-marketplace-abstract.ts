import type { LogLevelDesc } from "@hyperledger/cactus-common";
import {
  BuyRequest,
  BuyResponse,
  GetAvailableVCUsRequest,
  GetAvailableVCUsResponse,
  GetVCUMetadataRequest,
  Network,
  RetireRequest,
  VCUMetadata,
} from "./public-api";
import { RetireEndpoint } from "./web-services/retire-endpoint";
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
   * Abstract method to buy carbon credits.
   * @param {BuyRequest} request - The request object containing details for the purchase.
   * @returns {Promise<BuyResponse>} A promise that resolves to the response of the purchase.
   * @throws Will throw an error if the purchase fails.
   * @abstract
   */
  public abstract buy(request: BuyRequest): Promise<BuyResponse>;

  /**
   * Abstract method to retire a VCU.
   * @param {string} vcuIdentifier - The identifier of the VCU to retire.
   * @returns {Promise<void>} A promise that resolves when the VCU is retired.
   * @throws Will throw an error if the retirement fails.
   * @abstract
   */
  public abstract retire(request: RetireRequest): Promise<RetireEndpoint>;

  /**
   * Abstract method to get available VCUs.
   * @returns {Promise<string[]>} A promise that resolves to an array of available VCU identifiers.
   * @throws Will throw an error if the retrieval fails.
   * @abstract
   */
  public abstract getAvailableVCUs(
    request: GetAvailableVCUsRequest,
  ): Promise<GetAvailableVCUsResponse>;

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
}
