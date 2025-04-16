import { Subnet } from "./types";

interface Token extends Subnet {
    balance: string;
    amount: number;
}

export const TAO = "τ";
export const PLANCK_PER_TAO = 1e9;

export const defaultValidator = {
    hotkey: "5FCPTnjevGqAuTttetBy4a24Ej3pH9fiQ8fmvP1ZkrVsLUoT",
    name: "Roundtable21"
}

export const DEFUALT_TOKEN : Token = {
    name: "",
    netuid: 0,
    symbol: "TAO",
    emission: 0,
    price: 1e9,
    price_change_1h: 0,
    price_change_24h: 0,    
    price_change_1w: 0, 
    market_cap: 0,  
    volume_24h: 0,  
    liquidity: 0,   
    last_7days_trends: [],
    balance: "0",
    amount: 0,
}