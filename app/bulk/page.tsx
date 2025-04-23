"use client";

import { useState } from "react";
import TokenList from "../components/shared/lists/TokenList";
import { QuotePanel } from "../components/shared/panels";
import { useTokens } from "../hooks";
import { TokenForBulk } from "../lib/types";

const MOBILE_TOKEN_COLUMNS = ["Price", "Reserve", "Balance", "Trade"];

export default function Bulk() {
  const { tokens, loading, setTokens } = useTokens();

  const [mode, setMode] = useState<"Standard" | "Nuke">("Standard");

  // for mobile view
  const [viewMode, setViewMode] = useState<"Tokens" | "Quote">("Tokens");
  const [selectedMobileColumn, setSelectedMobileColumn] =
    useState<string>("Balance");

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
    <div className="max-md:px-[25px] flex flex-col md:flex-row max-md:items-center md:justify-center gap-[4px] mt-[70px] relative min-h-screen pb-[76px]">
      <div className="md:hidden text-[30px] w-full text-left font-montserrat font-[600] mt-[44px]">
        Batch
      </div>

      {viewMode === "Tokens" && (
        <div className="md:hidden my-[14px] p-[5px] mx-[11px] rounded-[5px] justify-center flex gap-[20px] jsutify-center items-center border-[1px] border-[var(--border-black)]">
          {MOBILE_TOKEN_COLUMNS.map((column) => (
            <div
              key={column}
              className={`cursor-pointer flex items-center justify-center rounded-[4px] h-[30px] w-[72px] text-[13px] font-inter font-[500] ${
                selectedMobileColumn === column
                  ? "text-white bg-[var(--color-black)]"
                  : "text-[var(--color-dark-100)] bg-[var(--bg-light)]"
              }`}
              onClick={() => setSelectedMobileColumn(column)}
            >
              {column}
            </div>
          ))}
        </div>
      )}

      <TokenList
        tokens={tokens}
        loading={loading}
        onBuy={onBuy}
        onSell={onSell}
        disabled={mode === "Nuke" ? true : false}
        selectedMobileColumn={selectedMobileColumn}
        viewForMobile={viewMode === "Tokens"}
      />

      <QuotePanel
        tokens={tokens}
        onClear={onClear}
        setTokens={setTokens}
        viewForMobile={viewMode === "Quote"}
        onToggle={(mode) => setMode(mode)}
      />

      <div className="md:hidden fixed bottom-0 left-0 right-0 flex h-[76px] items-center justify-center gap-[145px] bg-[var(--color-black)]">
        <button
          className={
            viewMode === "Tokens" ? "text-white" : "text-[var(--color-dark)]"
          }
          style={{
            fontFamily: "Montserrat",
            fontSize: "16px",
            fontWeight: "600",
          }}
          onClick={() => setViewMode("Tokens")}
        >
          Tokens
        </button>

        <button
          className={
            viewMode === "Quote" ? "text-white" : "text-[var(--color-dark)]"
          }
          style={{
            fontFamily: "Montserrat",
            fontSize: "16px",
            fontWeight: "600",
          }}
          onClick={() => setViewMode("Quote")}
        >
          Quote
        </button>
      </div>
    </div>
  );
}
