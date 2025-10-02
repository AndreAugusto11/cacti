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

import {
  SpecificBuyRequest,
  SpecificBuyResponse,
} from "../generated/openapi/typescript-axios"; // confirmar depois se é necessário esse import
import { registerWebServiceEndpoint } from "@hyperledger/cactus-core";

import { PluginCarbonCredit } from "../plugin-carbon-credit";

import OAS from "../../json/openapi.json";

export interface IBuyEndpointOptions {
  logLevel?: LogLevelDesc;
  connector: PluginCarbonCredit;
}

export class SpecificBuyEndpoint implements IWebServiceEndpoint {
  public static readonly CLASS_NAME = "SpecificBuyEndpoint";
  private readonly log: Logger;
  // private readonly connector: PluginCarbonCredit;

  public get className(): string {
    return SpecificBuyEndpoint.CLASS_NAME;
  }

  constructor(public readonly options: IBuyEndpointOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.connector, `${fnTag} arg options.connector`);

    // this.connector = options.connector;
    const level = options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  public get oasPath(): (typeof OAS.paths)["/api/v1/@hyperledger/cactus-plugin-carbon-credit/specific-buy"] & {
    post: {
      "x-hyperledger-cacti": {
        http: {
          path: string;
          verbLowerCase: string;
        };
      };
      operationId: string;
      description: string;
      requestBody: any;
      responses: any;
    };
  } {
    return OAS.paths[
      "/api/v1/@hyperledger/cactus-plugin-carbon-credit/specific-buy"
    ] as (typeof OAS.paths)["/api/v1/@hyperledger/cactus-plugin-carbon-credit/specific-buy"] & {
      post: {
        "x-hyperledger-cacti": {
          http: {
            path: string;
            verbLowerCase: string;
          };
        };
        operationId: string;
        description: string;
        requestBody: any;
        responses: any;
      };
    };
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

    const reqBody: SpecificBuyRequest = req.body;
    const { marketplace, paymentToken, items, walletObject } = reqBody;

    if (!marketplace || !paymentToken || !items || !walletObject) {
      const errorMessage =
        "Missing required parameters: marketplace, paymentToken, items, or walletObject.";
      this.log.error(errorMessage);
      res.status(400).json({ error: errorMessage });
      return;
    }

    try {
      this.log.info(
        `Received specific buy request for ${items} units. on marketplace ${marketplace}`,
      );
      const specificBuyResponse: SpecificBuyResponse =
        await this.options.connector.specificBuy(reqBody);
      res.status(200).json(specificBuyResponse);
    } catch (ex) {
      this.log.error(`Crash while serving ${reqTag}`, ex);
      res.status(500).json({
        message: "Internal Server Error",
        error: safeStringifyException(ex),
      });
    }
  }
}
