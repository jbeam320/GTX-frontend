export interface Subnet {
    name: string;
    netuid: number;
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