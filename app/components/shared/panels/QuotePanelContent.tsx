import { useEffect, useMemo, useState } from "react";
import { DEFUALT_TOKEN } from "../../../lib/constants";
import { TokenForBulk } from "../../../lib/types";
import { formatPrice } from "../../../lib/utils/format";
import { useWalletStore } from "../../../stores/store";
import { ConfirmButton } from "../../ui/buttons";
import TransactionDetail from "../../ui/cards/TransactionDetailForBulk";
import TokenInput from "../../ui/inputs/TokenInput";

interface QuotePanelContentProps {
  mode: "Standard" | "Nuke";
  tokens: TokenForBulk[];
  errors: { [key: number]: string };
  setTokens: (tokens: TokenForBulk[]) => void;
  setErrors: (errors: { [key: number]: string }) => void;
}

export default function QuotePanelContent({
  mode,
  tokens,
  errors = {},
  setTokens,
  setErrors,
}: QuotePanelContentProps) {
  const { selectedValidator, batchSell, batchSellAndBuy } = useWalletStore();

  const [taoToken, setTaoToken] = useState<TokenForBulk>(DEFUALT_TOKEN);
  const [totalBuyAmount, setTotalBuyAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (mode === "Nuke" && tokens?.length) {
      const newTokens = tokens.map((token) =>
        +token.balance
          ? { ...token, amount: +token.balance, type: "sell" as const }
          : { ...token, type: "none" as const }
      );

      setTokens(newTokens);
    }
  }, [mode]);

  useEffect(() => {
    let sellAmount = 0;
    let buyAmount = 0;

    if (tokens.length > 0) {
      for (const { amount, price, type } of tokens) {
        if (type === "sell") {
          sellAmount += amount * price;
        }
        if (type === "buy") {
          buyAmount += amount * price;
        }
      }

      sellAmount = +formatPrice(sellAmount, null, 3);
      buyAmount = +formatPrice(buyAmount, null, 3);

      setTaoToken({
        ...taoToken,
        amount: sellAmount,
        balance: sellAmount.toString(),
      });
      setTotalBuyAmount(buyAmount);
    }
  }, [tokens]);

  const handleChange = (token: TokenForBulk, amount: number) => {
    setTokens(
      tokens.map((t) =>
        t.netuid === token.netuid ? { ...token, amount: amount * 1e9 } : t
      )
    );
  };

  const handleConfirm = async () => {
    setIsProcessing(true);

    try {
      if (!buys.length || !totalBuyAmount) {
        const txsInfos = [];

        for (const { netuid, amount } of sells) {
          if (amount)
            txsInfos.push({
              netuid,
              amount,
              validator: selectedValidator.hotkey,
            });
        }

        await batchSell(txsInfos);
      } else {
        const txsInfos: {
          netuid: number;
          amount: number;
          type: "sell" | "buy";
          validator: string;
        }[] = [];

        for (const { amount, netuid } of sells) {
          if (amount)
            txsInfos.push({
              netuid,
              amount,
              validator: selectedValidator.hotkey,
              type: "sell",
            });
        }

        for (const { amount, netuid, price } of buys) {
          if (amount)
            txsInfos.push({
              netuid,
              amount: (amount * price) / 1e9,
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

  const sells = useMemo(
    () => tokens.filter(({ type }) => type === "sell"),
    [tokens]
  );

  const buys = useMemo(
    () => tokens.filter(({ type }) => type === "buy"),
    [tokens]
  );

  const isDisabled =
    isProcessing ||
    Object.values(errors).join("").trim() !== "" ||
    sells.length === 0 ||
    taoToken.amount === 0 ||
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
              disabled={mode === "Nuke"}
              defaultValue={
                mode === "Nuke" ? formatPrice(token.amount, null, 2) : ""
              }
              token={token}
              errorHandle={(error) => {
                setErrors({ ...errors, [token.netuid]: error });
              }}
              onChange={(amount) => handleChange(token, amount)}
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

      <TokenInput
        token={taoToken}
        disabled
        value={formatPrice(taoToken.amount, null, 2)}
      />

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
              showTaoAmount={true}
              errorIgnore={true}
              onChange={(amount) => handleChange(token, amount)}
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
        disabledText={"Confirm Transaction"}
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
