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
  const [mode, setMode] = useState<"Standard" | "Nuke">("Standard");

  useEffect(() => {
    if (subnets.length && selectedValidator.hotkey) {
      const loadBalances = async () => {
        try {
          const balances = await Promise.all(
            subnets.map(
              async (subnet) =>
                await getValidatorStake(selectedValidator.hotkey, subnet.netuid)
            )
          );

          const tokens = subnets.map((subnet, index) => ({
            ...subnet,
            balance: balances[index],
            amount: 0,
            type: "none" as "none" | "sell" | "buy",
          }));

          setTokens(tokens);
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
      prev.map((token) => ({ ...token, type: "none", amount: 0 }))
    );
  };

  return (
    <div className="flex justify-center gap-[4px] mt-[70px]">
      <TokenList
        tokens={tokens}
        onBuy={onBuy}
        onSell={onSell}
        disabled={mode === "Nuke" ? true : false}
      />
      <QuotePanel
        tokens={tokens}
        onClear={onClear}
        setTokens={setTokens}
        onToggle={(mode) => setMode(mode)}
      />
    </div>
  );
}
