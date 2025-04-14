"use client";

import React, { useState } from "react";
import { Subnet } from "../../../lib/types";
import TokenListItem from "../items/TokenListItem";

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
      <div className="relative">
        <input
          type="text"
          placeholder="Search tokens..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
          className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
        />
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
