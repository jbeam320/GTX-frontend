"use client";

import { useState } from "react";
import TokenList from "../components/shared/lists/TokenList";
import { QuotePanel } from "../components/shared/panels";
import { useTokens } from "../hooks";
import { TokenForBulk } from "../lib/types";

export default function Bulk() {
  const { tokens, loading, setTokens } = useTokens();
  const [mode, setMode] = useState<"Standard" | "Nuke">("Standard");

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
        loading={loading}
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
