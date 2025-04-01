import { Token } from "../../utils/types";

interface TokenInputProps {
  label: string;
  token: Token | null;
  amount: string;
  onClick: () => void;
  onAmountChange: (value: string) => void;
}

export default function TokenInput({
  label,
  token,
  amount,
  onClick,
  onAmountChange,
}: TokenInputProps) {
  return (
    <div className="mt-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="flex items-center border rounded px-3 py-2 mt-2 relative">
        <input
          type="number"
          className="flex-1 outline-none bg-transparent text-lg"
          placeholder="0"
          value={amount}
          onChange={(e) => onAmountChange?.(e.target.value)}
        />
        <button onClick={onClick} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-400" />
          <span>{token?.symbol || "SELECT"}</span>
          <span>▼</span>
        </button>
        {/* Balance label overflow with custom color */}
        <div className="absolute text-xs text-green-500 right-2 bottom-2">
          {token?.balance ?? "0.00"}
        </div>
      </div>
    </div>
  );
}
