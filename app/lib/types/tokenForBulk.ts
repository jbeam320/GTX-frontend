import { Subnet } from "./subnet";

export interface TokenForBulk extends Subnet {
  balance: string;
  amount: number;
  type: "sell" | "buy" | "none";
}
