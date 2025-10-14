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

import { GetAvailableTCO2sRequest } from "./../generated/openapi/typescript-axios";

import OAS from "../../json/openapi.json";

export interface IGetAvailableTCO2sEndpointOptions {
  logLevel?: LogLevelDesc;
  plugin: PluginCarbonCredit;
}

export class GetAvailableTCO2sEndpoint implements IWebServiceEndpoint {
  public static readonly CLASS_NAME = "GetAvailableTCO2sEndpoint";
  private readonly log: Logger;

  public get className(): string {
    return GetAvailableTCO2sEndpoint.CLASS_NAME;
  }

  constructor(public readonly options: IGetAvailableTCO2sEndpointOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.plugin, `${fnTag} arg options.plugin`);

    const level = options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  public get oasPath(): (typeof OAS.paths)["/api/v1/@hyperledger/cactus-plugin-carbon-credit/get-available-tco2s"] {
    return OAS.paths[
      "/api/v1/@hyperledger/cactus-plugin-carbon-credit/get-available-tco2s"
    ];
  }

  public getPath(): string {
    return this.oasPath.post["x-hyperledger-cacti"].http.path;
  }

  public getVerbLowerCase(): string {
    return this.oasPath.post["x-hyperledger-cacti"].http.verbLowerCase;
  }

  public getOperationId(): string {
    return this.oasPath.post.operationId;
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

    const reqBody = req.body as GetAvailableTCO2sRequest;

    try {
      const vcuResponse = await this.options.plugin.getAvailableTCO2s(reqBody);
      res.status(200).json(vcuResponse);
    } catch (ex) {
      this.log.error(`Crash while serving ${reqTag}`, ex);
      res.status(500).json({
        message: "Internal Server Error",
        error: safeStringifyException(ex),
      });
    }
  }
}
