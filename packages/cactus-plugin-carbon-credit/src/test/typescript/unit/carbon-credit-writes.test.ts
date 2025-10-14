import "jest-extended";

import { Logger } from "@hyperledger/cactus-common";
import { ethers } from "ethers";
import {
  GetAvailableTCO2sRequest,
  IPluginCarbonCreditOptions,
  Marketplace,
  Network,
  PluginCarbonCredit,
} from "../../../main/typescript";
import {
  getERC20Balance,
  getTokenAddressBySymbol,
} from "../../../main/typescript/utils";
import { parseUnits } from "ethers/lib/utils";
import safeStableStringify from "safe-stable-stringify";

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const impersonatedAddress = "0xfa0b641678f5115ad8a8de5752016bd1359681b9";
const signer = provider.getSigner(impersonatedAddress);

const pluginOptions: IPluginCarbonCreditOptions = {
  instanceId: "test-instance-id",
  logLevel: "INFO",
};

const plugin = new PluginCarbonCredit(pluginOptions);

const logger = new Logger({
  label: "carbon-credit-writes.test.ts",
  level: "INFO",
});

// Create a Polygon hardfork on block 77660000, and start the node on port 8545

describe("Uniswap quote and swap functionality", () => {
  beforeAll(async () => {
    await provider.send("hardhat_impersonateAccount", [impersonatedAddress]);
  });

  afterAll(async () => {
    await provider.send("hardhat_stopImpersonatingAccount", [
      impersonatedAddress,
    ]);
  });

  test("Specific buy function runs successfully", async () => {
    const usdcAddress = getTokenAddressBySymbol(Network.Polygon, "USDC");
    const nctAddress = getTokenAddressBySymbol(Network.Polygon, "NCT");

    const initial_usdc_balance = await getERC20Balance(
      usdcAddress,
      impersonatedAddress,
      provider,
    );
    logger.info(`Initial USDC balance: ${initial_usdc_balance}`);
    expect(initial_usdc_balance).toBeGreaterThan(BigInt(0));

    const initial_nct_balance = await getERC20Balance(
      nctAddress,
      impersonatedAddress,
      provider,
    );
    logger.info(`Initial NCT balance: ${initial_nct_balance}`);

    const tco2sRequest: GetAvailableTCO2sRequest = {
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
    };

    const tco2sResponse = await plugin.getAvailableTCO2s(tco2sRequest, signer);

    expect(tco2sResponse).toBeDefined();
    expect(tco2sResponse.tco2List).toBeInstanceOf(Array);
    expect(tco2sResponse.totalCount).toBeGreaterThan(0);

    // Select 3 randomly
    const selectedTCO2s = tco2sResponse.tco2List.slice(0, 3);

    const vcusMetadata = await Promise.all(
      selectedTCO2s.map(async (t) =>
        plugin.getVCUMetadata(
          {
            marketplace: Marketplace.Toucan,
            network: Network.Polygon,
            projectIdentifier: t.projectId,
            vcuIdentifier: t.address,
          },
          signer,
        ),
      ),
    );

    expect(vcusMetadata).toBeDefined();
    expect(vcusMetadata.length).toBe(3);

    const specificBuyRequest = {
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      paymentToken: getTokenAddressBySymbol(Network.Polygon, "USDC"),
      items: {
        [selectedTCO2s[0].address]: parseUnits("100", 18).toString(), // 100 tonnes
        [selectedTCO2s[1].address]: parseUnits("100", 18).toString(), // 100 tonnes
        [selectedTCO2s[2].address]: parseUnits("100", 18).toString(), // 100 tonnes
      },
    };

    const specificBuyResponse = await plugin.specificBuy(
      specificBuyRequest,
      signer,
    );
    expect(specificBuyResponse).toBeDefined();
    expect(specificBuyResponse.txHashSwap).toBeDefined();

    const final_usdc_balance = await getERC20Balance(
      usdcAddress,
      impersonatedAddress,
      provider,
    );
    logger.info(`Final USDC balance: ${final_usdc_balance / 10n ** 6n} USDC`);
    expect(final_usdc_balance).toBeLessThan(initial_usdc_balance);

    const nctBalance = await getERC20Balance(
      nctAddress,
      impersonatedAddress,
      provider,
    );
    logger.info(`Final NCT balance: ${nctBalance / 10n ** 18n} NCT`);
    expect(nctBalance).toBe(0n); // No NCT should remain
  });

  test("Random buy function runs successfully", async () => {
    const usdcAddress = getTokenAddressBySymbol(Network.Polygon, "USDC");
    const nctAddress = getTokenAddressBySymbol(Network.Polygon, "NCT");

    const initial_usdc_balance = await getERC20Balance(
      usdcAddress,
      impersonatedAddress,
      provider,
    );
    logger.info(
      `Initial USDC balance: ${initial_usdc_balance / 10n ** 6n} USDC`,
    );
    expect(initial_usdc_balance).toBeGreaterThan(BigInt(0));

    const initial_nct_balance = await getERC20Balance(
      nctAddress,
      impersonatedAddress,
      provider,
    );
    logger.info(`Initial NCT balance: ${initial_nct_balance / 10n ** 18n} NCT`);

    const request = {
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      paymentToken: "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B", // USDC on Polygon
      amount: parseUnits("100", 18).toString(), // 100 tonnes
    };
    const response = await plugin.randomBuy(request, signer);
    expect(response).toBeDefined();
    expect(response.txHashSwap).toBeDefined();
    expect(response.assetAmount).toBeDefined();
    expect(response.tco2List).toBeDefined();
    expect(response.tco2List!.length).toBeGreaterThan(0);

    if (response.tco2List) {
      logger.info(`TCO2s purchased: ${safeStableStringify(response.tco2List)}`);
    }

    const final_usdc_balance = await getERC20Balance(
      usdcAddress,
      impersonatedAddress,
      provider,
    );
    logger.info(`Final USDC balance: ${final_usdc_balance / 10n ** 6n} USDC`);
    expect(final_usdc_balance).toBeLessThan(
      initial_usdc_balance - BigInt(parseUnits("40", 6).toString()), // Expect at least 40 USDC spent (estimate is 48 USDC due to 100 * 0.48 USDC per NCT)
    );

    const nctBalance = await getERC20Balance(
      nctAddress,
      impersonatedAddress,
      provider,
    );
    logger.info(`Final NCT balance: ${nctBalance / 10n ** 18n} NCT`);
    expect(nctBalance).toBe(0n); // No NCT should remain
  });

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
});
