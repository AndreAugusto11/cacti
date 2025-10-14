import { Network } from "./public-api";

// Do not change the struct, this information is needed for the
// computePoolAddress function from @uniswap/v3-sdk in getPurchasePrice
export interface TokenInfo {
  chainId: number;
  address: string;
  decimals: number;
  symbol: string;
  name: string;
}

interface DexInfo {
  factory: string;
  quoter: string;
  router: string;
}

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

export const DEFAULT_DEX = {
  polygon: {
    factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984", // Uniswap V2
    quoter: "0x61fFE014bA17989E743c5F6cB21bF9697530B21e", // Quoter V2
    router: "xx", // TODO
  },
  celo: {
    factory: "0xAfE208a311B21f13EF87E33A90049fC17A7acDEc", // Uniswap V2
    quoter: "0x82825d0554fA07f7FC52Ab63c961F330fdEFa8E8", // Quoter V2
    router: "", // TODO
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
