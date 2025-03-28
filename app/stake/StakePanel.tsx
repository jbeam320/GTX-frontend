"use client";

import { useState } from "react";
import { Button, Collapse } from "@mantine/core";
import { motion } from "framer-motion";
import { IconCheck, IconChevronUp, IconChevronDown } from "@tabler/icons-react";
import Confetti from "react-confetti";
import TaoInput from "../components/base/TaoInput";
import { useWallet } from "../core/wallet";
import TransactionDetail from "../components/TransactionDetail";
export default function StakePanel({
  onToggle,
  showValidators,
}: {
  onToggle: () => void;
  showValidators: boolean;
}) {
  const { walletBalance } = useWallet();

  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"stake" | "unstake">("stake");
  const [success, setSuccess] = useState(false);

  const handleConfirm = () => {
    if (!amount || isNaN(+amount)) return;
    if (+amount > walletBalance.valueOf()) {
      return;
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <motion.div className="relative bg-white rounded-xl border shadow-lg px-6 pt-12 pb-8 w-full max-w-md">
      {success && <Confetti numberOfPieces={250} recycle={false} />}

      {/* Stake / Unstake toggle */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center">
        <div className="bg-gray-100 rounded-full overflow-hidden flex shadow">
          <button
            onClick={() => setMode("stake")}
            className={`px-6 py-1 rounded-full transition-all ${
              mode === "stake" ? "bg-black text-white" : "text-gray-500"
            }`}
          >
            STAKE
          </button>
          <button
            onClick={() => setMode("unstake")}
            className={`px-6 py-1 rounded-full transition-all ${
              mode === "unstake" ? "bg-black text-white" : "text-gray-500"
            }`}
          >
            UNSTAKE
          </button>
        </div>
      </div>

      <TaoInput value={amount} setValue={setAmount} />
      <TransactionDetail amount={amount} />

      {/* Confirm button */}
      <Button
        disabled={
          !amount ||
          isNaN(+amount) ||
          +amount <= 0 ||
          +amount > walletBalance.valueOf()
        }
        onClick={handleConfirm}
        fullWidth
        size="md"
        mt="md"
        className="mt-6 font-mono tracking-wide"
        variant={success ? "light" : "filled"}
        color={success ? "gray" : "dark"}
        leftSection={success ? <IconCheck size={16} /> : null}
      >
        {success
          ? "SUCCESS"
          : !amount || +amount <= 0
          ? "ENTER AMOUNT"
          : "CONFIRM"}
      </Button>

      {/* View Validators button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={onToggle}
          className="border-2 border-yellow-400 text-yellow-500 text-sm px-5 py-2 rounded-full font-mono flex items-center gap-2 -mb-12 bg-white shadow-sm"
        >
          📋 {showValidators ? "Close Validators" : "View Validators"}
        </button>
      </div>
    </motion.div>
  );
}
