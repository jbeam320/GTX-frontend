import { useState } from "react";
import { useWallet } from "../../hooks";
import { Loader } from "@mantine/core";

export function TaoInput({
  value,
  isStake = true,
  setValue,
  balance,
}: {
  value: string;
  isStake: boolean;
  setValue: (value: string) => void;
  balance: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const { loading_validatorStake } = useWallet();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setError(null);

    if (value.startsWith("-")) {
      setError("Tao amount cannot be negative");
      return;
    }

    if (value === "" || !isNaN(+value)) {
      setValue(value);

      if (value !== "" && +value > +balance) {
        setError("Insufficient balance");
      }
    }
  };

  return (
    <div>
      <div
        className={`mt-4 border rounded-lg px-4 py-3 flex justify-between items-center ${
          error ? "border-red-500" : ""
        }`}
      >
        <input
          type="number"
          value={value}
          onChange={handleChange}
          placeholder="0"
          min="0"
          step="any"
          className="text-2xl font-bold w-full bg-transparent outline-none"
        />
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-black" />
          <div>
            <div className="text-sm font-bold">TAO</div>
            <div className="text-xs text-gray-400 -mt-1">ROOT</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-xs text-red-500 mt-1 font-mono">{error}</div>
      )}

      <div className="text-xs mt-2 text-amber-700 tracking-widest font-mono">
        {isStake ? "WALLET BALANCE" : "STAKED BALANCE"}:
        <span className="ml-1">
          {loading_validatorStake ? "loading..." : balance}
        </span>
      </div>
    </div>
  );
}
