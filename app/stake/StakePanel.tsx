"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StakePanelContent from "./StakePanelContent";

export default function StakePanel({
  onToggle,
  showValidators,
}: {
  onToggle: () => void;
  showValidators: boolean;
}) {
  const [mode, setMode] = useState<"stake" | "unstake">("stake");

  return (
    <div className="relative bg-white rounded-xl border shadow-lg px-6 pt-12 pb-8 w-full max-w-md">
      {/* Stake / Unstake toggle */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center">
        <div className="bg-gray-100 rounded-full overflow-hidden flex shadow">
          <button
            onClick={() => setMode("stake")}
            className={`px-10 py-2.5 rounded-full transition-all duration-300 text-sm font-medium ${
              mode === "stake"
                ? "bg-black text-white"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            STAKE
          </button>
          <button
            onClick={() => setMode("unstake")}
            className={`px-10 py-2.5 rounded-full transition-all duration-300 text-sm font-medium ${
              mode === "unstake"
                ? "bg-black text-white"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            UNSTAKE
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {mode === "stake" && <StakePanelContent label="WALLET BALANCE" />}
          {mode === "unstake" && <StakePanelContent label="STAKED BALANCE" />}
        </motion.div>
      </AnimatePresence>

      {/* View Validators button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={onToggle}
          className="border-2 border-yellow-400 text-yellow-500 text-sm px-5 py-2 rounded-full font-mono flex items-center gap-2 -mb-12 bg-white shadow-sm"
        >
          📋 {showValidators ? "Close Validators" : "View Validators"}
        </button>
      </div>
    </div>
  );
}
