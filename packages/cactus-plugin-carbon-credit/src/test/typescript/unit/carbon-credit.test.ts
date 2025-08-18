import "jest-extended";

import { PluginCarbonCredit } from "../../../main/typescript/plugin-carbon-credit";
import { IPluginCarbonCreditOptions } from "../../../main/typescript/plugin-carbon-credit";
import { PluginRegistry } from "@hyperledger/cactus-core";
import {
  GetAvailableVCUsRequest,
  GetVCUMetadataRequest,
} from "../../../main/typescript/public-api";

const pluginOptions: IPluginCarbonCreditOptions = {
  instanceId: "test-instance-id",
  pluginRegistry: new PluginRegistry(),
  logLevel: "DEBUG",
};

const plugin = new PluginCarbonCredit(pluginOptions);

describe("PluginCarbonCredit Functionality", () => {
  describe("Buy Functionality", () => {
    test("Buy function returns the correct placeholder data", async () => {
      const request = {
        platform: "Toucan",
        paymentToken: "USDC",
        amount: 100,
        walletObject: "wallet-address-placeholder",
      };

      const response = await plugin.buy(request);

      expect(response).toBeDefined();
      expect(response.txHashSwap).toBe("txHashSwap_placeholder");
      expect(response.poolTokenAmount).toBe("100");
      expect(response.tco2List).toEqual(["0xABCD", "0x1234"]);
    });
  });

  describe("Retire Functionality", () => {
    test("Retire function returns the correct placeholder data", async () => {
      const request = {
        platform: "Toucan",
        walletObject: "wallet-address-placeholder",
        objectsList: ["0xABCD", "0x1234"],
        amounts: [100, 200],
        beneficiary: "beneficiary-address-placeholder",
        message: "Offset for my project",
        retirementReason: "Offset for my footprint",
      };

      const response = await plugin.retire(request);

      expect(response).toBeDefined();
      expect(response.txHashRetire).toBe("txHashRetire_placeholder");
      expect(response.retirementCertificate).toBe(
        "retirementCertificate_placeholder",
      );
    });
  });

  describe("GetAvailableVCUs Functionality", () => {
    test("getAvailableVCUs returns a list of VCUs", async () => {
      const request: GetAvailableVCUsRequest = {
        platform: "Toucan",
      };

      const response = await plugin.getAvailableVCUs(request);

      expect(response).toBeDefined();
      expect(response.objectsList).toBeInstanceOf(Array);
      expect(response.totalCount).toBe(2); // Placeholder, adjust as needed
    });
  });

  describe("VCU Metadata Functionality", () => {
    test("getVCUMetadata returns the correct data for a valid VCU ID", async () => {
      const request: GetVCUMetadataRequest = {
        platform: "Toucan",
        projectIdentifier: "project-1234",
        vcuIdentifier: "VCU-1234",
      };
      const response = await plugin.getVCUMetadata(request);

      expect(response).toBeDefined();
      expect(response.name).toEqual("Carbon Project Alpha");
      expect(response.symbol).toEqual("CPA");
      expect(response.totalSupply).toEqual(500);
    });

    test("getVCUMetadata throws an error for an invalid VCU ID", async () => {
      const invalidRequest: GetVCUMetadataRequest = {
        platform: "Toucan",
        projectIdentifier: "project-1234",
        vcuIdentifier: "VCU-9999",
      };

      await expect(plugin.getVCUMetadata(invalidRequest)).rejects.toThrow(
        "VCU with ID VCU-9999 not found.",
      );
    });
  });
});
