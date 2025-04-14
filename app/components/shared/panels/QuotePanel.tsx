import { useState } from "react";
import { Subnet } from "../../../lib/types";

interface Token extends Subnet {
  balance: string;
}

interface QuotePanelProps {
  buys: Token[];
  sells: Token[];
  onClear: () => void;
}

export default function QuotePanel({ buys, sells, onClear }: QuotePanelProps) {
  const [mode, setMode] = useState<"Standard" | "Nuke">("Standard");

  return (
    <div className="flex flex-col gap-[28px] w-[383px] min-h-[700px] rounded-[8px] border-[1px] border-[var(--border-dark)] font-montserrat p-[13px] font-[500]">
      <div className="flex items-center justify-center relative">
        <label className="text-[18px] font-[500]">Quote</label>
        <button
          className="cursor-pointer w-[67px] h-[25px] rounded-[16px] text-[12px] absolute right-0 border-[1px] p-[10px] text-center flex items-center justify-center"
          onClick={onClear}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
