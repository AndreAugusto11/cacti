import { ethers } from "ethers";
import { Network } from "./public-api";
import { TokenInfo, DexInfo } from "./types";

export const TOKEN_ADDRESSES: Record<string, Record<string, TokenInfo>> = {
  polygon: {
    NCT: {
      chainId: 137,
      address: "0xD838290e877E0188a4A44700463419ED96c16107",
      decimals: 18,
      symbol: "NCT",
      name: "Toucan Protocol: Nature Carbon Tonne",
    },
    USDC: {
      chainId: 137,
      address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      decimals: 6,
      symbol: "USDC",
      name: "USD Coin",
    },
  },
  celo: {
    NCT: {
      chainId: 42220,
      address: "0x02De4766C272abc10Bc88c220D214A26960a7e92",
      decimals: 18,
      symbol: "NCT",
      name: "Toucan Protocol: Nature Carbon Tonne",
    },
    USDC: {
      chainId: 42220,
      address: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
      decimals: 18,
      symbol: "cUSD",
      name: "Celo Dollar",
    },
  },
};

export const DEFAULT_DEX: Record<string, DexInfo> = {
  polygon: {
    factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984", // Uniswap V2
    quoter: "0x61fFE014bA17989E743c5F6cB21bF9697530B21e", // Quoter V2
    router: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", // Swap Router V2
  },
  celo: {
    factory: "0xAfE208a311B21f13EF87E33A90049fC17A7acDEc", // Uniswap V2
    quoter: "0x82825d0554fA07f7FC52Ab63c961F330fdEFa8E8", // Quoter V2
    router: "0x5615CDAb10dc425a742d643d949a7F474C01abc4", // Swap Router V2
  },
};

export function getTokenAddressBySymbol(
  network: Network,
  tokenSymbol: string,
): string {
  return getTokenBySymbol(network, tokenSymbol).address;
}

export function getTokenBySymbol(
  network: Network,
  tokenSymbol: string,
): TokenInfo {
  switch (network) {
    case Network.Polygon:
      if (tokenSymbol === "NCT") {
        return TOKEN_ADDRESSES.polygon.NCT;
      } else if (tokenSymbol === "USDC") {
        return TOKEN_ADDRESSES.polygon.USDC;
      } else {
        throw new Error(`Unsupported token symbol ${tokenSymbol} on Polygon`);
      }
    case Network.Celo:
      if (tokenSymbol === "NCT") {
        return TOKEN_ADDRESSES.celo.NCT;
      } else if (tokenSymbol === "USDC") {
        return TOKEN_ADDRESSES.celo.USDC;
      } else {
        throw new Error(`Unsupported token symbol ${tokenSymbol} on Celo`);
      }
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}

export function getTokenByAddress(
  network: Network,
  tokenAddress: string,
): TokenInfo {
  const networkKey =
    network === Network.Polygon
      ? "polygon"
      : network === Network.Celo
        ? "celo"
        : null;
  if (!networkKey) {
    throw new Error(`Unsupported network: ${network}`);
  }

  const tokens = TOKEN_ADDRESSES[networkKey];
  for (const symbol in tokens) {
    if (tokens[symbol].address.toLowerCase() === tokenAddress.toLowerCase()) {
      return tokens[symbol];
    }
  }

  throw new Error(`Token with address ${tokenAddress} not found on ${network}`);
}

export function getDefaultDex(network: Network): DexInfo {
  switch (network) {
    case Network.Polygon:
      return DEFAULT_DEX.polygon;
    case Network.Celo:
      return DEFAULT_DEX.celo;
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}

/**
 * Returns the ERC20 token balance for a given address.
 * @param tokenAddress ERC20 token contract address
 * @param ownerAddress Address to check balance for
 * @param provider ethers provider
 * @returns Promise<BigInt> token balance
 */
export async function getERC20Balance(
  tokenAddress: string,
  ownerAddress: string,
  provider: ethers.providers.Provider,
): Promise<bigint> {
  const erc20 = new ethers.Contract(
    tokenAddress,
    ["function balanceOf(address owner) view returns (uint256)"],
    provider,
  );
  const balance = await erc20.balanceOf(ownerAddress);
  return BigInt(balance.toString());
}

/**
 * Returns the ERC20 token allowance for a given owner and spender.
 * @param tokenAddress ERC20 token contract address
 * @param ownerAddress Address of the token owner
 * @param spenderAddress Address of the spender
 * @param provider ethers provider
 * @returns Promise<BigInt> token allowance
 */
export async function getERC20Allowance(
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string,
  provider: ethers.providers.Provider,
): Promise<bigint> {
  const erc20 = new ethers.Contract(
    tokenAddress,
    [
      "function allowance(address owner, address spender) view returns (uint256)",
    ],
    provider,
  );
  const allowance = await erc20.allowance(ownerAddress, spenderAddress);
  return BigInt(allowance.toString());
}
