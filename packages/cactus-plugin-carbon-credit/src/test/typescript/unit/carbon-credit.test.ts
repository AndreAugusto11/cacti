/* eslint-disable @typescript-eslint/no-unused-vars */
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

let polygon_tco2s = [];
let celo_tco2s = [];

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
  afterEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 10000));
  });

  describe("GetAvailableTCO2s Functionality", () => {
    test("getAvailableTCO2s returns a list of TCO2s (Polygon)", async () => {
      const request: GetAvailableTCO2sRequest = {
        marketplace: Marketplace.Toucan,
        network: Network.Polygon,
      };

      const response = await plugin.getAvailableTCO2s(request);

      expect(response).toBeDefined();
      expect(response.tco2List).toBeInstanceOf(Array);
      expect(response.totalCount).toBeGreaterThan(0);

      polygon_tco2s = response.tco2List;
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

      celo_tco2s = response.tco2List;
    });
  });

  describe("VCU Metadata Functionality", () => {
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

    test("getVCUMetadata throws an error for an invalid VCU ID (Polygon)", async () => {
      const invalidRequest: GetVCUMetadataRequest = {
        marketplace: Marketplace.Toucan,
        network: Network.Polygon,
        projectIdentifier: "project-1234",
        vcuIdentifier: "VCU-9999",
      };

      await expect(plugin.getVCUMetadata(invalidRequest)).rejects.toThrow(
        "VCU with ID VCU-9999 not found.",
      );
    });

    test("getVCUMetadata throws an error for an invalid VCU ID (Celo)", async () => {
      const invalidRequest: GetVCUMetadataRequest = {
        marketplace: Marketplace.Toucan,
        network: Network.Celo,
        projectIdentifier: "project-1234",
        vcuIdentifier: "VCU-9999",
      };

      await expect(plugin.getVCUMetadata(invalidRequest)).rejects.toThrow(
        "VCU with ID VCU-9999 not found.",
      );
    });
  });

  describe("getPurchasePrice Functionality (Polygon)", () => {
    test("getPurchasePrice returns the correct price for a valid request", async () => {
      const request = {
        marketplace: Marketplace.Toucan,
        network: Network.Polygon,
        unit: getTokenAddressBySymbol(Network.Polygon, "NCT"),
        amount: parseUnits("1", 18).toString(), // 1 NCT
      };

      const response = await plugin.getPurchasePrice(request);

      const USDC_balance = response.price / 10 ** 6;

      console.log(
        "getPurchasePrice Response (Polygon):",
        USDC_balance + " USDC",
      );

      expect(response).toBeDefined();
      expect(response.price).toBeGreaterThan(parseUnits("0.3", 6).toBigInt()); // Flaky test. Currently 1 NCT = 0.48 USDC
      expect(response.price).toBeLessThan(parseUnits("1", 6).toBigInt());
    });
  });

  describe("getPurchasePrice Functionality (Celo)", () => {
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
      expect(response.price).toBeGreaterThan(parseUnits("0.3", 18).toBigInt());
    });
  });

  // describe("Buy Functionality", () => {
  //   test("Specific buy function returns the correct placeholder data", async () => {
  //     const request = {
  //       marketplace: Marketplace.Toucan,
  //       network: Network.Polygon,
  //       paymentToken: "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B", // USDC on Polygon
  //       items: { "0xABCD": 10, "0x1234": 199 },
  //       walletObject: "wallet-address-placeholder",
  //     };

  //     const response = await plugin.specificBuy(request);

  //     expect(response).toBeDefined();
  //     expect(response.txHashSwap).toBe("txHashSwap_placeholder");
  //     expect(response.assetAmount).toBe("100");
  //     expect(response.tco2List).toEqual(["0xABCD", "0x1234"]);
  //   });

  //   test("Random buy function returns the correct placeholder data", async () => {
  //     const request = {
  //       marketplace: Marketplace.Toucan,
  //       network: Network.Polygon,
  //       paymentToken: "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B", // USDC on Polygon
  //       amount: 100,
  //       walletObject: "wallet-address-placeholder",
  //     };

  //     const response = await plugin.randomBuy(request);

  //     expect(response).toBeDefined();
  //     expect(response.txHashSwap).toBe("txHashSwap_placeholder");
  //     expect(response.assetAmount).toBe("100");
  //     expect(response.tco2List).toEqual(["0xABCD", "0x1234"]);
  //   });
  // });

  // describe("Retire Functionality", () => {
  //   test("Retire function returns the correct placeholder data", async () => {
  //     const request = {
  //       marketplace: Marketplace.Toucan,
  //       network: Network.Polygon,
  //       walletObject: "wallet-address-placeholder",
  //       objectsList: ["0xABCD", "0x1234"],
  //       amounts: [100, 200],
  //       beneficiary: "beneficiary-address-placeholder",
  //       message: "Offset for my project",
  //       retirementReason: "Offset for my footprint",
  //     };

  //     const response = await plugin.retire(request);

  //     expect(response).toBeDefined();
  //     expect(response.txHashRetire).toBe("txHashRetire_placeholder");
  //     expect(response.retirementCertificate).toBe(
  //       "retirementCertificate_placeholder",
  //     );
  //   });
  // });
});
