import { Express, Request, Response } from "express";

import {
  Logger,
  Checks,
  LogLevelDesc,
  LoggerProvider,
  IAsyncProvider,
  safeStringifyException,
} from "@hyperledger/cactus-common";
import {
  IEndpointAuthzOptions,
  IExpressRequestHandler,
  IWebServiceEndpoint,
} from "@hyperledger/cactus-core-api";
import { registerWebServiceEndpoint } from "@hyperledger/cactus-core";

import { PluginCarbonCredit } from "../plugin-carbon-credit";

import {
  GetPurchasePriceRequest,
  GetPurchasePriceResponse,
} from "../generated/openapi/typescript-axios";

import OAS from "../../json/openapi.json";

export interface IGetAvailableVCUsEndpointOptions {
  logLevel?: LogLevelDesc;
  connector: PluginCarbonCredit;
}

export class GetPurchasePriceEndpoint implements IWebServiceEndpoint {
  public static readonly CLASS_NAME = "GetPurchasePriceEndpoint";
  private readonly log: Logger;

  public get className(): string {
    return GetPurchasePriceEndpoint.CLASS_NAME;
  }

  constructor(public readonly options: IGetAvailableVCUsEndpointOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.connector, `${fnTag} arg options.connector`);

    const level = options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  public get oasPath(): (typeof OAS.paths)["/api/v1/@hyperledger/cactus-plugin-carbon-credit/get-available-vcus"] {
    return OAS.paths[
      "/api/v1/@hyperledger/cactus-plugin-carbon-credit/get-available-vcus"
    ];
  }

  public getPath(): string {
    return this.oasPath.get["x-hyperledger-cacti"].http.path;
  }

  public getVerbLowerCase(): string {
    return this.oasPath.get["x-hyperledger-cacti"].http.verbLowerCase;
  }

  public getOperationId(): string {
    return this.oasPath.get.operationId;
  }

  getAuthorizationOptionsProvider(): IAsyncProvider<IEndpointAuthzOptions> {
    // TODO: make this an injectable dependency in the constructor
    return {
      get: async () => ({
        isProtected: true,
        requiredRoles: [],
      }),
    };
  }

  public async registerExpress(
    expressApp: Express,
  ): Promise<IWebServiceEndpoint> {
    await registerWebServiceEndpoint(expressApp, this);
    return this;
  }

  public getExpressRequestHandler(): IExpressRequestHandler {
    return this.handleRequest.bind(this);
  }

  private async handleRequest(req: Request, res: Response): Promise<void> {
    const reqTag = `${this.getVerbLowerCase()} - ${this.getPath()}`;
    this.log.debug(reqTag);

    const reqBody = req.body as GetPurchasePriceRequest;

    try {
      this.log.info(`Received a request to get purchase price.`);
      const priceResponse: GetPurchasePriceResponse =
        await this.options.connector.getPurchasePrice(reqBody);
      res.status(200).json(priceResponse);
    } catch (ex) {
      this.log.error(`Crash while serving ${reqTag}`, ex);
      res.status(500).json({
        message: "Internal Server Error",
        error: safeStringifyException(ex),
      });
    }
  }
}
