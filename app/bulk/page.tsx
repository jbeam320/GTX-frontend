"use client";

import TokenList from "../components/shared/lists/TokenList";
import { subnets } from "../lib/data";
import { useState, useEffect } from "react";
import { Subnet } from "../lib/types";
import { QuotePanel } from "../components/shared/panels";
import { useWalletStore } from "../stores/store";

interface Token extends Subnet {
  balance: string;
  amount: number;
}

export default function Bulk() {
  const { getValidatorStake, selectedValidator } = useWalletStore();

  const [tokens, setTokens] = useState<Token[]>([]);
  const [buys, setBuys] = useState<Token[]>([]);
  const [sells, setSells] = useState<Token[]>([]);
  const [isClear, setIsClear] = useState(true);

  useEffect(() => {
    if (subnets.length) {
      setTokens(
        subnets.map((subnet) => ({ ...subnet, balance: "0", amount: 0 }))
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

  const onBuy = (token: Token, mode: "add" | "delete") => {
    if (mode === "delete") {
      setBuys((prev) => prev.filter((t) => t.netuid !== token.netuid));
      token.amount = 0;
      return;
    }

    setIsClear(false);
    setBuys((prev) => [...prev, token]);
  };

  const onSell = (token: Token, mode: "add" | "delete") => {
    if (mode === "delete") {
      setSells((prev) => prev.filter((t) => t.netuid !== token.netuid));
      token.amount = 0;

      return;
    }

    setIsClear(false);
    setSells((prev) => [...prev, token]);
  };

  const onClear = () => {
    setBuys([]);
    setSells([]);
    setIsClear(true);
  };

  return (
    <div className="flex justify-center gap-[4px] mt-[70px]">
      <TokenList
        tokens={tokens}
        isClear={isClear}
        onBuy={onBuy}
        onSell={onSell}
      />
      <QuotePanel
        buys={buys}
        sells={sells}
        onClear={onClear}
        setSells={setSells}
        setBuys={setBuys}
      />
    </div>
  );
}
