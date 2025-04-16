import TokenInput from "../../ui/inputs/TokenInput";
import { Subnet } from "../../../lib/types";
import { useEffect, useState } from "react";
import { formatPrice } from "../../../lib/utils/format";
import { DEFUALT_TOKEN } from "../../../lib/constants";
import TransactionDetail from "../../ui/cards/TransactionDetailForBulk";
import { ConfirmButton } from "../../ui/buttons";
import { useWalletStore } from "../../../stores/store";

interface Token extends Subnet {
  balance: string;
  amount: number;
}

interface QuotePanelContentProps {
  mode: "Standard" | "Nuke";
  buys: Token[];
  sells: Token[];
  setSells: (sells: Token[]) => void;
  setBuys: (sells: Token[]) => void;
}

export default function QuotePanelContent({
  mode,
  buys,
  sells,
  setBuys,
  setSells,
}: QuotePanelContentProps) {
  const { selectedValidator, batchSell, batchSellAndBuy } = useWalletStore();

  const [taoToken, setTaoToken] = useState<Token>(DEFUALT_TOKEN);
  const [totalBuyAmount, setTotalBuyAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let amount = 0;
    if (sells.length > 0) {
      for (const { amount: sellAmount, price } of sells) {
        amount += sellAmount * price;
      }
    }

    amount = +formatPrice(amount, null, 3);
    setTaoToken({
      ...taoToken,
      amount: amount,
      balance: amount.toString(),
    });
  }, [sells]);

  useEffect(() => {
    if (buys.length) {
      let amount = 0;
      for (const { amount: buyAmount, price } of buys) {
        amount += buyAmount * price;
      }

      amount = +formatPrice(amount, null, 3);
      setTotalBuyAmount(amount);
    }
  }, [buys]);

  const handleChange = (
    index: number,
    amount: number,
    type: "sell" | "buy"
  ) => {
    const updated = [...(type === "sell" ? sells : buys)];
    updated[index].amount = amount;
    type === "sell" ? setSells(updated) : setBuys(updated);
  };

  const handleConfirm = async () => {
    setIsProcessing(true);

    try {
      if (mode === "Nuke") {
        await batchSell(
          sells.map(({ netuid, amount }) => ({
            netuid,
            amount,
            validator: selectedValidator.hotkey,
          }))
        );
      } else if (mode === "Standard") {
        const txsInfos: {
          netuid: number;
          amount: number;
          type: "sell" | "buy";
          validator: string;
        }[] = [];

        for (const { amount, netuid } of sells) {
          txsInfos.push({
            netuid,
            amount,
            validator: selectedValidator.hotkey,
            type: "sell",
          });
        }

        for (const { amount, netuid } of buys) {
          txsInfos.push({
            netuid,
            amount: amount,
            validator: selectedValidator.hotkey,
            type: "buy",
          });
        }

        await batchSellAndBuy(txsInfos);
      }

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isDisabled =
    isProcessing ||
    sells.length === 0 ||
    (!buys.length && mode === "Standard") ||
    (!totalBuyAmount && mode === "Standard") ||
    (totalBuyAmount > taoToken.amount && mode === "Standard");

  return (
    <div className="w-[356px]">
      <div className="flex justify-between font-montserrat text-[11px] font-[500] pl-[26px] mb-[12px]">
        <label>You sell</label>
        <label>Amount</label>
      </div>

      {/* sells */}
      {sells.length > 0 && (
        <div className="flex flex-col gap-[4px]">
          {sells.map((token, index) => (
            <TokenInput
              key={token.netuid}
              token={token}
              index={index}
              onChange={(index, amount) => handleChange(index, amount, "sell")}
            />
          ))}
        </div>
      )}

      {/* received Tao */}
      <div className="flex justify-between items-center pl-[26px] my-[17px] font-montserrat text-[11px] font-[500]">
        <label>You Receive</label>
        <div className="flex gap-[12px] items-center">
          <button
            className="cursor-pointer rounded-[16px] border-[1px] bg-[var(--bg-light)] p-[10px] w-[67px] h-[24px] flex items-center justify-center"
            style={{ fontSize: "12px" }}
          >
            Split
          </button>
          <label>Amount</label>
        </div>
      </div>
      <TokenInput token={taoToken} disabled />

      <div className="flex justify-between items-center pl-[26px] my-[17px] font-montserrat text-[11px] font-[500]">
        <label>You buy</label>
        <label>Amount</label>
      </div>

      {/* buys */}
      {buys.length > 0 && mode === "Standard" && (
        <div className="flex flex-col gap-[4px]">
          {buys.map((token, index) => (
            <TokenInput
              key={token.netuid}
              token={token}
              index={index}
              errorIgnore={true}
              onChange={(index, amount) => handleChange(index, amount, "buy")}
            />
          ))}
        </div>
      )}

      <TransactionDetail />

      <ConfirmButton
        isProcessing={isProcessing}
        isSuccess={isSuccess}
        isDisabled={isDisabled}
        onClick={handleConfirm}
        disabledText={
          !buys.length && mode === "Standard"
            ? "Select tokens to buy"
            : "Confirm Transaction"
        }
        label="Confirm Transaction"
        style={{
          width: "337px",
          height: "60px",
          backgroundColor: isDisabled
            ? "var(--bg-dark-9)"
            : "var(--color-black)",
          border: "none",
          margin: "20px 0px 20px 10px",
          fontSize: "18px",
          fontWeight: 500,
          fontFamily: "Montserrat",
        }}
      />
    </div>
  );
}
