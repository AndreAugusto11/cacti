import "jest-extended";

import { Logger } from "@hyperledger/cactus-common";
import dotenv from "dotenv";
import { UniswapImpl } from "../../../main/typescript/dexes/uniswap";
import { ethers } from "ethers";
import {
  getERC20Balance,
  getTokenAddressBySymbol,
} from "../../../main/typescript/utils";
import { Network } from "../../../main/typescript";
import { parseUnits } from "ethers/lib/utils";
dotenv.config({ path: "packages/cactus-plugin-carbon-credit/.env" });

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

if (!ALCHEMY_API_KEY) {
  throw new Error("ALCHEMY_API_KEY not set in environment");
}

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

const plugin = new UniswapImpl({
  logLevel: "DEBUG",
  provider: provider,
});

const logger = new Logger({ label: "uniswap-swap.test.ts", level: "DEBUG" });

// Create a Polygon hardfork on block 77660000

describe("Uniswap quote and swap functionality", () => {
  test("getUSDCQuote returns a quote for swapping NCT to USDC", async () => {
    const quote = await plugin.getUSDCQuote(
      getTokenAddressBySymbol(Network.Polygon, "NCT"),
      parseUnits("1", 18).toString(), // 1 NCT
      Network.Polygon,
    );

    expect(quote).toBeDefined();
    expect(quote.amountOut).toBeDefined();
    expect(Number(quote.amountOut)).toBe(466935);
  });

  test("swapFromUSDC swaps USDC to NCT for impersonated address", async () => {
    const impersonatedAddress = "0xe9EdDDAD42aE9eeD98929D2Eb8aD93DE957274D3";
    const usdcAddress = getTokenAddressBySymbol(Network.Polygon, "USDC");
    const nctAddress = getTokenAddressBySymbol(Network.Polygon, "NCT");
    const amountIn = parseUnits("20", 18).toString(); // 20 NCT

    // Initial State

    const initial_usdc_balance = await getERC20Balance(
      usdcAddress,
      impersonatedAddress,
      provider,
    );
    logger.debug(`Initial USDC balance: ${initial_usdc_balance}`);
    expect(initial_usdc_balance).toBeGreaterThan(BigInt(0));

    const initial_nct_balance = await getERC20Balance(
      nctAddress,
      impersonatedAddress,
      provider,
    );
    logger.debug(`Initial NCT balance: ${initial_nct_balance}`);

    // Perform the swap

    await provider.send("hardhat_impersonateAccount", [impersonatedAddress]);
    const signer = provider.getSigner(impersonatedAddress);

    const receipt = await plugin.swapExactFromUSDC(
      signer,
      nctAddress,
      amountIn,
      Network.Polygon,
    );

    expect(receipt).toBeDefined();

    // Final State

    const final_usdc_balance = await getERC20Balance(
      usdcAddress,
      impersonatedAddress,
      provider,
    );
    logger.debug(`Final USDC balance: ${final_usdc_balance}`);
    expect(final_usdc_balance).toBeLessThan(parseUnits("1", 6).toBigInt()); // Expect less than 1 USDC remaining

    const nctBalance = await getERC20Balance(
      nctAddress,
      impersonatedAddress,
      provider,
    );
    logger.debug(`Final NCT balance: ${nctBalance}`);
    expect(nctBalance).toBe(parseUnits("20", 18).toBigInt()); // Expect 20 NCT bought

    logger.debug(
      `USDC spent: ${
        (Number(initial_usdc_balance) - Number(final_usdc_balance)) / 10 ** 6
      } USDC`,
    );
    logger.debug(`NCT bought: ${Number(nctBalance) / 10 ** 18} NCT`);

    logger.debug(
      `Avg price per NCT: ${
        (Number(initial_usdc_balance) - Number(final_usdc_balance)) /
        10 ** 6 /
        (Number(nctBalance) / 10 ** 18)
      } USDC`,
    );

    // Cleanup
    await provider.send("hardhat_stopImpersonatingAccount", [
      impersonatedAddress,
    ]);
  });
});
