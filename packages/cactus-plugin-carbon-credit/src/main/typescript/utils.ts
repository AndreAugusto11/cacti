import { Network } from "./public-api";

export const TOKEN_ADDRESSES = {
  polygon: {
    NCT: "0xD838290e877E0188a4A44700463419ED96c16107",
    USDC: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  },
  celo: {
    NCT: "0xD838290e877E0188a4A44700463419ED96c16107",
    USDC: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  },
};

export const DEFAULT_DEX = {
  polygon: "0x",
  celo: "0x",
};

export async function getTokenAddress(
  network: Network,
  tokenSymbol: string,
): Promise<string> {
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

export async function getDefaultDex(network: Network): Promise<string> {
  switch (network) {
    case Network.Polygon:
      return DEFAULT_DEX.polygon;
    case Network.Celo:
      return DEFAULT_DEX.celo;
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}
