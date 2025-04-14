"use client";

import React, { useState } from "react";
import { Subnet } from "../../../lib/types";
import TokenListItem from "../items/TokenListItem";
import SearchIcon from "/public/icons/search-dark.svg";

interface TokenListProps {
  tokens: Subnet[];
  onBuy?: (token: Subnet) => void;
  onSell?: (token: Subnet) => void;
}

export default function TokenList({ tokens, onBuy, onSell }: TokenListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = tokens.filter((token) =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[833px] h-[1025px] overflow-hidden bg-[var(--bg-light)] border-[1px] border-[var(--border-dark)] rounded-[8px] p-[5px]">
      <div className="flex justify-between items-center mx-[15px] p-[12px] border-b-[1px] border-[var(--color-black)]">
        <label className="font-montserrat text-[17px] font-[600]">Tokens</label>
        <div className="w-[207px] h-[37px] rounded-[16px] p-[10px] gap-[13px] flex items-center justify-center bg-[var(--bg-dark-4)] rounded-[16px]">
          <SearchIcon />
          <input type="text"
            placeholder="Search tokens"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="w-[101px] h-[17px] text-[var(--color-dark-1)] text-[14px] font-[500] border-none outline-none"
          />
        </div>
      </div>

      {/* header */}
      <div className="mx-[15px] my-[21px] px-[34px] flex space-between items-center text-[var(--color-black)] font-montserrat text-[14px] font-[500]">
        <label className="basis-[150px]">Names</label>
        <label className="basis-[110px]">Price(USDC)</label>
        <label className="basis-[200px]">Market Cap(USDC)</label>
        <label className="basis-[200px]">Balance</label>
        <label>Trade</label>
      </div>

      <div className="space-y-[1px]">
        {filteredTokens.map((token, index) => (
          <TokenListItem
            key={`${token.symbol}-${token.netuid}`}
            token={token}
            onBuy={() => onBuy?.(token)}
            onSell={() => onSell?.(token)}
            style={{
              background:
                index % 2 === 0 ? "var(--bg-dark-4)" : "var(--bg-light-2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
