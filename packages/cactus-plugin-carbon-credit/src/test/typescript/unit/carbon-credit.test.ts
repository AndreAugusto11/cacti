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
import { formatUnits } from "ethers/lib/utils";

const pluginOptions: IPluginCarbonCreditOptions = {
  instanceId: "test-instance-id",
  signingCredential: {
    ethAccount: "0xb5271339c211cC1EEeD30a2f9f447063a5faD1F0",
    secret: "739ed7c97109f28bc8f13b354b30bbd01a47061be7676c3c3934aa4a56540de4",
  } as Web3SigningCredentialPrivateKeyHex,
  logLevel: "DEBUG",
};

const plugin = new PluginCarbonCredit(pluginOptions);

describe("PluginCarbonCredit Functionality", () => {
  afterEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 10000));
  });

  // describe("Buy Functionality", () => {
  //   test("Buy function returns the correct placeholder data", async () => {
  //     const request = {
  //       marketplace: Marketplace.Toucan,
  //       network: Network.Alfajores,
  //       paymentToken: "USDC",
  //       amount: 100,
  //       walletObject: "wallet-address-placeholder",
  //     };

  //     const response = await plugin.buy(request);

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

  describe("GetAvailableVCUs Functionality", () => {
    test("getAvailableVCUs returns a list of VCUs", async () => {
      const request: GetAvailableTCO2sRequest = {
        marketplace: Marketplace.Toucan,
        network: Network.Polygon,
      };

      const response = await plugin.getAvailableTCO2s(request);

      expect(response).toBeDefined();
      expect(response.tco2List).toBeInstanceOf(Array);
      expect(response.totalCount).toBe(33); // Placeholder, adjust as needed
    });
  });

  describe("VCU Metadata Functionality", () => {
    test("getVCUMetadata returns the correct data for a valid VCU ID", async () => {
      const request: GetVCUMetadataRequest = {
        marketplace: Marketplace.Toucan,
        network: Network.Polygon,
        projectIdentifier: "VCS-1529",
        vcuIdentifier: "0x6362364A37F34d39a1f4993fb595dAB4116dAf0d",
      };
      const response = await plugin.getVCUMetadata(request);

      expect(response).toBeDefined();
      expect(response.name).toEqual("Toucan Protocol: TCO2-VCS-1529-2012");
      expect(formatUnits(response.totalSupply, 18)).toEqual(
        "44268.372690982378475475",
      );
    });

    test("getVCUMetadata throws an error for an invalid VCU ID", async () => {
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
  });
});
