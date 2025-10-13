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

import { SpecificBuyEndpoint } from "./web-services/specific-buy-endpoint";
import { RandomBuyEndpoint } from "./web-services/radom-buy-endpoints";
import { RetireEndpoint } from "./web-services/retire-endpoint";
import { GetAvailableTCO2sEndpoint } from "./web-services/get-available-tco2s-endpoint";
import { GetVCUMetadataEndpoint } from "./web-services/get-vcu-metadata-endpoint";
import { GetPurchasePriceEndpoint } from "./web-services/get-purchase-price";
import { Web3SigningCredentialPrivateKeyHex } from "@hyperledger/cactus-plugin-ledger-connector-ethereum";
import {
  SpecificBuyRequest,
  SpecificBuyResponse,
  RandomBuyRequest,
  RandomBuyResponse,
  RetireRequest,
  RetireResponse,
  GetAvailableTCO2sResponse,
  GetVCUMetadataRequest,
  VCUMetadata,
  GetAvailableTCO2sRequest,
  GetPurchasePriceRequest,
  GetPurchasePriceResponse,
  Marketplace,
  NetworkConfig,
  Network,
} from "./generated/openapi/typescript-axios";
import { ToucanLeaf } from "./implementations/toucan-leaf";
import { CarbonMarketplaceAbstract } from "./carbon-marketplace-abstract";
import { getDefaultDex, getTokenAddress } from "./utils";
import { ethers } from "ethers";

export interface IPluginCarbonCreditOptions extends ICactusPluginOptions {
  instanceId: string;
  signingCredential: Web3SigningCredentialPrivateKeyHex;
  networkConfig?: NetworkConfig[];
  logLevel?: LogLevelDesc;
}

export class PluginCarbonCredit implements ICactusPlugin, IPluginWebService {
  public static readonly CLASS_NAME = "PluginCarbonCredit";

  private readonly instanceId: string;
  private readonly log: Logger;
  private endpoints: IWebServiceEndpoint[] | undefined;

  private providers: Map<string, ethers.providers.JsonRpcProvider> = new Map();

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

    if (
      this.options.networkConfig &&
      Array.isArray(this.options.networkConfig)
    ) {
      for (const cfg of this.options.networkConfig) {
        this.providers.set(
          cfg.network,
          new ethers.providers.JsonRpcProvider(cfg.rpcUrl),
        );
      }
    } else {
      throw new Error(
        `${this.className}#constructor: networkConfig is required to initialize providers.`,
      );
    }
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
      const endpoint = new SpecificBuyEndpoint({
        plugin: this,
        logLevel: this.options.logLevel,
      });
      endpoints.push(endpoint);
    }
    {
      const endpoint = new RandomBuyEndpoint({
        plugin: this,
        logLevel: this.options.logLevel,
      });
      endpoints.push(endpoint);
    }
    {
      const endpoint = new RetireEndpoint({
        plugin: this,
        logLevel: this.options.logLevel,
      });
      endpoints.push(endpoint);
    }
    {
      const endpoint = new GetAvailableTCO2sEndpoint({
        plugin: this,
        logLevel: this.options.logLevel,
      });
      endpoints.push(endpoint);
    }
    {
      const endpoint = new GetVCUMetadataEndpoint({
        plugin: this,
        logLevel: this.options.logLevel,
      });
      endpoints.push(endpoint);
    }
    {
      const endpoint = new GetPurchasePriceEndpoint({
        plugin: this,
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

  public getRPCProvider(network: string): ethers.providers.JsonRpcProvider {
    const provider = this.providers.get(network);

    if (!provider) {
      throw new Error(
        `No provider found for network ${network}. Please check the plugin options and ensure the network configuration is correct.`,
      );
    }

    return provider;
  }

  public getMarketplaceImplementation(
    marketplace: string,
    network: Network,
  ): CarbonMarketplaceAbstract {
    const fnTag = `${this.className}#getMarketplaceImplementation()`;
    this.log.debug(
      `${fnTag} Getting marketplace implementation for ${marketplace} on network ${network}`,
    );

    if (!this.options.networkConfig) {
      throw new Error(
        `${fnTag} No network configuration provided in plugin options.`,
      );
    }

    const networkConfig = this.options.networkConfig.find(
      (config) => config.network === network,
    );

    if (!networkConfig) {
      throw new Error(
        `${fnTag} No network configuration found for network ${network}. Please check the plugin options.`,
      );
    }

    switch (marketplace) {
      case Marketplace.Toucan:
        return new ToucanLeaf({
          networkConfig: networkConfig,
          provider: this.getRPCProvider(network),
          signingCredential: this.options.signingCredential,
        });
      default:
        throw new Error(`Unsupported marketplace: ${marketplace}`);
    }
  }

  public async specificBuy(
    request: SpecificBuyRequest,
  ): Promise<SpecificBuyResponse> {
    const marketplaceImplementation: CarbonMarketplaceAbstract =
      this.getMarketplaceImplementation(request.marketplace, request.network);

    const response = await marketplaceImplementation.specificBuy(request);

    return response;
  }

  public async randomBuy(
    request: RandomBuyRequest,
  ): Promise<RandomBuyResponse> {
    const marketplaceImplementation: CarbonMarketplaceAbstract =
      this.getMarketplaceImplementation(request.marketplace, request.network);

    const response = await marketplaceImplementation.randomBuy(request);

    return response;
  }

  public async retire(request: RetireRequest): Promise<RetireResponse> {
    const fnTag = `${this.className}#retire()`;
    this.log.info(
      `Received retire request on marketplace ${request.marketplace}`,
    );

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

  public async getAvailableTCO2s(
    request: GetAvailableTCO2sRequest,
  ): Promise<GetAvailableTCO2sResponse> {
    const marketplaceImplementation: CarbonMarketplaceAbstract =
      this.getMarketplaceImplementation(request.marketplace, request.network);

    const response = await marketplaceImplementation.getAvailableTCO2s(request);

    return response;
  }

  public async getVCUMetadata(
    request: GetVCUMetadataRequest,
  ): Promise<VCUMetadata> {
    const marketplaceImplementation: CarbonMarketplaceAbstract =
      this.getMarketplaceImplementation(request.marketplace, request.network);

    const response = await marketplaceImplementation.getVCUMetadata(request);

    if (!response) {
      throw new Error(`VCU with ID ${request.vcuIdentifier} not found.`);
    }
    return response;
  }

  public async getPurchasePrice(
    request: GetPurchasePriceRequest,
  ): Promise<GetPurchasePriceResponse> {
    const defaultDex = getDefaultDex(request.network);

    const factory = new ethers.Contract(
      defaultDex.factory,
      [
        "function getPair(address tokenA, address tokenB) external view returns (address pair)",
      ],
      this.getRPCProvider(request.network),
    );
    const pairAddress = await factory.getPair(
      request.unit,
      getTokenAddress(request.network, "USDC"),
    );

    if (pairAddress === ethers.constants.AddressZero) {
      throw new Error("No pool found for this pair");
    }

    const pair = new ethers.Contract(
      pairAddress,
      [
        "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
        "function token0() external view returns (address)",
        "function token1() external view returns (address)",
      ],
      this.getRPCProvider(request.network),
    );

    const [reserve0, reserve1] = await pair.getReserves();
    const token0 = await pair.token0();

    // Convert to BigInt explicitly
    const r0 = BigInt(reserve0);
    const r1 = BigInt(reserve1);
    const [reserveIn, reserveOut] =
      request.unit.toLowerCase() === token0.toLowerCase() ? [r0, r1] : [r1, r0];

    // Apply fee and constant-product formula
    const amountInWithFee = BigInt(request.amount) * 997n;
    const numerator = amountInWithFee * reserveOut;
    const denominator = reserveIn * 1000n + amountInWithFee;
    const amountOut = numerator / denominator;

    return {
      price: Number(amountOut),
    };
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
