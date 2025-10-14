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
import { ethers } from "ethers";

import { UniswapImpl } from "./dexes/uniswap";
import { DexAbstract } from "./dex-abstract";

export interface IPluginCarbonCreditOptions extends ICactusPluginOptions {
  instanceId: string;
  signingCredential?: Web3SigningCredentialPrivateKeyHex;
  networkConfig?: NetworkConfig[];
  logLevel?: LogLevelDesc;
}

export class PluginCarbonCredit implements ICactusPlugin, IPluginWebService {
  public static readonly CLASS_NAME = "PluginCarbonCredit";

  private readonly instanceId: string;
  private readonly log: Logger;
  private endpoints: IWebServiceEndpoint[] | undefined;

  private readonly signingCredential?: Web3SigningCredentialPrivateKeyHex;

  private providers: Map<string, ethers.providers.Provider> = new Map();

  constructor(public readonly options: IPluginCarbonCreditOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.instanceId, `${fnTag} options.instanceId`);

    this.instanceId = options.instanceId;

    this.signingCredential = options.signingCredential;

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
    }
  }

  public get className(): string {
    return PluginCarbonCredit.CLASS_NAME;
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

  public createSigner(network: string, privateKey: string): ethers.Signer {
    const provider = this.getRPCProvider(network);

    if (!privateKey || privateKey === "") {
      throw new Error(
        `No private key provided for network ${network}. Please check the plugin options and ensure the signingCredential is correctly set.`,
      );
    }

    return new ethers.Wallet(privateKey, provider);
  }

  public getRPCProvider(network: string): ethers.providers.Provider {
    const provider = this.providers.get(network);

    if (!provider) {
      throw new Error(
        `No provider found for network ${network}. Please check the plugin options and ensure the network configuration is correct.`,
      );
    }

    return provider;
  }

  public getDexImplementation(
    network: Network,
    signer?: ethers.Signer,
  ): DexAbstract {
    const fnTag = `${this.className}#getDexImplementation()`;

    let provider = null;
    if (signer) {
      provider = signer.provider;
    } else {
      provider = this.getRPCProvider(network);
    }

    if (!provider) {
      throw new Error(`${fnTag} No provider available for network ${network}.`);
    }

    return new UniswapImpl({
      logLevel: this.options.logLevel,
      provider,
    });
  }

  public getMarketplaceImplementation(
    marketplace: string,
    network: Network,
    signer?: ethers.Signer,
  ): CarbonMarketplaceAbstract {
    const fnTag = `${this.className}#getMarketplaceImplementation()`;
    this.log.debug(
      `${fnTag} Getting marketplace implementation for ${marketplace} on network ${network}`,
    );

    switch (marketplace) {
      case Marketplace.Toucan:
        return new ToucanLeaf({
          network,
          signer: signer
            ? signer
            : this.createSigner(network, this.signingCredential?.secret ?? ""),
          logLevel: this.options.logLevel,
          dexImpl: this.getDexImplementation(network, signer),
        });
      default:
        throw new Error(`Unsupported marketplace: ${marketplace}`);
    }
  }

  private checkSignerOrProvider(signer?: ethers.Signer) {
    if (signer && !signer.provider) {
      throw new Error(
        `The provided signer does not have a provider. Please ensure the signer is connected to a provider.`,
      );
    }
    if (!signer && !this.signingCredential) {
      throw new Error(
        `No signer provided and no signingCredential available in plugin options. Cannot proceed without a signer.`,
      );
    }
  }

  public async specificBuy(
    request: SpecificBuyRequest,
    signer?: ethers.Signer,
  ): Promise<SpecificBuyResponse> {
    this.checkSignerOrProvider(signer);

    const marketplaceImplementation: CarbonMarketplaceAbstract =
      this.getMarketplaceImplementation(
        request.marketplace,
        request.network,
        signer,
      );

    return await marketplaceImplementation.specificBuy(request);
  }

  public async randomBuy(
    request: RandomBuyRequest,
    signer?: ethers.Signer,
  ): Promise<RandomBuyResponse> {
    this.checkSignerOrProvider(signer);

    const marketplaceImplementation: CarbonMarketplaceAbstract =
      this.getMarketplaceImplementation(
        request.marketplace,
        request.network,
        signer,
      );

    return await marketplaceImplementation.randomBuy(request);
  }

  public async retire(
    request: RetireRequest,
    signer?: ethers.Signer,
  ): Promise<RetireResponse> {
    this.checkSignerOrProvider(signer);

    const marketplaceImplementation: CarbonMarketplaceAbstract =
      this.getMarketplaceImplementation(
        request.marketplace,
        request.network,
        signer,
      );

    return await marketplaceImplementation.retire(request);
  }

  public async getAvailableTCO2s(
    request: GetAvailableTCO2sRequest,
    signer?: ethers.Signer,
  ): Promise<GetAvailableTCO2sResponse> {
    this.checkSignerOrProvider(signer);

    const marketplaceImplementation: CarbonMarketplaceAbstract =
      this.getMarketplaceImplementation(
        request.marketplace,
        request.network,
        signer,
      );

    return await marketplaceImplementation.getAvailableTCO2s(request);
  }

  public async getVCUMetadata(
    request: GetVCUMetadataRequest,
    signer?: ethers.Signer,
  ): Promise<VCUMetadata> {
    this.checkSignerOrProvider(signer);

    const marketplaceImplementation: CarbonMarketplaceAbstract =
      this.getMarketplaceImplementation(
        request.marketplace,
        request.network,
        signer,
      );

    return await marketplaceImplementation.getVCUMetadata(request);
  }

  public async getPurchasePrice(
    request: GetPurchasePriceRequest,
    signer?: ethers.Signer,
  ): Promise<GetPurchasePriceResponse> {
    this.checkSignerOrProvider(signer);

    const quote = await this.getDexImplementation(
      request.network,
      signer,
    ).getUSDCQuote(request.unit, request.amount, request.network);

    return {
      price: Number(quote.amountOut),
    };
  }
}
