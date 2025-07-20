import type { LogLevelDesc } from "@hyperledger/cactus-common";
import {
  GetAvailableTCO2sRequest,
  GetAvailableTCO2sResponse,
  GetTCO2MetadataRequest,
  SpecificBuyRequest,
  SpecificBuyResponse,
  RandomBuyResponse,
  RandomBuyRequest,
  RetireRequest,
  RetireResponse,
  TCO2Metadata,
  Network,
} from "./public-api";
import { ethers } from "ethers";
import { DexAbstract } from "./dex-abstract";

/**
 * Common interface options for all Carbon Credit Marketplaces.
 */
export interface CarbonMarketplaceAbstractOptions {
  logLevel?: LogLevelDesc;
  network: Network;
  signer: ethers.Signer;
  dexImpl: DexAbstract;
}

/**
 * An abstract class representing a Carbon Credit Marketplace.
 * This class defines the common interface and operations that any specific
 * carbon credit marketplace implementation must provide.
 */
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
   * Abstract method to get the metadata of a TCO2.
   * @param {string} tco2Identifier - The identifier of the TCO2.
   * @returns {Promise<TCO2Metadata>} A promise that resolves to the metadata of the TCO2.
   * @throws Will throw an error if the retrieval fails.
   * @abstract
   */
  public abstract getTCO2Metadata(
    req: GetTCO2MetadataRequest,
  ): Promise<TCO2Metadata>;
}
