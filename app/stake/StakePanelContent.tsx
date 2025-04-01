"use client";

import { useState, useEffect } from "react";
import { Button } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import Confetti from "react-confetti";
import { TaoInput } from "../components/base";
import TransactionDetail from "../components/TransactionDetail";
import { PLANCK_PER_TAO } from "../utils/constants";
import { useWalletStore } from "../store";
import { useValidatorStake } from "../hooks";
export default function StakePanelContent({
  isStake,
  isProcessing,
  setIsProcessing,
}: {
  isStake: boolean;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}) {
  const { walletBalance, selectedValidator, stakeTx, unstakeTx } =
    useWalletStore();

  const { validatorStake } = useValidatorStake();

  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);

  const handleConfirm = async () => {
    if (!amount || isNaN(+amount)) return;
    if (+amount > (isStake ? +walletBalance : +validatorStake)) {
      return;
    }

    setIsProcessing(true);
    try {
      if (isStake) {
        await stakeTx(selectedValidator, +amount * PLANCK_PER_TAO);
      } else {
        await unstakeTx(selectedValidator, +amount * PLANCK_PER_TAO);
      }
      setSuccess(true);
      setAmount(""); // Clear amount after success

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {success && <Confetti numberOfPieces={250} recycle={false} />}

      <TaoInput
        value={amount}
        onChange={setAmount}
        subLabel={isStake ? "WALLET BALANCE" : "STAKED BALANCE"}
        balance={isStake ? walletBalance : validatorStake}
        token={{ symbol: "TAO", balance: "" }}
        size="lg"
      />

      <TransactionDetail amount={amount} />

      <Button
        disabled={
          isProcessing ||
          !amount ||
          isNaN(+amount) ||
          +amount <= 0 ||
          +amount > (isStake ? +walletBalance : +validatorStake)
        }
        onClick={handleConfirm}
        fullWidth
        size="md"
        mt="md"
        className="mt-6 font-mono tracking-wide"
        variant={success ? "light" : "filled"}
        color={success ? "gray" : "dark"}
        leftSection={success ? <IconCheck size={16} /> : null}
        loading={isProcessing}
      >
        {success
          ? "SUCCESS"
          : isProcessing
          ? "PROCESSING..."
          : !amount || +amount <= 0
          ? "ENTER AMOUNT"
          : "CONFIRM"}
      </Button>
    </>
  );
}
