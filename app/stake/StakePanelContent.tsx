"use client";

import { useState } from "react";
import { Button } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import Confetti from "react-confetti";
import { TaoInput } from "../components/base";
import { useWallet } from "../core/wallet";
import TransactionDetail from "../components/TransactionDetail";
import { PLANCK_PER_TAO } from "../utils/constants";

export default function StakePanelContent({ isStake }: { isStake: boolean }) {
  const { walletBalance, stakedBalance, stakeTx, unstakeTx } = useWallet();

  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);

  const handleConfirm = async () => {
    if (!amount || isNaN(+amount)) return;
    if (+amount > (isStake ? +walletBalance : +stakedBalance)) {
      return;
    }

    try {
      const validator = "5FCPTnjevGqAuTttetBy4a24Ej3pH9fiQ8fmvP1ZkrVsLUoT";

      if (isStake) {
        await stakeTx(validator, +amount * PLANCK_PER_TAO);
      } else {
        await unstakeTx(validator, +amount * PLANCK_PER_TAO);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {success && <Confetti numberOfPieces={250} recycle={false} />}

      <TaoInput value={amount} setValue={setAmount} isStake={isStake} />

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
