const testLogLevel: LogLevelDesc = "info";

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
} from "../../../main/typescript/public-api";

describe("Ethereum contract deploy and invoke using keychain tests", () => {
  let apiClient: CarbonCreditApi, connector: PluginCarbonCredit;
  const expressApp = express();
  expressApp.use(bodyParser.json({ limit: "250mb" }));
  const server = http.createServer(expressApp);

  //////////////////////////////////
  // Setup
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
  });

  afterAll(async () => {
    await Servers.shutdown(server);
  });

  test("setup ethereum connector", async () => {
    await connector.getOrCreateWebServices();
    await connector.registerWebServices(expressApp);

    const response = await apiClient.helloWorldRequest({
      name: "Some Name",
    });

    expect(response).toBeDefined();
    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data.message).toEqual("Hello, Some Name!");
  });
});
