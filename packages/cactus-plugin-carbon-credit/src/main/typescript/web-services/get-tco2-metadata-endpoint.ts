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

import { GetTCO2MetadataRequest } from "./../generated/openapi/typescript-axios";

import { PluginCarbonCredit } from "../plugin-carbon-credit";

import OAS from "../../json/openapi.json";

export interface IGetTCO2MetadataEndpointOptions {
  logLevel?: LogLevelDesc;
  plugin: PluginCarbonCredit;
}

export class GetTCO2MetadataEndpoint implements IWebServiceEndpoint {
  public static readonly CLASS_NAME = "GetTCO2MetadataEndpoint";
  private readonly log: Logger;

  public get className(): string {
    return GetTCO2MetadataEndpoint.CLASS_NAME;
  }

  constructor(public readonly options: IGetTCO2MetadataEndpointOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.plugin, `${fnTag} arg options.plugin`);

    const level = options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  public get oasPath(): (typeof OAS.paths)["/api/v1/@hyperledger/cactus-plugin-carbon-credit/get-tco2-metadata"] {
    return OAS.paths[
      "/api/v1/@hyperledger/cactus-plugin-carbon-credit/get-tco2-metadata"
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

  public async registerExpress(app: Express): Promise<IWebServiceEndpoint> {
    await registerWebServiceEndpoint(app, this);
    return this;
  }

  public getExpressRequestHandler(): IExpressRequestHandler {
    return this.handleRequest.bind(this);
  }

  private async handleRequest(req: Request, res: Response): Promise<void> {
    const reqTag = `${this.getVerbLowerCase()} - ${this.getPath()}`;
    this.log.debug(reqTag);

    const reqBody: GetTCO2MetadataRequest = req.body;

    try {
      const tco2MetadataResponse =
        await this.options.plugin.getTCO2Metadata(reqBody);
      res.status(200).json(tco2MetadataResponse);
    } catch (ex) {
      this.log.error(`Crash while serving ${reqTag}`, ex);
      res.status(500).json({
        message: "Internal Server Error",
        error: safeStringifyException(ex),
      });
    }
  }
}
