/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Configuration } from "@hyperledger/cactus-core-api";

import {
  DefaultApi as CarbonCreditApi,
  PluginCarbonCredit,
  GetVCUMetadataRequest,
  GetAvailableTCO2sRequest,
  Network,
} from "../../../main/typescript/public-api";
import { Web3SigningCredentialPrivateKeyHex } from "@hyperledger/cactus-plugin-ledger-connector-ethereum";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

if (!ALCHEMY_API_KEY) {
  throw new Error("ALCHEMY_API_KEY not set in environment");
}

let polygon_tco2s = [];
let celo_tco2s = [];

const testLogLevel: LogLevelDesc = "info";

describe("Carbon Credit API Integration Tests", () => {
  let apiClient: CarbonCreditApi, connector: PluginCarbonCredit;
  const expressApp = express();
  expressApp.use(bodyParser.json({ limit: "250mb" }));
  const server = http.createServer(expressApp);

  //////////////////////////////////
  // configuration
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
      signingCredential: {
        ethAccount: "0xb5271339c211cC1EEeD30a2f9f447063a5faD1F0",
        secret:
          "739ed7c97109f28bc8f13b354b30bbd01a47061be7676c3c3934aa4a56540de4",
      } as Web3SigningCredentialPrivateKeyHex,
      networkConfig: [
        {
          rpcUrl: "https://polygon-mainnet.g.alchemy.com/v2/" + ALCHEMY_API_KEY,
          network: Network.Polygon,
        },
        {
          rpcUrl: "https://celo-mainnet.g.alchemy.com/v2/" + ALCHEMY_API_KEY,
          network: Network.Celo,
        },
      ],
      logLevel: testLogLevel,
    });

    // Registar todos os endpoints do plugin, incluindo os novos
    await connector.getOrCreateWebServices();
    await connector.registerWebServices(expressApp);
  });

  afterAll(async () => {
    await Servers.shutdown(server);
  });

  test("getAvailableTCO2s endpoint returns a list of TCO2s (Polygon)", async () => {
    const request: GetAvailableTCO2sRequest = {
      marketplace: "Toucan",
      network: Network.Polygon,
    };

    const response = await apiClient.getAvailableTCO2sRequest(request);

    expect(response).toBeDefined();
    expect(response.status).toEqual(200);
    expect(response.data.tco2List).toBeInstanceOf(Array);
    expect(response.data.totalCount).toBeGreaterThan(0);

    polygon_tco2s = response.data.tco2List;
  });

  test("getAvailableTCO2s endpoint returns a list of TCO2s (Celo)", async () => {
    const request: GetAvailableTCO2sRequest = {
      marketplace: "Toucan",
      network: Network.Celo,
    };

    const response = await apiClient.getAvailableTCO2sRequest(request);

    expect(response).toBeDefined();
    expect(response.status).toEqual(200);
    expect(response.data.tco2List).toBeInstanceOf(Array);
    expect(response.data.totalCount).toBeGreaterThan(0);

    celo_tco2s = response.data.tco2List;
  });

  test("getVCUMetadata endpoint returns metadata for a valid VCU ID (Polygon)", async () => {
    const request: GetVCUMetadataRequest = {
      marketplace: "Toucan",
      network: Network.Polygon,
      projectIdentifier: "VCS-1529",
      vcuIdentifier: "0x6362364A37F34d39a1f4993fb595dAB4116dAf0d",
    };

    const response = await apiClient.getVCUMetadataRequest(request);

    expect(response).toBeDefined();
    expect(response.status).toEqual(200);
    expect(response.data.name).toEqual("Toucan Protocol: TCO2-VCS-1529-2012");
    expect(response.data.totalSupply).toBeGreaterThan(0);
  });

  test("getVCUMetadata endpoint returns metadata for a valid VCU ID (Celo)", async () => {
    const request: GetVCUMetadataRequest = {
      marketplace: "Toucan",
      network: Network.Celo,
      projectIdentifier: "VCS-1529",
      vcuIdentifier: "0x96E58418524c01edc7c72dAdDe5FD5C1c82ea89F",
    };

    const response = await apiClient.getVCUMetadataRequest(request);

    expect(response).toBeDefined();
    expect(response.status).toEqual(200);
    expect(response.data.name).toEqual("Toucan Protocol: TCO2-VCS-1529-2012");
    expect(response.data.totalSupply).toBeGreaterThan(0);
  });

  // test("random buy endpoint returns placeholder data", async () => {
  //   const request: RandomBuyRequest = {
  //     marketplace: "Toucan",
  //     network: Network.Polygon,
  //     paymentToken: "USDC",
  //     amount: 100,
  //     walletObject: "test-wallet",
  //   };

  //   const response = await apiClient.randomBuyRequest(request);

  //   expect(response).toBeDefined();
  //   expect(response.status).toEqual(200);
  //   expect(response.data).toBeDefined();
  // });

  // test("retire endpoint returns placeholder data", async () => {
  //   const request: RetireRequest = {
  //     marketplace: "Toucan",
  //     network: Network.Polygon,
  //     walletObject: "test-wallet",
  //     tco2s: ["0xABCD"],
  //     amounts: [100],
  //     beneficiaryAddress: "test-beneficiary",
  //     beneficiaryName: "Test Beneficiary",
  //     message: "Test retirement",
  //     retirementReason: "Testing",
  //   };

  //   const response = await apiClient.retireRequest(request);

  //   expect(response).toBeDefined();
  //   expect(response.status).toEqual(200);
  //   expect(response.data).toBeDefined();
  // });
});
