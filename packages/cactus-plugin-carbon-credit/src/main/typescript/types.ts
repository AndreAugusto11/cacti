// Do not change the struct, this information is needed for the
// computePoolAddress function from @uniswap/v3-sdk in getPurchasePrice
export interface TokenInfo {
  chainId: number;
  address: string;
  decimals: number;
  symbol: string;
  name: string;
}

export interface DexInfo {
  factory: string;
  quoter: string;
  router: string;
}

export interface Quote {
  amountIn: string;
  amountOut: string;
  poolAddress: string;
  fee: number;
  timestamp: number;
}
