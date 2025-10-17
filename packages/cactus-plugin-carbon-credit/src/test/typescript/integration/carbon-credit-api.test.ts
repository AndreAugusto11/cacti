/* eslint-disable @typescript-eslint/no-unused-vars */
import "jest-extended";
import express from "express";
import bodyParser from "body-parser";
import http from "http";
import { AddressInfo } from "net";

import { IListenOptions, Servers, Logger } from "@hyperledger/cactus-common";
import { Configuration } from "@hyperledger/cactus-core-api";

import {
  DefaultApi as CarbonCreditApi,
  PluginCarbonCredit,
  IPluginCarbonCreditOptions,
  Network,
  Marketplace,
} from "../../../main/typescript/public-api";
import { ethers } from "ethers";
import {
  getBalances,
  getTokenAddressBySymbol,
} from "../../../main/typescript/utils";
import { Web3SigningCredentialPrivateKeyHex } from "@hyperledger/cactus-plugin-ledger-connector-ethereum";
import dotenv from "dotenv";

dotenv.config({ path: "packages/cactus-plugin-carbon-credit/.env" });

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

if (!ALCHEMY_API_KEY) {
  throw new Error("ALCHEMY_API_KEY not set in environment");
}

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

// This is the address of a Polygon wallet with a good amount of USDC. It was randomly selected
const impersonatedAddress = "0xfa0b641678f5115ad8a8de5752016bd1359681b9";

const walletObject = {
  address: impersonatedAddress,
  privateKey: "", // private key not needed for impersonated account
  providerURL: "http://127.0.0.1:8545",
};

const pluginOptions: IPluginCarbonCreditOptions = {
  instanceId: "test-instance-id",
  signingCredential: {
    ethAccount: "0xb5271339c211cC1EEeD30a2f9f447063a5faD1F0",
    secret: "739ed7c97109f28bc8f13b354b30bbd01a47061be7676c3c3934aa4a56540de4",
  } as Web3SigningCredentialPrivateKeyHex,
  networksConfig: [
    {
      rpcUrl: "https://polygon-mainnet.g.alchemy.com/v2/" + ALCHEMY_API_KEY,
      network: Network.Polygon,
    },
  ],
  logLevel: "INFO",
};

const logger = new Logger({
  label: "carbon-credit-api.test.ts",
  level: "INFO",
});

// Create a Polygon hardfork on block 77660000, and start the node on port 8545

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

    const plugin = new PluginCarbonCredit(pluginOptions);
    await plugin.getOrCreateWebServices();
    await plugin.registerWebServices(expressApp);

    apiClient = new CarbonCreditApi(new Configuration({ basePath: apiHost }));

    await provider.send("hardhat_impersonateAccount", [impersonatedAddress]);
  });

  afterAll(async () => {
    await Servers.shutdown(server);

    await provider.send("hardhat_stopImpersonatingAccount", [
      impersonatedAddress,
    ]);
  });

  test("performs specificBuy using apiClient and checks balances", async () => {
    // Get initial balances
    const balancesResponse = await getBalances(
      logger,
      impersonatedAddress,
      provider,
    );
    const initial_usdc_balance = BigInt(balancesResponse.usdcBalance);
    const initial_nct_balance = BigInt(balancesResponse.nctBalance);
    expect(initial_usdc_balance).toBeGreaterThan(BigInt(0));

    // Get available TCO2s
    const tco2sResponse = await apiClient.getAvailableTCO2sRequest({
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      orderBy: "supply",
    });
    expect(tco2sResponse).toBeDefined();
    expect(Array.isArray(tco2sResponse.data.tco2List)).toBeTrue();
    expect(tco2sResponse.data.totalCount).toBeGreaterThan(0);

    // Select 3 TCO2s
    const selectedTCO2s = tco2sResponse.data.tco2List.slice(0, 3);

    // Get metadata for selected TCO2s
    const tco2Metadata = await Promise.all(
      selectedTCO2s.map(async (t) =>
        apiClient.getTCO2MetadataRequest({
          marketplace: Marketplace.Toucan,
          network: Network.Polygon,
          projectIdentifier: t.projectId,
          tco2Identifier: t.address,
        }),
      ),
    );
    expect(tco2Metadata).toBeDefined();
    expect(tco2Metadata.length).toBe(3);

    // Prepare specificBuy request
    const paymentToken = getTokenAddressBySymbol(Network.Polygon, "USDC");

    const items: Record<string, string> = {};
    selectedTCO2s.forEach((t) => {
      items[t.address] = ethers.utils.parseUnits("100", 18).toString();
    });

    // Perform specificBuy
    const specificBuyResponse = await apiClient.specificBuyRequest({
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      paymentToken: paymentToken,
      items,
      walletObject: walletObject,
    });

    expect(specificBuyResponse).toBeDefined();
    expect(specificBuyResponse.data.txHashSwap).toBeDefined();
    expect(specificBuyResponse.data.buyTxHash).toBeDefined();
    expect(specificBuyResponse.data.assetAmounts).toBeDefined();
    expect(specificBuyResponse.data.assetAmounts.length).toBe(3);
    for (const assetAmount of specificBuyResponse.data.assetAmounts) {
      expect(assetAmount.amount).toBe("90000000000000000000");
    }

    // Get final balances
    const finalBalancesResponse = await getBalances(
      logger,
      impersonatedAddress,
      provider,
    );
    const final_usdc_balance = BigInt(finalBalancesResponse.usdcBalance);
    const final_nct_balance = BigInt(finalBalancesResponse.nctBalance);

    expect(final_usdc_balance).toBeLessThan(initial_usdc_balance);
    expect(final_nct_balance).toBe(initial_nct_balance);
  });

  test("Random buy via API client runs successfully", async () => {
    // Get initial balances
    const {
      usdcBalance: initial_usdc_balance,
      nctBalance: initial_nct_balance,
    } = await getBalances(logger, impersonatedAddress, provider);
    expect(initial_usdc_balance).toBeGreaterThan(BigInt(0));

    // Prepare randomBuy request
    const request = {
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      paymentToken: getTokenAddressBySymbol(Network.Polygon, "USDC"),
      amount: ethers.utils.parseUnits("100", 18).toString(), // 100 tonnes
      walletObject: walletObject,
    };

    // Call randomBuy via API client
    const response = await apiClient.randomBuyRequest(request);

    expect(response).toBeDefined();
    expect(response.data.txHashSwap).toBeDefined();
    expect(response.data.assetAmounts).toBeDefined();
    expect(response.data.assetAmounts.length).toBeGreaterThan(0);

    // Get final balances
    const { usdcBalance: final_usdc_balance, nctBalance: final_nct_balance } =
      await getBalances(logger, impersonatedAddress, provider);

    expect(final_usdc_balance).toBeLessThan(
      initial_usdc_balance -
        BigInt(ethers.utils.parseUnits("40", 6).toString()),
    );
    expect(final_nct_balance).toBe(initial_nct_balance);
  });

  test("Retire function retires randomly purchased TCO2s successfully", async () => {
    const usdcAddress = getTokenAddressBySymbol(Network.Polygon, "USDC");

    const {
      usdcBalance: initial_usdc_balance,
      nctBalance: initial_nct_balance,
    } = await getBalances(logger, impersonatedAddress, provider);
    expect(initial_usdc_balance).toBeGreaterThan(BigInt(0));

    // Step 1: Buy some TCO2s using randomBuy via API client
    const buyRequest = {
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      paymentToken: usdcAddress,
      amount: ethers.utils.parseUnits("100", 18).toString(),
      walletObject: walletObject,
    };
    const buyResponse = await apiClient.randomBuyRequest(buyRequest);

    expect(buyResponse).toBeDefined();
    expect(buyResponse.data.assetAmounts).toBeDefined();
    expect(buyResponse.data.assetAmounts.length).toBeGreaterThan(0);

    const {
      usdcBalance: post_buy_usdc_balance,
      nctBalance: post_buy_nct_balance,
    } = await getBalances(logger, impersonatedAddress, provider);
    expect(post_buy_usdc_balance).toBeLessThan(initial_usdc_balance);
    expect(post_buy_nct_balance).toBe(initial_nct_balance);

    // Step 2: Retire the purchased TCO2s via API client
    const retireItems: Record<string, string> = {};
    buyResponse.data.assetAmounts.forEach((tco2: any) => {
      retireItems[tco2.address] = ethers.utils.parseUnits("50", 18).toString();
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
      walletObject: walletObject,
    };

    const retireResponse = await apiClient.retireRequest(retireRequest);

    expect(retireResponse).toBeDefined();
    expect(retireResponse.data.txHashesRetire).toBeDefined();
    expect(retireResponse.data.txHashesRetire.length).toBe(
      buyResponse.data.assetAmounts.length,
    );
    expect(retireResponse.data.retirementCertificateIds).toBeDefined();
    expect(retireResponse.data.retirementCertificateIds.length).toBe(
      buyResponse.data.assetAmounts.length,
    );

    const { usdcBalance: final_usdc_balance, nctBalance: final_nct_balance } =
      await getBalances(logger, impersonatedAddress, provider);

    expect(final_usdc_balance).toBe(post_buy_usdc_balance);
    expect(final_nct_balance).toBe(post_buy_nct_balance);

    // Step 3: Verify on-chain that the TCO2s were indeed retired in the NFTs
    for (const certificateId of retireResponse.data.retirementCertificateIds) {
      // You may need to implement getRetiredAmountInNFT for API client context
      // For now, just log the certificateId
      logger.info(
        `Retirement certificate ${certificateId} created for unit test.`,
      );
    }
  });

  test("Retire function retires specifically purchased TCO2s successfully via API client", async () => {
    // Step 1: Get initial balances
    const {
      usdcBalance: initial_usdc_balance,
      nctBalance: initial_nct_balance,
    } = await getBalances(logger, impersonatedAddress, provider);
    expect(initial_usdc_balance).toBeGreaterThan(BigInt(0));

    // Step 2: Get available TCO2s and select 3
    const tco2sResponse = await apiClient.getAvailableTCO2sRequest({
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      orderBy: "supply",
    });
    expect(tco2sResponse).toBeDefined();
    expect(Array.isArray(tco2sResponse.data.tco2List)).toBeTrue();
    expect(tco2sResponse.data.totalCount).toBeGreaterThan(0);

    const randomIndex = Math.floor(
      Math.random() * (tco2sResponse.data.tco2List.length - 3),
    );
    const selectedTCO2s = tco2sResponse.data.tco2List.slice(
      randomIndex,
      randomIndex + 3,
    );

    // Step 3: Buy each TCO2 specifically
    const items: Record<string, string> = {};
    selectedTCO2s.forEach((tco2) => {
      items[tco2.address] = ethers.utils.parseUnits("400", 18).toString();
    });

    const specificBuyResponse = await apiClient.specificBuyRequest({
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      paymentToken: getTokenAddressBySymbol(Network.Polygon, "USDC"),
      items,
      walletObject: walletObject,
    });
    expect(specificBuyResponse).toBeDefined();
    expect(specificBuyResponse.data.txHashSwap).toBeDefined();
    expect(specificBuyResponse.data.buyTxHash).toBeDefined();
    expect(specificBuyResponse.data.assetAmounts).toBeDefined();
    expect(specificBuyResponse.data.assetAmounts.length).toBe(3);
    for (const assetAmount of specificBuyResponse.data.assetAmounts) {
      expect(assetAmount.amount).toBe("360000000000000000000");
    }

    // Step 4: Retire all specifically purchased TCO2s
    const retireItems: Record<string, string> = {};
    selectedTCO2s.forEach((tco2) => {
      retireItems[tco2.address] = ethers.utils.parseUnits("200", 18).toString();
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
      walletObject: walletObject,
    };

    const retireResponse = await apiClient.retireRequest(retireRequest);

    expect(retireResponse).toBeDefined();
    expect(retireResponse.data.txHashesRetire).toBeDefined();
    expect(retireResponse.data.txHashesRetire.length).toBe(
      selectedTCO2s.length,
    );
    expect(retireResponse.data.retirementCertificateIds).toBeDefined();
    expect(retireResponse.data.retirementCertificateIds.length).toBe(
      selectedTCO2s.length,
    );

    // Step 5: Log certificates (on-chain verification can be added if needed)
    for (const certificateId of retireResponse.data.retirementCertificateIds) {
      logger.info(
        `Retirement certificate ${certificateId} created for specific buy test.`,
      );
    }

    const { usdcBalance: final_usdc_balance, nctBalance: final_nct_balance } =
      await getBalances(logger, impersonatedAddress, provider);

    expect(final_usdc_balance).toBeLessThan(initial_usdc_balance);
    expect(final_nct_balance).toBe(initial_nct_balance);
  });
});
