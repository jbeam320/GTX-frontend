import TokenInput from "../../ui/inputs/TokenInput";
import { Subnet } from "../../../lib/types";
import { useEffect, useState } from "react";
import { formatPrice } from "../../../lib/utils/format";

interface Token extends Subnet {
  balance: string;
  amount: number;
}

interface QuotePanelContentProps {
  mode: "Standard" | "Nuke";
  buys: Token[];
  sells: Token[];
  setSells: (sells: Token[]) => void;
}

export default function QuotePanelContent({
  mode,
  buys,
  sells,
  setSells,
}: QuotePanelContentProps) {
  const [taoToken, setTaoToken] = useState<Token | undefined>(undefined);

  useEffect(() => {
    let amount = 0;
    if (sells.length > 0) {
      for (const { amount: sellAmount, price } of sells) {
        amount += sellAmount * price;
      }
    }
    amount = +formatPrice(amount, null, 3);

    setTaoToken({
      ...sells[0],
      netuid: 0,
      symbol: "TAO",
      amount: amount,
      balance: amount.toString(),
    });
  }, [sells]);

  const handleChange = (index: number, amount: number) => {
    const updatedSells = [...sells];
    updatedSells[index].amount = amount;
    setSells(updatedSells);
  };

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
              onChange={handleChange}
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
    </div>
  );
}
