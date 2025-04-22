"use client";

import { useState } from "react";
import { useTaoPrice, useValidatorStake } from "../../../hooks";
import { useWalletStore } from "../../../stores/store";
import { ConfirmButton } from "../../ui/buttons";
import TransactionDetail from "../../ui/cards/TransactionDetail";
import { TaoInput } from "../../ui/inputs/TaoInput";

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
  const { taoPrice } = useTaoPrice();
  console.log(taoPrice);

  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);

  const handleConfirm = async () => {
    if (!amount || isNaN(+amount)) return;
    if (+amount > (isStake ? +walletBalance : +validatorStake)) {
      return;
    }

    setIsProcessing(true);
    try {
      const { hotkey } = selectedValidator;
      console.log(hotkey);
      if (isStake) {
        await stakeTx(+amount, hotkey, 0);
      } else {
        await unstakeTx(+amount, hotkey, 0);
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
        token={{ symbol: "TAO", balance: "", subnetName: "ROOT" }}
      />

      <TransactionDetail
        tokenAmount={amount}
        usdAmount={(+amount * taoPrice?.price).toFixed(2)}
        isShow={!isDisabled || isProcessing}
        style={{ marginTop: "40px", marginBottom: "24px" }}
      />

      <ConfirmButton
        isProcessing={isProcessing}
        isSuccess={success}
        isDisabled={isDisabled}
        onClick={handleConfirm}
        disabledText={
          !amount || +amount <= 0 ? "ENTER AMOUNT" : "INSUFFICIENT BALANCE"
        }
        style={{ width: "100%" }}
      />
    </>
  );
}
