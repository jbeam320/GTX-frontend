"use client";

import { useState, useEffect } from "react";
import { TaoInput } from "../components/base";
import { ConfirmButton } from "../components/base/ConfirmButton";
import TransactionDetail from "../components/complex/TransactionDetail";
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

  const isDisabled =
    isProcessing ||
    !amount ||
    isNaN(+amount) ||
    +amount <= 0 ||
    +amount > (isStake ? +walletBalance : +validatorStake);

  return (
    <>
      <TaoInput
        value={amount}
        onChange={setAmount}
        subLabel={isStake ? "WALLET BALANCE" : "STAKED BALANCE"}
        balance={isStake ? walletBalance : validatorStake}
        token={{ symbol: "TAO", balance: "" }}
        size="lg"
      />

      <TransactionDetail amount={amount} />

      <ConfirmButton
        isProcessing={isProcessing}
        isSuccess={success}
        isDisabled={isDisabled}
        onClick={handleConfirm}
        disabledText={
          !amount || +amount <= 0 ? "ENTER AMOUNT" : "INSUFFICIENT BALANCE"
        }
      />
    </>
  );
}
