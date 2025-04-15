import TokenInput from "../../ui/inputs/TokenInput";
import { Subnet } from "../../../lib/types";

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
    </div>
  );
}
