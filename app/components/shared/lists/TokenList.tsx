"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Subnet } from "../../../lib/types";
import TokenListItem from "../items/TokenListItem";
import SearchIcon from "/public/icons/search-dark.svg";
import { useWalletStore } from "../../../stores/store";

interface Token extends Subnet {
  balance: string;
}

interface TokenListProps {
  tokens: Subnet[];
}

export default function TokenList({ tokens }: TokenListProps) {
  const { getValidatorStake, selectedValidator } = useWalletStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [tokenInfos, setTokenInfos] = useState<Token[]>([]);
  const [buys, setBuys] = useState<Token[]>([]);
  const [sells, setSells] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  useEffect(() => {
    if (tokens.length) {
      setTokenInfos(tokens.map(token => ({ ...token, balance: '0' })));

      const loadBalances = async () => {
        try {
          for (const token of tokens) {
            const stake = await getValidatorStake(selectedValidator.hotkey, token.netuid);
            setTokenInfos(prev => prev.map(t =>
              t.netuid === token.netuid ? { ...t, balance: stake } : t
            ));
          }
        } catch (error) {
          console.error(error);
        }
      }

      loadBalances();
    }
  }, [tokens, selectedValidator]);

  const onBuy = (token: Token, mode: "add" | "delete") => {
    if (mode === "delete") {
      setBuys(prev => prev.filter(t => t.netuid !== token.netuid));
      if (selectedToken?.netuid === token.netuid) {
        setSelectedToken(null);
      }

      return;
    }

    setSelectedToken(token);
    setBuys(prev => [...prev, token]);
  }

  const onSell = (token: Token, mode: "add" | "delete") => {
    if (mode === "delete") {
      setSells(prev => prev.filter(t => t.netuid !== token.netuid));
      if (selectedToken?.netuid === token.netuid) {
        setSelectedToken(null);
      }

      return;
    }

    setSelectedToken(token);
    setSells(prev => [...prev, token]);
  }

  const filteredTokens = useMemo(() => tokenInfos.filter((token) =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  ), [tokenInfos, searchQuery]);

  return (
    <div className="w-[833px] h-[1025px] overflow-hidden bg-[var(--bg-light)] border-[1px] border-[var(--border-dark)] rounded-[8px] p-[5px]">
      {/* search tokens */}
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
            onBuy={(mode) => onBuy(token, mode)}
            onSell={(mode) => onSell(token, mode)}
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
