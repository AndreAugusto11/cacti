import "jest-extended";

import { PluginCarbonCredit } from "../../../main/typescript/plugin-carbon-credit";
import { IPluginCarbonCreditOptions } from "../../../main/typescript/plugin-carbon-credit";
import { PluginRegistry } from "@hyperledger/cactus-core";

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
      const response = await plugin.getAvailableVCUs();

      expect(response).toBeDefined();
      expect(response.vcus).toBeInstanceOf(Array);
      expect(response.vcus.length).toBeGreaterThan(0);

      const vcu1 = response.vcus[0];
      expect(vcu1.id).toBe("VCU-1234");
      expect(vcu1.name).toBe("Carbon Project Alpha");
    });
  });

  describe("VCU Metadata Functionality", () => {
    test("getVCUMetadata returns the correct data for a valid VCU ID", async () => {
      const request = { vcuId: "VCU-1234" };
      const response = await plugin.getVCUMetadata(request);

      expect(response).toBeDefined();
      expect(response.vcu.id).toBe("VCU-1234");
      expect(response.vcu.name).toBe("Carbon Project Alpha");
      expect(response.metadata.registry).toBe("Verra");
    });

    test("getVCUMetadata throws an error for an invalid VCU ID", async () => {
      const invalidRequest = { vcuId: "VCU-9999" };

      await expect(plugin.getVCUMetadata(invalidRequest)).rejects.toThrow(
        "VCU with ID VCU-9999 not found.",
      );
    });
  });
});
