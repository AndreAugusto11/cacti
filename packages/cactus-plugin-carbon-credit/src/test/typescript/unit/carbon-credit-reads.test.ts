import "jest-extended";

import { PluginCarbonCredit } from "../../../main/typescript/plugin-carbon-credit";
import { IPluginCarbonCreditOptions } from "../../../main/typescript/plugin-carbon-credit";
import {
  GetAvailableTCO2sRequest,
  GetVCUMetadataRequest,
  Network,
  Marketplace,
} from "../../../main/typescript/public-api";
import { Web3SigningCredentialPrivateKeyHex } from "@hyperledger/cactus-plugin-ledger-connector-ethereum";
import dotenv from "dotenv";
import { getTokenAddressBySymbol } from "../../../main/typescript/utils";
import { parseUnits } from "ethers/lib/utils";
dotenv.config({ path: "packages/cactus-plugin-carbon-credit/.env" });

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

if (!ALCHEMY_API_KEY) {
  throw new Error("ALCHEMY_API_KEY not set in environment");
}

const pluginOptions: IPluginCarbonCreditOptions = {
  instanceId: "test-instance-id",
  signingCredential: {
    ethAccount: "0xb5271339c211cC1EEeD30a2f9f447063a5faD1F0",
    secret: "739ed7c97109f28bc8f13b354b30bbd01a47061be7676c3c3934aa4a56540de4",
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
  logLevel: "DEBUG",
};

const plugin = new PluginCarbonCredit(pluginOptions);

describe("PluginCarbonCredit Functionality", () => {
  test("getAvailableTCO2s returns a list of TCO2s (Polygon)", async () => {
    const request: GetAvailableTCO2sRequest = {
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
    };

    const response = await plugin.getAvailableTCO2s(request);

    expect(response).toBeDefined();
    expect(response.tco2List).toBeInstanceOf(Array);
    expect(response.totalCount).toBeGreaterThan(0);
  });

  test("getAvailableTCO2s returns a list of TCO2s (Celo)", async () => {
    const request: GetAvailableTCO2sRequest = {
      marketplace: Marketplace.Toucan,
      network: Network.Celo,
    };

    const response = await plugin.getAvailableTCO2s(request);

    expect(response).toBeDefined();
    expect(response.tco2List).toBeInstanceOf(Array);
    expect(response.totalCount).toBeGreaterThan(0);
  });

  test("getVCUMetadata returns the correct data for a valid VCU ID (Polygon)", async () => {
    const request: GetVCUMetadataRequest = {
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      projectIdentifier: "VCS-1529",
      vcuIdentifier: "0x6362364A37F34d39a1f4993fb595dAB4116dAf0d",
    };
    const response = await plugin.getVCUMetadata(request);

    console.log("getVCUMetadata Response:", response);

    expect(response).toBeDefined();
    expect(response.name).toEqual("Toucan Protocol: TCO2-VCS-1529-2012");
    expect(response.totalSupply).toBeGreaterThan(0);
  });

  test("getVCUMetadata returns the correct data for a valid VCU ID (Celo)", async () => {
    const request: GetVCUMetadataRequest = {
      marketplace: Marketplace.Toucan,
      network: Network.Celo,
      projectIdentifier: "VCS-1529",
      vcuIdentifier: "0x96E58418524c01edc7c72dAdDe5FD5C1c82ea89F",
    };
    const response = await plugin.getVCUMetadata(request);

    console.log("getVCUMetadata Response:", response);

    expect(response).toBeDefined();
    expect(response.name).toEqual("Toucan Protocol: TCO2-VCS-1529-2012");
    expect(response.totalSupply).toBeGreaterThan(0);
  });

  test("getPurchasePrice returns the correct price for a valid request", async () => {
    const request = {
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      unit: getTokenAddressBySymbol(Network.Polygon, "NCT"),
      amount: parseUnits("1", 18).toString(), // 1 NCT
    };

    const response = await plugin.getPurchasePrice(request);

    const USDC_balance = response.price / 10 ** 6;

    console.log("getPurchasePrice Response (Polygon):", USDC_balance + " USDC");

    expect(response).toBeDefined();
    expect(response.price).toBeGreaterThan(parseUnits("0.3", 6).toBigInt()); // Flaky test. Currently 1 NCT = 0.48 USDC
    expect(response.price).toBeLessThan(parseUnits("1", 6).toBigInt());
  });

  test("getPurchasePrice returns the correct price for a valid request", async () => {
    const request = {
      marketplace: Marketplace.Toucan,
      network: Network.Celo,
      unit: getTokenAddressBySymbol(Network.Celo, "NCT"),
      amount: parseUnits("1", 18).toString(), // 1 NCT
    };

    const response = await plugin.getPurchasePrice(request);

    const cUSD_balance = response.price / 10 ** 18;

    console.log("getPurchasePrice Response (Celo):", cUSD_balance + " cUSD");

    expect(response).toBeDefined();
    expect(response.price).toBeGreaterThan(parseUnits("1.6", 18).toBigInt()); // Flaky test. Currently 1 NCT = 1.66 cUSD
  });

  // test("getVCUMetadata throws an error for an invalid VCU ID (Polygon)", async () => {
  //   const invalidRequest: GetVCUMetadataRequest = {
  //     marketplace: Marketplace.Toucan,
  //     network: Network.Polygon,
  //     projectIdentifier: "project-XXXX",
  //     vcuIdentifier: "VCU-XXXX",
  //   };

  //   await expect(plugin.getVCUMetadata(invalidRequest)).rejects.toThrow(
  //     "VCU with ID VCU-XXXX not found.",
  //   );
  // });

  // test("getVCUMetadata throws an error for an invalid VCU ID (Celo)", async () => {
  //   const invalidRequest: GetVCUMetadataRequest = {
  //     marketplace: Marketplace.Toucan,
  //     network: Network.Celo,
  //     projectIdentifier: "project-XXXX",
  //     vcuIdentifier: "VCU-XXXX",
  //   };

  //   await expect(plugin.getVCUMetadata(invalidRequest)).rejects.toThrow(
  //     "VCU with ID VCU-XXXX not found.",
  //   );
  // });
});
