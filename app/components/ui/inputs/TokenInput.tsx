"use client";

import { useState } from "react";
import { Subnet } from "../../../lib/types";
import ArrowDown from "/public/icons/arrow-down-dark.svg";

interface Token extends Subnet {
  balance: string;
  amount: number;
}

interface TokenInputProps {
  token?: Token;
  index?: number;
  disabled?: boolean;
  errorIgnore?: boolean;
  onChange?: (index: number, amount: number) => void;
}

export default function TokenInput({
  token,
  index,
  disabled = false,
  errorIgnore = false,
  onChange,
}: TokenInputProps) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    if (!token) return;
    if (index === undefined) return;

    setError(null);

    const value = parseInt(e.target.value, 10);
    const { balance } = token;

    if (value < 0) {
      setError("Amount cannot be negative");
      return;
    }

    if (value || !isNaN(value)) {
      onChange(index, +value);
      if (balance && value !== 0 && value > +balance && !errorIgnore) {
        setError("Insufficient balance");
      }
    }
  };

  return (
    <div className="w-[356px] flex flex-col gap-[9px] rounded-[8px] bg-[var(--bg-dark-4)] px-[20px] pt-[9px] pb-[13px]">
      <div>
        <div
          className={`w-[316px] h-[52px]  font-montserrat rounded-[8px] bg-[var(--bg-light)] border-[1px] ${
            error ? "border-red-500" : "border-[var(--color-black)]"
          } flex justify-between p-[10px]`}
        >
          <div className="flex gap-[7px] items-center">
            <div
              className="w-[33px] h-[33px] rounded-full"
              style={{ background: "var(--gradient-primary-reverse)" }}
            />
            <label className="font-montserrat font-[500] text-[18px]">
              {token?.symbol}
            </label>
          </div>

          <input
            type="number"
            value={token?.amount ?? 0}
            placeholder="0"
            onChange={handleChange}
            className="w-full h-[29px] text-[24px] font-[600] outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            style={{
              fontFamily: "MontSerrat",
              fontWeight: 600,
              fontSize: "24px",
            }}
            disabled={disabled}
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>

      <div className="flex gap-[14px] items-center font-montserrat text-[12px] font-[500] text-[var(--color-dark-3)]">
        <label>Quote Details</label>
        <ArrowDown />
      </div>
    </div>
  );
}
