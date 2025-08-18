import "jest-extended";
import express from "express";
import bodyParser from "body-parser";
import http from "http";
import { v4 as uuidV4 } from "uuid";
import { AddressInfo } from "net";

import {
  LogLevelDesc,
  IListenOptions,
  Servers,
} from "@hyperledger/cactus-common";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { Configuration } from "@hyperledger/cactus-core-api";

import {
  DefaultApi as CarbonCreditApi,
  PluginCarbonCredit,
  BuyRequest,
  RetireRequest,
  GetVCUMetadataRequest,
  GetAvailableVCUsRequest,
} from "../../../main/typescript/public-api";

const testLogLevel: LogLevelDesc = "info";

describe("Carbon Credit API Integration Tests", () => {
  let apiClient: CarbonCreditApi, connector: PluginCarbonCredit;
  const expressApp = express();
  expressApp.use(bodyParser.json({ limit: "250mb" }));
  const server = http.createServer(expressApp);

  //////////////////////////////////
  // Configuração
  //////////////////////////////////

  beforeAll(async () => {
    const listenOptions: IListenOptions = {
      hostname: "127.0.0.1",
      port: 0,
      server,
    };

    const addressInfo = (await Servers.listen(listenOptions)) as AddressInfo;
    const { address, port } = addressInfo;
    const apiHost = `http://${address}:${port}`;

    apiClient = new CarbonCreditApi(new Configuration({ basePath: apiHost }));

    connector = new PluginCarbonCredit({
      instanceId: uuidV4(),
      logLevel: testLogLevel,
      pluginRegistry: new PluginRegistry(),
    });

    // Registar todos os endpoints do plugin, incluindo os novos
    await connector.getOrCreateWebServices();
    await connector.registerWebServices(expressApp);
  });

  afterAll(async () => {
    await Servers.shutdown(server);
  });

  test("buy endpoint returns placeholder data", async () => {
    const request: BuyRequest = {
      platform: "Toucan",
      paymentToken: "USDC",
      amount: 100,
      walletObject: "test-wallet",
    };

    const response = await apiClient.buyRequest(request);

    expect(response).toBeDefined();
    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
  });

  test("retire endpoint returns placeholder data", async () => {
    const request: RetireRequest = {
      platform: "Toucan",
      walletObject: "test-wallet",
      objectsList: ["0xABCD"],
      amounts: [100],
      beneficiary: "test-beneficiary",
      message: "Test retirement",
      retirementReason: "Testing",
    };

    const response = await apiClient.retireRequest(request);

    expect(response).toBeDefined();
    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
  });

  test("getAvailableVCUs endpoint returns a list of VCUs", async () => {
    const request: GetAvailableVCUsRequest = {
      platform: "Toucan",
    };

    const response = await apiClient.getAvailableVCUsRequest(request);

    expect(response).toBeDefined();
    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
  });

  test("getVCUMetadata endpoint returns metadata for a valid VCU ID", async () => {
    const request: GetVCUMetadataRequest = {
      platform: "Toucan",
      projectIdentifier: "project-1234",
      vcuIdentifier: "VCU-1234",
    };

    const response = await apiClient.getVCUMetadataRequest(request);

    expect(response).toBeDefined();
    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
  });
});
