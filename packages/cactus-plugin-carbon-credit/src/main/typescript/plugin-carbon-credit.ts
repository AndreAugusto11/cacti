import OAS from "../json/openapi.json";

import {
  IWebServiceEndpoint,
  IPluginWebService,
  ICactusPlugin,
  ICactusPluginOptions,
} from "@hyperledger/cactus-core-api";
import type { Express } from "express";

import {
  Checks,
  Logger,
  LoggerProvider,
  LogLevelDesc,
} from "@hyperledger/cactus-common";

import { BuyEndpoint } from "./web-services/buy-endpoint";
import { RetireEndpoint } from "./web-services/retire-endpoint";
import { GetAvailableVCUsEndpoint } from "./web-services/get-available-vcus-endpoint";
import { GetVCUMetadataEndpoint } from "./web-services/get-vcu-metadata-endpoint";
import { Web3SigningCredentialPrivateKeyHex } from "@hyperledger/cactus-plugin-ledger-connector-ethereum";
import {
  BuyRequest,
  BuyResponse,
  RetireRequest,
  RetireResponse,
  GetAvailableVCUsResponse,
  GetVCUMetadataRequest,
  VCUMetadata,
  GetAvailableVCUsRequest,
  Platform,
  Network,
} from "./generated/openapi/typescript-axios";
import { ToucanLeaf } from "./implementations/toucan-leaf";
import { CarbonMarketplaceAbstract } from "./carbon-marketplace-abstract";

export interface IPluginCarbonCreditOptions extends ICactusPluginOptions {
  instanceId: string;
  signingCredential: Web3SigningCredentialPrivateKeyHex;
  logLevel?: LogLevelDesc;
}

export class PluginCarbonCredit implements ICactusPlugin, IPluginWebService {
  public static readonly CLASS_NAME = "PluginCarbonCredit";

  private readonly instanceId: string;
  private readonly log: Logger;
  private endpoints: IWebServiceEndpoint[] | undefined;

  public get className(): string {
    return PluginCarbonCredit.CLASS_NAME;
  }

  constructor(public readonly options: IPluginCarbonCreditOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.instanceId, `${fnTag} options.instanceId`);

    this.instanceId = options.instanceId;

    const level = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  public getOpenApiSpec(): unknown {
    return OAS;
  }

  public getInstanceId(): string {
    return this.instanceId;
  }

  public async shutdown(): Promise<void> {
    this.log.info(`Shutting down ${this.className}...`);
  }

  public async onPluginInit(): Promise<unknown> {
    return;
  }

  async registerWebServices(app: Express): Promise<IWebServiceEndpoint[]> {
    const webServices = await this.getOrCreateWebServices();
    await Promise.all(webServices.map((ws) => ws.registerExpress(app)));
    return webServices;
  }

  public async getOrCreateWebServices(): Promise<IWebServiceEndpoint[]> {
    if (Array.isArray(this.endpoints)) {
      return this.endpoints;
    }
    const endpoints: IWebServiceEndpoint[] = [];
    {
      const endpoint = new BuyEndpoint({
        connector: this,
        logLevel: this.options.logLevel,
      });
      endpoints.push(endpoint);
    }
    {
      const endpoint = new RetireEndpoint({
        connector: this,
        logLevel: this.options.logLevel,
      });
      endpoints.push(endpoint);
    }
    {
      const endpoint = new GetAvailableVCUsEndpoint({
        connector: this,
        logLevel: this.options.logLevel,
      });
      endpoints.push(endpoint);
    }
    {
      const endpoint = new GetVCUMetadataEndpoint({
        connector: this,
        logLevel: this.options.logLevel,
      });
      endpoints.push(endpoint);
    }
    this.endpoints = endpoints;
    return endpoints;
  }

  public getPackageName(): string {
    return `@hyperledger/cactus-plugin-carbon-credit`;
  }

  public getMarketplaceImplementation(
    platform: string,
    network: Network,
  ): CarbonMarketplaceAbstract {
    switch (platform) {
      case Platform.Toucan:
        return new ToucanLeaf({
          network: network,
          signingCredential: this.options.signingCredential,
        });
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  public async buy(request: BuyRequest): Promise<BuyResponse> {
    this.log.info(`Received buy request for ${request.amount} units.`);

    const marketplaceImplementation: CarbonMarketplaceAbstract =
      this.getMarketplaceImplementation(request.platform, request.network);

    const response = await marketplaceImplementation.buy(request);

    return response;
  }

  public async retire(request: RetireRequest): Promise<RetireResponse> {
    const fnTag = `${this.className}#retire()`;
    this.log.info(`Received retire request on platform ${request.platform}`);

    // Step 1: Transfer the tokens to be withdrawn to the contract
    this.log.debug(`${fnTag} Burning ${request.amounts.join(", ")} units...`);
    const txHashRetire = "txHashRetire_placeholder"; // Replace with real withdrawal logic

    // Step 2: Optional - Generate withdrawal certificate
    this.log.debug(`${fnTag} Generating retirement certificate...`);
    const retirementCertificate = "retirementCertificate_placeholder"; // Replace with real certificate logic

    const response: RetireResponse = {
      txHashRetire,
      retirementCertificate,
    };

    this.log.info(`Retire operation completed successfully.`);
    return response;
  }

  public async getAvailableVCUs(
    request: GetAvailableVCUsRequest,
  ): Promise<GetAvailableVCUsResponse> {
    const marketplaceImplementation: CarbonMarketplaceAbstract =
      this.getMarketplaceImplementation(request.platform, request.network);

    const response = await marketplaceImplementation.getAvailableVCUs(request);

    return response;
  }

  public async getVCUMetadata(
    request: GetVCUMetadataRequest,
  ): Promise<VCUMetadata> {
    const marketplaceImplementation: CarbonMarketplaceAbstract =
      this.getMarketplaceImplementation(request.platform, request.network);

    const response = await marketplaceImplementation.getVCUMetadata(request);

    if (!response) {
      throw new Error(`VCU with ID ${request.vcuIdentifier} not found.`);
    }
    return response;
  }

  public async sell(): Promise<void> {
    // Placeholder for sell functionality
    this.log.info("Sell functionality not implemented yet.");
  }

  public async listVCUs(): Promise<void> {
    // Placeholder for listing VCUs functionality
    this.log.info("List VCUs functionality not implemented yet.");
  }
}
