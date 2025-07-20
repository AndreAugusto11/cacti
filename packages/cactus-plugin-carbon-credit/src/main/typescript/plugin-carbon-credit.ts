import OAS from "../json/openapi.json";

import {
  IWebServiceEndpoint,
  IPluginWebService,
  ICactusPlugin,
  ICactusPluginOptions,
} from "@hyperledger/cactus-core-api";
import type { Express } from "express";

import { PluginRegistry } from "@hyperledger/cactus-core";

import {
  Checks,
  Logger,
  LoggerProvider,
  LogLevelDesc,
} from "@hyperledger/cactus-common";

import { HelloWorldEndpoint } from "./web-services/hello-world-endpoint";
import {
  HelloWorldRequest,
  HelloWorldResponse,
} from "./generated/openapi/typescript-axios";

export interface IPluginCarbonCreditOptions extends ICactusPluginOptions {
  instanceId: string;
  pluginRegistry: PluginRegistry;
  logLevel?: LogLevelDesc;
}

export class PluginCarbonCredit implements ICactusPlugin, IPluginWebService {
  private readonly instanceId: string;
  private readonly log: Logger;
  private endpoints: IWebServiceEndpoint[] | undefined;
  public static readonly CLASS_NAME = "PluginCarbonCredit";

  public get className(): string {
    return PluginCarbonCredit.CLASS_NAME;
  }

  constructor(public readonly options: IPluginCarbonCreditOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.instanceId, `${fnTag} options.instanceId`);
    Checks.truthy(options.pluginRegistry, `${fnTag} options.pluginRegistry`);

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
      const endpoint = new HelloWorldEndpoint({
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

  public async buy(): Promise<void> {
    // Placeholder for buy functionality
    this.log.info("Buy functionality not implemented yet.");
  }

  public async sell(): Promise<void> {
    // Placeholder for sell functionality
    this.log.info("Sell functionality not implemented yet.");
  }

  public async listVCUs(): Promise<void> {
    // Placeholder for listing VCUs functionality
    this.log.info("List VCUs functionality not implemented yet.");
  }

  public async helloWorld(
    request: HelloWorldRequest,
  ): Promise<HelloWorldResponse> {
    const fnTag = `${this.className}#helloWorld()`;
    this.log.debug(`${fnTag} called with body: ${JSON.stringify(request)}`);

    const response: HelloWorldResponse = {
      message: `Hello, ${request.name}!`,
    };

    return response;
  }
}
