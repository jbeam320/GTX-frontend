"use client";

import { Loader } from "@mantine/core";
import React, { useMemo, useState } from "react";
import { TokenForBulk } from "../../../lib/types";
import TokenListItem from "../items/TokenListItem";
import SearchIcon from "/public/icons/search-dark.svg";

interface TokenListProps {
  tokens: TokenForBulk[];
  disabled?: boolean;
  loading?: boolean;
  viewForMobile?: boolean;
  selectedMobileColumn?: string;
  onBuy: (token: TokenForBulk) => void;
  onSell: (token: TokenForBulk) => void;
}

export default function TokenList({
  tokens,
  disabled = false,
  loading = false,
  viewForMobile,
  selectedMobileColumn,
  onBuy,
  onSell,
}: TokenListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = useMemo(
    () =>
      tokens.filter((token) =>
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [tokens, searchQuery]
  );

  return (
    <div
      className={`${
        viewForMobile ? "max-md:w-full" : "max-md:hidden"
      } w-[840px] bg-[var(--bg-light)] md:border-[1px] border-[var(--border-dark)] rounded-[8px] p-[5px]`}
    >
      {/* search tokens */}
      <div className="flex justify-between items-center md:mx-[15px] md:p-[12px] pb-[26px] md:border-b-[1px] border-[var(--color-black)]">
        <label className="font-montserrat text-[17px] font-[600]">Tokens</label>
        <div className="w-[207px] h-[37px] rounded-[16px] p-[10px] gap-[13px] flex items-center justify-center bg-[var(--bg-dark-4)] rounded-[16px]">
          <SearchIcon />
          <input
            type="text"
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
      <div className="md:mx-[15px] max-md:mb-[21px] md:my-[21px] md:px-[34px] max-md:pb-[10px] max-md:border-b-[1px] border-[var(--color-black)] flex space-between items-center text-[var(--color-black)] font-montserrat text-[14px] font-[500]">
        <label className="max-md:flex-2 md:basis-[180px]">Names</label>
        <label className="flex-1 md:hidden">{selectedMobileColumn}</label>
        <label className="max-md:hidden basis-[110px]">Price(USDC)</label>
        <label className="max-md:hidden basis-[170px]">Market Cap(USDC)</label>
        <label className="max-md:hidden basis-[200px]">Balance</label>
        <label className="max-md:hidden">Trade</label>
      </div>

      <div className="space-y-[4px] md:space-y-[1px] h-[800px] overflow-y-auto text-center">
        {loading ? (
          <Loader />
        ) : filteredTokens.length ? (
          filteredTokens.map((token, index) => (
            <TokenListItem
              selectedMobileColumn={selectedMobileColumn}
              key={`${token.symbol}-${token.netuid}`}
              token={token}
              disabled={disabled}
              onBuy={onBuy}
              onSell={onSell}
              style={{
                background:
                  index % 2 === 0 ? "var(--bg-dark-4)" : "var(--bg-light-2)",
              }}
            />
          ))
        ) : (
          <h1 className="font-[600] font-montserrat text-[20px]">
            No Token data
          </h1>
        )}
      </div>
    </div>
  );
}
