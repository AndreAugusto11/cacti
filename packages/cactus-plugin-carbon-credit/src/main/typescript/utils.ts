import { Network } from "./public-api";

interface TokenInfo {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
}

interface DexInfo {
  factory: string;
  router: string;
}

export const TOKEN_ADDRESSES: Record<string, Record<string, TokenInfo>> = {
  polygon: {
    NCT: {
      address: "0xD838290e877E0188a4A44700463419ED96c16107",
      decimals: 18,
      symbol: "NCT",
      name: "Toucan Protocol: Nature Carbon Tonne",
    },
    USDC: {
      address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
      decimals: 6,
      symbol: "USDC",
      name: "USD Coin (PoS)",
    },
  },
  celo: {
    NCT: {
      address: "0x02De4766C272abc10Bc88c220D214A26960a7e92",
      decimals: 18,
      symbol: "NCT",
      name: "Toucan Protocol: Nature Carbon Tonne",
    },
    USDC: {
      address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
      decimals: 6,
      symbol: "USDC",
      name: "USD Coin (PoS)",
    },
  },
};

export const DEFAULT_DEX = {
  polygon: {
    factory: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4", // SushiSwap V2
    router: "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506", // SushiSwap V2
  },
  celo: {
    factory: "", // TODO
    router: "", // TODO
  },
};

export function getTokenAddress(network: Network, tokenSymbol: string): string {
  return getToken(network, tokenSymbol).address;
}

export function getToken(network: Network, tokenSymbol: string): TokenInfo {
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
