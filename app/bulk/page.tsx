"use client";

import TokenList from "../components/shared/lists/TokenList";
import { subnets } from "../lib/data";
import { useState, useEffect } from "react";
import { TokenForBulk } from "../lib/types";
import { QuotePanel } from "../components/shared/panels";
import { useWalletStore } from "../stores/store";

export default function Bulk() {
  const { getValidatorStake, selectedValidator } = useWalletStore();

  const [tokens, setTokens] = useState<TokenForBulk[]>([]);

  useEffect(() => {
    if (subnets.length) {
      setTokens(
        subnets.map((subnet) => ({
          ...subnet,
          balance: "0",
          amount: 0,
          type: "none",
        }))
      );

      const loadBalances = async () => {
        try {
          for (const subnet of subnets) {
            const stake = await getValidatorStake(
              selectedValidator.hotkey,
              subnet.netuid
            );
            setTokens((prev) =>
              prev.map((t) =>
                t.netuid === subnet.netuid ? { ...t, balance: stake } : t
              )
            );
          }
        } catch (error) {
          console.error(error);
        }
      };

      loadBalances();
    }
  }, [subnets, selectedValidator]);

  const onBuy = (token: TokenForBulk) => {
    if (token.type === "buy") {
      token.type = "none";
      token.amount = 0;
    } else token.type = "buy";

    setTokens((prev) =>
      prev.map((t) => (t.netuid === token.netuid ? token : t))
    );
  };

  const onSell = (token: TokenForBulk) => {
    if (token.type === "sell") {
      token.type = "none";
      token.amount = 0;
    } else token.type = "sell";

    setTokens((prev) =>
      prev.map((t) => (t.netuid === token.netuid ? token : t))
    );
  };

  const onClear = () => {
    setTokens((prev) =>
      prev.map((token) => ({ ...token, type: "none", amount: 0, balance: "" }))
    );
  };

  return (
    <div className="flex justify-center gap-[4px] mt-[70px]">
      <TokenList tokens={tokens} onBuy={onBuy} onSell={onSell} />
      {/* <QuotePanel tokens={tokens} onClear={onClear} /> */}
    </div>
  );
}
