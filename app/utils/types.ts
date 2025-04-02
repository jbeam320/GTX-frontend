export interface Subnet {
    name: string;
    netuid: number;
    symbol: string;
    emission: number;
    price: number;
    price_change_1h: number;
    price_change_24h: number;
    price_change_1w: number;
    market_cap: number;
    volume_24h: number;
    liquidity: number;
    last_7days_trends: number[];
  }

  export interface Validator {
    name: string;
    rating: number;
    apy: number;
    stake: string;
    stakeChange: string;
    yield: string;
    yieldUsd: string;
    balance: string;
    fee: string;
  }

  export interface Token {
    symbol: string;
    balance: string;
    subnetName: string;
    netuid: number;
    isStaked: boolean;
    price: number;
  }