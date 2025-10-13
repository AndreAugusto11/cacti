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
import { computePoolAddress, FeeAmount } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json";
// import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'

import { getDefaultDex, getTokenByAddress, getTokenBySymbol } from "./utils";

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
    const usdcInfo = getTokenBySymbol(request.network, "USDC");
    const USDC_TOKEN = new Token(
      usdcInfo.chainId,
      usdcInfo.address,
      usdcInfo.decimals,
      usdcInfo.symbol,
      usdcInfo.name,
    );

    const swapToken = getTokenByAddress(request.network, request.unit);
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
        factoryAddress: getDefaultDex(request.network).factory,
        tokenA: USDC_TOKEN,
        tokenB: SWAP_TOKEN,
        fee: fee,
        chainId: USDC_TOKEN.chainId,
      });

      const poolContract = new ethers.Contract(
        currentPoolAddress,
        IUniswapV3PoolABI.abi,
        this.getRPCProvider(request.network),
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
          getDefaultDex(request.network).quoter,
          Quoter.abi,
          this.getRPCProvider(request.network),
        );

        try {
          const result = await quoterContract.callStatic.quoteExactInputSingle({
            tokenIn: token1,
            tokenOut: token0,
            amountIn: request.amount,
            fee: fee,
            sqrtPriceLimitX96: 0,
          });

          return {
            price: Number(result.amountOut),
          };
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

  public async sell(): Promise<void> {
    // Placeholder for sell functionality
    this.log.info("Sell functionality not implemented yet.");
  }

  public async listVCUs(): Promise<void> {
    // Placeholder for listing VCUs functionality
    this.log.info("List VCUs functionality not implemented yet.");
  }
}
