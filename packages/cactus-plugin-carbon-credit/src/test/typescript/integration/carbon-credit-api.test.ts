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

const hardhat_addr1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const hardhat_privateKey1 =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const RECIPIENT = ethers.utils.getAddress(hardhat_addr1);
// This is the address of a Polygon wallet with a good amount of USDC. It was randomly selected
const WHALE = ethers.utils.getAddress(
  "0xD36ec33c8bed5a9F7B6630855f1533455b98a418",
);

const walletObject = {
  address: RECIPIENT,
  privateKey: hardhat_privateKey1,
  providerURL: "http://127.0.0.1:8545",
};

const pluginOptions: IPluginCarbonCreditOptions = {
  instanceId: "test-instance-id",
  signingCredential: {
    ethAccount: RECIPIENT,
    secret: hardhat_privateKey1,
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
  let apiClient: CarbonCreditApi;
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

    // Fund the impersonated test account with USDC by impersonating a real holder on the fork
    const ERC20_ABI = [
      "function transfer(address to, uint256 value) returns (bool)",
      "function balanceOf(address) view returns (uint256)",
    ];

    await getBalances(logger, RECIPIENT, provider);

    await provider.send("hardhat_impersonateAccount", [WHALE]);
    await provider.send("hardhat_setBalance", [
      WHALE,
      ethers.utils.parseEther("1").toHexString(), // give 1 MATIC for gas
    ]);

    const amount = ethers.BigNumber.from("1000000").mul(
      ethers.BigNumber.from(10).pow(6),
    );

    const usdc = new ethers.Contract(
      getTokenAddressBySymbol(Network.Polygon, "USDC"),
      ERC20_ABI,
      provider.getSigner(WHALE),
    );

    // Transfer 1,000,000 USDC (USDC has 6 decimals)
    await usdc.transfer(RECIPIENT, amount, {
      gasLimit: 200000,
      gasPrice: ethers.utils.parseUnits("30", "gwei"),
    });

    await getBalances(logger, RECIPIENT, provider);

    await provider.send("hardhat_stopImpersonatingAccount", [WHALE]);
  });

  afterAll(async () => {
    await Servers.shutdown(server);
  });

  test("performs specificBuy using apiClient and checks balances", async () => {
    // Get initial balances
    const balancesResponse = await getBalances(logger, RECIPIENT, provider);
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
          projectIdentifier: t.projectDetails.projectId,
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
      RECIPIENT,
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
    } = await getBalances(logger, RECIPIENT, provider);
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
      await getBalances(logger, RECIPIENT, provider);

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
    } = await getBalances(logger, RECIPIENT, provider);
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
    } = await getBalances(logger, RECIPIENT, provider);
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
      beneficiaryAddress: RECIPIENT,
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
      await getBalances(logger, RECIPIENT, provider);

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
    } = await getBalances(logger, RECIPIENT, provider);
    expect(initial_usdc_balance).toBeGreaterThan(BigInt(0));

    // Step 2: Get available TCO2s and select 3 with enough liquidity
    const tco2sResponse = await apiClient.getAvailableTCO2sRequest({
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      orderBy: "supply",
    });
    expect(tco2sResponse).toBeDefined();
    expect(Array.isArray(tco2sResponse.data.tco2List)).toBeTrue();
    expect(tco2sResponse.data.totalCount).toBeGreaterThan(0);

    const ERC20_ABI = ["function balanceOf(address) view returns (uint256)"];
    const NCT_ADDRESS = getTokenAddressBySymbol(Network.Polygon, "NCT");
    const required = ethers.utils.parseUnits("40", 18);

    const selectedTCO2s: any[] = [];
    for (const t of tco2sResponse.data.tco2List) {
      try {
        const tco2Contract = new ethers.Contract(
          t.address,
          ERC20_ABI,
          provider,
        );
        const bal: ethers.BigNumber = await tco2Contract.balanceOf(NCT_ADDRESS);
        if (bal.gte(required)) {
          selectedTCO2s.push(t);
          if (selectedTCO2s.length >= 3) break;
        }
      } catch (err) {
        logger.warn(`Failed to query balance for ${t.address}: ${err}`);
      }
    }

    // Step 3: Buy each selected TCO2 specifically for 40 units (18 decimals)
    const items: Record<string, string> = {};
    selectedTCO2s.forEach((tco2) => {
      items[tco2.address] = required.toString();
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
      expect(assetAmount.amount).toBe("36000000000000000000");
    }

    // Step 4: Retire all specifically purchased TCO2s
    const retireItems: Record<string, string> = {};
    selectedTCO2s.forEach((tco2) => {
      retireItems[tco2.address] = ethers.utils.parseUnits("5", 18).toString();
    });

    const retireRequest = {
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      entityName: "Unit Test Entity",
      tco2s: Object.keys(retireItems),
      amounts: Object.values(retireItems),
      beneficiaryAddress: RECIPIENT,
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
      await getBalances(logger, RECIPIENT, provider);

    expect(final_usdc_balance).toBeLessThan(initial_usdc_balance);
    expect(final_nct_balance).toBe(initial_nct_balance);
  });
});
