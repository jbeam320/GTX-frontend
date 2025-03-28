"use client";

import { useState } from "react";
import { Button } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import Confetti from "react-confetti";
import { TaoInput } from "../components/base";
import { useWallet } from "../core/wallet";
import TransactionDetail from "../components/TransactionDetail";

export default function StakePanelContent({ label }: { label: string }) {
  const { walletBalance } = useWallet();

  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);

  const handleConfirm = () => {
    if (!amount || isNaN(+amount)) return;
    if (+amount > +walletBalance) {
      return;
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <>
      {success && <Confetti numberOfPieces={250} recycle={false} />}

      <TaoInput value={amount} setValue={setAmount} label={label} />

      <TransactionDetail amount={amount} />

      <Button
        disabled={
          !amount || isNaN(+amount) || +amount <= 0 || +amount > +walletBalance
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
    </>
  );
}
