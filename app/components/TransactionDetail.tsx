import { Collapse } from "@mantine/core";
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react";
import { useSubnets } from "../hooks";
import { useState } from "react";
import { taoPrice } from "../utils/data";

export default function TransactionDetail({ amount }: { amount: string }) {
  //   const { taoPrice } = useSubnets();

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="text-center text-sm mt-6 font-mono">
      <div className="mb-2 text-gray-600 tracking-wider">
        TRANSACTION DETAILS
      </div>
      <div className="flex items-center gap-3 relative px-4">
        <div className="flex-1 tracking-wider">
          {amount || 0} TAO (${(+amount * (taoPrice?.price ?? 0)).toFixed(2)}{" "}
          USD)
          <span className="text-xs bg-yellow-100 text-black px-2 rounded tracking-wider ml-2">
            +45.04%
          </span>
        </div>
        <button
          style={{ cursor: "pointer" }}
          onClick={() => setExpanded(!expanded)}
          className="absolute right-0"
        >
          {expanded ? (
            <IconChevronUp size={14} />
          ) : (
            <IconChevronDown size={14} />
          )}
        </button>
      </div>

      <Collapse in={expanded}>
        <div className="mt-4 text-left text-xs space-y-2">
          <div className="flex justify-between tracking-wider">
            <span>FEE</span>
            <span className="italic text-gray-600">0.00005</span>
          </div>
          <div className="flex justify-between tracking-wider">
            <span>PRICE IMPACT</span>
            <span>0.08%</span>
          </div>
          <div className="flex justify-between tracking-wider">
            <span>SLIPPAGE TOLERANCE</span>
            <span>0.99%</span>
          </div>
        </div>
      </Collapse>
    </div>
  );
}
