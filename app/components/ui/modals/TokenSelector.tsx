"use client";

import { useMemo, useState } from "react";
import { TokenForBulk } from "../../../lib/types";
import SearchIcon from "/public/icons/search-dark.svg";
import CloseIcon from "/public/icons/close-black.svg";
import { ContainerCard } from "../cards";
import { Loader } from "@mantine/core";

interface TokensSelectorProps {
  tokens: TokenForBulk[];
  loading?: boolean;
  disabled?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onBuy: (token: TokenForBulk) => void;
  onSell: (token: TokenForBulk) => void;
}

export default function TokenSelector({
  tokens,
  loading = false,
  disabled = false,
  isOpen,
  onClose,
  onBuy,
  onSell,
}: TokensSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = useMemo(
    () =>
      tokens.filter((token) =>
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [tokens, searchQuery]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-[51] bg-[var(--bg-light)] rounded-[16px] p-[20px] flex flex-col gap-[22px] max-[421px]:mx-[5px] max-[421px]:w-full w-[421px] mt-[30px] mb-[20px]">
        {/* header */}
        <div className="flex justify-between items-center">
          <h2 className="text-[20px] font-[500] font-montserrat">
            Choose a token
          </h2>
          <button className="cursor-pointer" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* search tokens */}
        <div className="w-full h-[40px] rounded-[16px] px-[23px] py-[10px] gap-[12px] flex items-center justify-center bg-[var(--bg-dark-6)] border-[1px] border-[var(--border-dark-1)]">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search a token"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="w-full h-[17px] text-[var(--color-dark-4)] text-[14px] font-montserrat font-[500] border-none outline-none bg-transparent"
          />
        </div>

        {/* tokens */}
        <div className="space-y-[4px] max-h-[calc(100vh-200px)] overflow-y-auto text-center">
          {loading ? (
            <Loader />
          ) : filteredTokens.length ? (
            filteredTokens.map((token, index) => (
              <ContainerCard
                key={index}
                firstChild={
                  <div className="flex flex-col gap-[6px]">
                    <span className="text-left text-[15px] font-[600] font-montserrat">
                      {token.symbol}
                    </span>
                    <span className="text-left text-[12px] font-[500] font-montserrat">
                      {token.symbol}
                    </span>
                  </div>
                }
                secondChild={
                  <div className="flex gap-[6px]">
                    <button
                      disabled={disabled}
                      onClick={() => onBuy(token)}
                      className={`h-[37px] rounded-[16px] bg-[var(--bg-light)] border-[1px] border-[var(--color-black)] text-[14px] font-medium cursor-pointer ${
                        token.type === "buy" ? "w-[185px]" : "w-[83px]"
                      } ${token.type === "sell" && "hidden"}`}
                    >
                      Buy
                    </button>
                    <button
                      disabled={disabled}
                      onClick={() => onSell(token)}
                      className={`h-[37px] rounded-[16px] bg-[var(--bg-dark-2)] border-[1px] border-[var(--color-black)] text-[14px] font-medium cursor-pointer ${
                        token.type === "sell" ? "w-[185px]" : "w-[83px]"
                      } ${token.type === "buy" && "hidden"}`}
                    >
                      Sell
                    </button>
                  </div>
                }
              />
            ))
          ) : (
            <h1 className="font-[600] font-montserrat text-[20px]">
              No Token data
            </h1>
          )}
        </div>
      </div>
    </div>
  );
}
