"use client";

import { useState } from "react";
import TokenInput from "./TokenInput";
import SubnetSelector from "./SubnetSelector";
import SwapToggle from "./SwapToggle";
import ChartDrawer from "./ChartDrawer";
import ConfirmPanel from "./ConfirmPanel";
import { motion } from "framer-motion"; // For animations
import { SUBNETS } from "../../utils/data";
import { Token } from "../../utils/types";
import { TaoInput } from "../base";

const SwapPanel = () => {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState("0");
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const [isSelectingFrom, setSelectingFrom] = useState(true);
  const [isChartVisible, setChartVisible] = useState(false);

  const handleSubnetClick = (isFrom: boolean) => {
    setSelectingFrom(isFrom);
    setSelectorOpen(true);
  };

  const handleSelect = (token: Token) => {
    if (isSelectingFrom) setFromToken(token);
    else setToToken(token);
    setSelectorOpen(false);
  };

  const handleSwapToggle = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handlePercentageClick = (percentage: number) => {
    if (!fromToken?.balance) return;
    const maxAmount = parseFloat(fromToken.balance);
    const newAmount = (maxAmount * percentage) / 100;
    setAmount(newAmount.toString());
  };

  return (
    <div className="relative w-[360px] bg-white rounded-xl shadow-lg p-6">
      <div className="space-y-4">
        {/* Swap Button (Overflowing at the top) */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center">
          <button className="w-40 py-2 bg-black text-white text-sm rounded-full shadow-xl">
            SWAP
          </button>
        </div>

        <TaoInput
          size="lg"
          label="FROM"
          token={fromToken}
          value={amount}
          isSelectable
          onClick={() => handleSubnetClick(true)}
          onChange={setAmount}
        />

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={handleSwapToggle}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            ↑↓
          </button>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handlePercentageClick(25)}
              className="px-4 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm"
            >
              25%
            </button>
            <button
              onClick={() => handlePercentageClick(50)}
              className="px-4 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm"
            >
              50%
            </button>
            <button
              onClick={() => handlePercentageClick(100)}
              className="px-4 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm"
            >
              MAX
            </button>
          </div>
        </div>

        <TaoInput
          size="lg"
          label="TO"
          token={toToken}
          value={amount}
          isSelectable
          onClick={() => handleSubnetClick(false)}
          onChange={setAmount}
        />
      </div>

      {/* View Chart button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setChartVisible(!isChartVisible)}
          className="border-2 border-yellow-400 text-yellow-500 text-sm px-5 py-2 rounded-full font-mono flex items-center gap-2 -mb-12 bg-white shadow-sm"
        >
          📈 VIEW CHART
        </button>
      </div>

      {isSelectorOpen && (
        <SubnetSelector
          onSelect={handleSelect}
          onClose={() => setSelectorOpen(false)}
        />
      )}

      {isChartVisible && (
        <ChartDrawer
          fromToken={fromToken}
          toToken={toToken}
          onClose={() => setChartVisible(false)}
        />
      )}
    </div>
  );
};

export default SwapPanel;
