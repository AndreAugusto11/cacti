// interfaces api1(http) with gateway. calls oracle-get-status

// todo load endpoints in the dispatcher

import type { Express, Request, Response } from "express";

import type {
  IWebServiceEndpoint,
  IExpressRequestHandler,
  IEndpointAuthzOptions,
} from "@hyperledger/cactus-core-api";
import {
  type Logger,
  Checks,
  LoggerProvider,
  type IAsyncProvider,
} from "@hyperledger/cactus-common";

import {
  handleRestEndpointException,
  registerWebServiceEndpoint,
} from "@hyperledger/cactus-core";

import OAS from "../../../json/openapi-blo-bundled.json";
import type { IRequestOptions } from "../../core/types";
import { OracleStatusRequest } from "../../public-api";
import { getEnumKeyByValue } from "../../services/utils";
import { SATPInternalError } from "../../core/errors/satp-errors";
import { Error as SATPErrorType } from "../../generated/proto/cacti/satp/v02/common/message_pb";

export class GetOracleStatusEndpointV1 implements IWebServiceEndpoint {
  public static readonly CLASS_NAME = "GetOracleStatusEndpointV1";

  private readonly log: Logger;

  public get className(): string {
    return GetOracleStatusEndpointV1.CLASS_NAME;
  }

  constructor(public readonly options: IRequestOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.dispatcher, `${fnTag} arg options.connector`);

    const level = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  public getPath(): string {
    const apiPath =
      OAS.paths["/api/v1/@hyperledger/cactus-plugin-satp-hermes/oracle/status"];
    return apiPath.get["x-hyperledger-cacti"].http.path;
  }

  public getVerbLowerCase(): string {
    const apiPath =
      OAS.paths["/api/v1/@hyperledger/cactus-plugin-satp-hermes/oracle/status"];
    return apiPath.get["x-hyperledger-cacti"].http.verbLowerCase;
  }

  public getOperationId(): string {
    return OAS.paths[
      "/api/v1/@hyperledger/cactus-plugin-satp-hermes/oracle/status"
    ].get.operationId;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async handleRequest(req: Request, res: Response): Promise<void> {
    const fnTag = `${this.className}#handleRequest()`;
    const reqTag = `${this.getVerbLowerCase()} - ${this.getPath()}`;
    this.log.debug(reqTag);

    const reqBody: OracleStatusRequest = req.body;
    this.log.debug("reqBody: ", reqBody);

    try {
      const result = await this.options.dispatcher.OracleGetTaskStatus(reqBody);
      res.status(200).json(result);
    } catch (ex) {
      const errorMsg = `${reqTag} ${fnTag} Failed to execute task: ${getEnumKeyByValue(SATPErrorType, (ex as SATPInternalError).getSATPErrorType())}`;
      handleRestEndpointException({ errorMsg, log: this.log, error: ex, res });
    }
  }
}
