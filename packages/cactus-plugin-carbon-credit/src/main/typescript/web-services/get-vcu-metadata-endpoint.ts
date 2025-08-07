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

import {
  GetVCUMetadataRequest,
  GetVCUMetadataResponse,
} from "./../generated/openapi/typescript-axios";

import { PluginCarbonCredit } from "../plugin-carbon-credit";

import OAS from "../../json/openapi.json";

export interface IGetVCUMetadataEndpointOptions {
  logLevel?: LogLevelDesc;
  connector: PluginCarbonCredit;
}

export class GetVCUMetadataEndpoint implements IWebServiceEndpoint {
  public static readonly CLASS_NAME = "GetVCUMetadataEndpoint";
  private readonly log: Logger;

  public get className(): string {
    return GetVCUMetadataEndpoint.CLASS_NAME;
  }

  constructor(public readonly options: IGetVCUMetadataEndpointOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.connector, `${fnTag} arg options.connector`);

    const level = options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  public get oasPath(): (typeof OAS.paths)["/api/v1/@hyperledger/cactus-plugin-carbon-credit/get-vcu-metadata"] {
    return OAS.paths[
      "/api/v1/@hyperledger/cactus-plugin-carbon-credit/get-vcu-metadata"
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

    const reqBody: GetVCUMetadataRequest = req.body;
    const { vcuId } = reqBody;

    if (!vcuId) {
      const errorMessage = "Missing required parameter: vcuId.";
      this.log.error(errorMessage);
      res.status(400).json({ error: errorMessage });
      return;
    }

    try {
      this.log.info(
        `Received a request to get metadata for VCU with ID: ${vcuId}`,
      );
      const vcuMetadataResponse: GetVCUMetadataResponse =
        await this.options.connector.getVCUMetadata(reqBody);
      res.status(200).json(vcuMetadataResponse);
    } catch (ex) {
      this.log.error(`Crash while serving ${reqTag}`, ex);
      res.status(500).json({
        message: "Internal Server Error",
        error: safeStringifyException(ex),
      });
    }
  }
}
