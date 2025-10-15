import "jest-extended";

import { Logger } from "@hyperledger/cactus-common";
import { UniswapImpl } from "../../../main/typescript/dexes/uniswap";
import { ethers } from "ethers";
import {
  getERC20Balance,
  getTokenAddressBySymbol,
} from "../../../main/typescript/utils";
import { Network } from "../../../main/typescript";
import { parseUnits } from "ethers/lib/utils";

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const impersonatedAddress = "0xfa0b641678f5115ad8a8de5752016bd1359681b9";
const signer = provider.getSigner(impersonatedAddress);

const plugin = new UniswapImpl({
  logLevel: "DEBUG",
  signer: signer,
});

const logger = new Logger({ label: "uniswap-swap.test.ts", level: "DEBUG" });

// Create a Polygon hardfork on block 77660000

describe("Uniswap quote and swap functionality", () => {
  beforeAll(async () => {
    await provider.send("hardhat_impersonateAccount", [impersonatedAddress]);
  });

  afterAll(async () => {
    await provider.send("hardhat_stopImpersonatingAccount", [
      impersonatedAddress,
    ]);
  });

  test("getUSDCQuote returns a quote for swapping NCT to USDC", async () => {
    const quote = await plugin.getUSDCQuote(
      getTokenAddressBySymbol(Network.Polygon, "NCT"),
      parseUnits("1", 18).toString(), // 1 NCT
      Network.Polygon,
    );

    expect(quote).toBeDefined();
    expect(quote.amountOut).toBeDefined();
    expect(Number(quote.amountOut)).toBeLessThan(500000);
    expect(Number(quote.amountOut)).toBeGreaterThan(400000);
  });

  test("swapFromUSDC swaps USDC to NCT for impersonated address", async () => {
    const usdcAddress = getTokenAddressBySymbol(Network.Polygon, "USDC");
    const nctAddress = getTokenAddressBySymbol(Network.Polygon, "NCT");
    const amountIn = parseUnits("200", 18).toString(); // 200 NCT = 92 USDC at time of writing

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

    const receipt = await plugin.swapExactFromUSDC(
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
    expect(final_usdc_balance).toBeLessThan(
      initial_usdc_balance - parseUnits("90", 6).toBigInt(),
    ); // Expect less than 90 USDC remaining

    const nctBalance = await getERC20Balance(
      nctAddress,
      impersonatedAddress,
      provider,
    );
    logger.debug(`Final NCT balance: ${nctBalance}`);
    expect(nctBalance).toBe(
      initial_nct_balance + parseUnits("200", 18).toBigInt(),
    ); // Expect 200 NCT bought

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
  });
});
