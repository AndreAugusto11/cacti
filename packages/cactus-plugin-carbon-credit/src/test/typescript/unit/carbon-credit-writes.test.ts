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
  getBalances,
  getTokenAddressBySymbol,
} from "../../../main/typescript/utils";
import { parseUnits } from "ethers/lib/utils";
import safeStableStringify from "safe-stable-stringify";

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

// This is the address of a Polygon wallet with a good amount of USDC. It was randomly selected
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
    const {
      usdcBalance: initial_usdc_balance,
      nctBalance: initial_nct_balance,
    } = await getBalances(logger, impersonatedAddress, provider);
    expect(initial_usdc_balance).toBeGreaterThan(BigInt(0));

    const tco2sRequest: GetAvailableTCO2sRequest = {
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      orderBy: "supply",
    };

    const tco2sResponse = await plugin.getAvailableTCO2s(tco2sRequest, signer);

    expect(tco2sResponse).toBeDefined();
    expect(tco2sResponse.tco2List).toBeInstanceOf(Array);
    expect(tco2sResponse.totalCount).toBeGreaterThan(0);

    // Select 3 randomly
    const selectedTCO2s = tco2sResponse.tco2List.slice(0, 3);

    const tco2Metadata = await Promise.all(
      selectedTCO2s.map(async (t) =>
        plugin.getTCO2Metadata(
          {
            marketplace: Marketplace.Toucan,
            network: Network.Polygon,
            projectIdentifier: t.projectId,
            tco2Identifier: t.address,
          },
          signer,
        ),
      ),
    );

    expect(tco2Metadata).toBeDefined();
    expect(tco2Metadata.length).toBe(3);

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
    expect(specificBuyResponse.buyTxHash).toBeDefined();
    expect(specificBuyResponse.assetAmounts).toBeDefined();
    expect(specificBuyResponse.assetAmounts.length).toBe(3);
    for (const assetAmount of specificBuyResponse.assetAmounts) {
      expect(assetAmount.amount).toBe("90000000000000000000"); // 90 tonnes after 10% fee
    }

    const { usdcBalance: final_usdc_balance, nctBalance: final_nct_balance } =
      await getBalances(logger, impersonatedAddress, provider);

    expect(final_usdc_balance).toBeLessThan(initial_usdc_balance);
    expect(final_nct_balance).toBe(initial_nct_balance); // No NCT should remain beyond what was there initially
  });

  test("Random buy function runs successfully", async () => {
    const {
      usdcBalance: initial_usdc_balance,
      nctBalance: initial_nct_balance,
    } = await getBalances(logger, impersonatedAddress, provider);
    expect(initial_usdc_balance).toBeGreaterThan(BigInt(0));

    const request = {
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      paymentToken: "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B", // USDC on Polygon
      amount: parseUnits("100", 18).toString(), // 100 tonnes
    };
    const response = await plugin.randomBuy(request, signer);
    expect(response).toBeDefined();
    expect(response.txHashSwap).toBeDefined();
    expect(response.assetAmounts).toBeDefined();
    expect(response.assetAmounts!.length).toBeGreaterThan(0);

    if (response.assetAmounts) {
      logger.info(
        `TCO2s purchased: ${safeStableStringify(response.assetAmounts)}`,
      );
    }

    const { usdcBalance: final_usdc_balance, nctBalance: final_nct_balance } =
      await getBalances(logger, impersonatedAddress, provider);

    expect(final_usdc_balance).toBeLessThan(
      initial_usdc_balance - BigInt(parseUnits("40", 6).toString()), // Expect at least 40 USDC spent (estimate is 48 USDC due to 100 * 0.48 USDC per NCT)
    );
    expect(final_nct_balance).toBe(initial_nct_balance); // No NCT should remain beyond what was there initially
  });

  test("Retire function retires randomly purchased TCO2s successfully", async () => {
    const usdcAddress = getTokenAddressBySymbol(Network.Polygon, "USDC");

    const {
      usdcBalance: initial_usdc_balance,
      nctBalance: initial_nct_balance,
    } = await getBalances(logger, impersonatedAddress, provider);
    expect(initial_usdc_balance).toBeGreaterThan(BigInt(0));

    // Step 1: Buy some TCO2s using randomBuy
    const buyRequest = {
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      paymentToken: usdcAddress,
      amount: parseUnits("100", 18).toString(), // Buy 100 tonnes
    };
    const buyResponse = await plugin.randomBuy(buyRequest, signer);

    expect(buyResponse).toBeDefined();
    expect(buyResponse.assetAmounts).toBeDefined();
    expect(buyResponse.assetAmounts!.length).toBeGreaterThan(0);

    const {
      usdcBalance: post_buy_usdc_balance,
      nctBalance: post_buy_nct_balance,
    } = await getBalances(logger, impersonatedAddress, provider);
    expect(post_buy_usdc_balance).toBeLessThan(initial_usdc_balance);
    expect(post_buy_nct_balance).toBe(initial_nct_balance);

    // Step 2: Retire the purchased TCO2s
    const retireItems: Record<string, string> = {};
    buyResponse.assetAmounts!.forEach((tco2) => {
      retireItems[tco2.address] = parseUnits("50", 18).toString(); // Retire 50 tonnes from each
    });

    const retireRequest = {
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      entityName: "Unit Test Entity",
      tco2s: Object.keys(retireItems),
      amounts: Object.values(retireItems),
      beneficiaryAddress: impersonatedAddress,
      beneficiaryName: "Unit Test Beneficiary",
      message: "Retired for unit test",
      retirementReason: "Unit testing of carbon credit plugin",
    };

    const retireResponse = await plugin.retire(retireRequest, signer);

    expect(retireResponse).toBeDefined();
    expect(retireResponse.txHashesRetire).toBeDefined();
    expect(retireResponse.txHashesRetire.length).toBe(
      buyResponse.assetAmounts!.length,
    );
    expect(retireResponse.retirementCertificateIds).toBeDefined();
    expect(retireResponse.retirementCertificateIds!.length).toBe(
      buyResponse.assetAmounts!.length,
    );

    const { usdcBalance: final_usdc_balance, nctBalance: final_nct_balance } =
      await getBalances(logger, impersonatedAddress, provider);

    expect(final_usdc_balance).toBe(post_buy_usdc_balance); // No USDC change on retire
    expect(final_nct_balance).toBe(post_buy_nct_balance); // No NCT change on retire

    // Step 3: Verify on-chain that the TCO2s were indeed retired in the NFTs
    for (const certificateId of retireResponse.retirementCertificateIds!) {
      const retiredAmount = await getRetiredAmountInNFT(certificateId, signer);
      expect(retiredAmount).toBe(parseUnits("50", 18).toBigInt());
      logger.info(
        `Retirement certificate ${certificateId} has ${retiredAmount.toString()} TCO2s retired.`,
      );
    }
  });

  test("Retire function retires specifically purchased TCO2s successfully", async () => {
    // Step 1: Get initial balances
    const {
      usdcBalance: initial_usdc_balance,
      nctBalance: initial_nct_balance,
    } = await getBalances(logger, impersonatedAddress, provider);
    expect(initial_usdc_balance).toBeGreaterThan(BigInt(0));

    // Step 2: Get available TCO2s and select 3
    const tco2sRequest: GetAvailableTCO2sRequest = {
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      orderBy: "supply",
    };
    const tco2sResponse = await plugin.getAvailableTCO2s(tco2sRequest, signer);
    expect(tco2sResponse).toBeDefined();
    expect(tco2sResponse.tco2List).toBeInstanceOf(Array);
    expect(tco2sResponse.totalCount).toBeGreaterThan(0);

    const randomIndex = Math.floor(
      Math.random() * (tco2sResponse.tco2List.length - 3),
    );

    const selectedTCO2s = tco2sResponse.tco2List.slice(
      randomIndex,
      randomIndex + 3,
    );

    // Step 3: Buy each TCO2 specifically
    const specificBuyRequest = {
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      paymentToken: getTokenAddressBySymbol(Network.Polygon, "USDC"),
      items: {
        [selectedTCO2s[0].address]: parseUnits("400", 18).toString(),
        [selectedTCO2s[1].address]: parseUnits("400", 18).toString(),
        [selectedTCO2s[2].address]: parseUnits("400", 18).toString(),
      },
    };
    const specificBuyResponse = await plugin.specificBuy(
      specificBuyRequest,
      signer,
    );
    expect(specificBuyResponse).toBeDefined();
    expect(specificBuyResponse.txHashSwap).toBeDefined();
    expect(specificBuyResponse.buyTxHash).toBeDefined();
    expect(specificBuyResponse.assetAmounts).toBeDefined();
    expect(specificBuyResponse.assetAmounts.length).toBe(3);
    for (const assetAmount of specificBuyResponse.assetAmounts) {
      expect(assetAmount.amount).toBe("360000000000000000000"); // 360 tonnes after 10% fee
    }

    // Step 4: Retire all specifically purchased TCO2s
    const retireItems: Record<string, string> = {};
    selectedTCO2s.forEach((tco2) => {
      retireItems[tco2.address] = parseUnits("200", 18).toString();
    });

    const retireRequest = {
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      entityName: "Unit Test Entity",
      tco2s: Object.keys(retireItems),
      amounts: Object.values(retireItems),
      beneficiaryAddress: impersonatedAddress,
      beneficiaryName: "Unit Test Beneficiary",
      message: "Retired for specific buy test",
      retirementReason: "Unit testing specific buy retire",
    };

    const retireResponse = await plugin.retire(retireRequest, signer);

    expect(retireResponse).toBeDefined();
    expect(retireResponse.txHashesRetire).toBeDefined();
    expect(retireResponse.txHashesRetire.length).toBe(selectedTCO2s.length);
    expect(retireResponse.retirementCertificateIds).toBeDefined();
    expect(retireResponse.retirementCertificateIds!.length).toBe(
      selectedTCO2s.length,
    );

    // Step 5: Verify certificates on-chain
    for (const certificateId of retireResponse.retirementCertificateIds!) {
      const retiredAmount = await getRetiredAmountInNFT(certificateId, signer);
      expect(retiredAmount).toBe(parseUnits("200", 18).toBigInt());
      logger.info(
        `Retirement certificate ${certificateId} has ${retiredAmount.toString()} TCO2s retired.`,
      );
    }

    const { usdcBalance: final_usdc_balance, nctBalance: final_nct_balance } =
      await getBalances(logger, impersonatedAddress, provider);

    expect(final_usdc_balance).toBeLessThan(initial_usdc_balance);
    expect(final_nct_balance).toBe(initial_nct_balance);
  });

  async function getRetiredAmountInNFT(nftId: number, signer: ethers.Signer) {
    const nftContractAddress = "0x5e377f16e4ec6001652befd737341a28889af002"; // Toucan TCO2 NFT contract on Polygon
    const nftAbi = [
      "function getRetiredAmount(uint256) view returns (uint256)",
    ];
    const nftContract = new ethers.Contract(nftContractAddress, nftAbi, signer);
    const retiredAmount = await nftContract.getRetiredAmount(nftId);
    return BigInt(retiredAmount.toString());
  }
});
