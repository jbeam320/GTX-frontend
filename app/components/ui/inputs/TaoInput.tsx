import { useState } from "react";
import DrowDownIcon from "/public/icons/arrow-down.svg";

interface Token {
  symbol: string;
  balance: string;
  subnetName: string;
}

interface TaoInputProps {
  value: string;
  onChange?: (value: string) => void;
  onClick?: () => void;
  token?: Token | null;
  label?: string;
  subLabel?: string;
  isSelectable?: boolean;
  balance?: string;
  error?: string;
  isStaked?: boolean;
}

export function TaoInput({
  value,
  onChange,
  onClick,
  token,
  label,
  subLabel,
  isSelectable = false,
  balance = "0",
  error: externalError,
  isStaked = false, //wallet balance
}: TaoInputProps) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    const value = e.target.value;
    setError(null);

    if (value.startsWith("-")) {
      setError("Amount cannot be negative");
      return;
    }

    if (value === "" || !isNaN(+value)) {
      onChange(value);

      if (balance && value !== "" && +value > +balance) {
        setError("Insufficient balance");
      }
    }
  };

  return (
    <div>
      <div
        className={`w-[366px] h-[91px] rounded-[8px] bg-[var(--bg-light)] border-[1px] ${
          error ? "border-red-500" : "border-[var(--color-disabled)]"
        }  flex justify-center items-center relative`}
      >
        {label && (
          <div
            className={`text-[14px] text-[var(--color-dark)] absolute top-[-12px] left-[19px] bg-[var(--bg-light)] px-[5px]`}
          >
            {label}
          </div>
        )}
        <div className={`flex justify-between items-center w-full px-[16px]`}>
          <input
            type="number"
            value={value}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="any"
            className={`w-full font-[Haffner-Bold] bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            readOnly={!token}
            style={{
              fontSize: "34px",
              appearance: "none",
              MozAppearance: "textfield",
            }}
          />

          <button
            className="flex items-center gap-2"
            onClick={isSelectable ? onClick : undefined}
          >
            {token ? (
              <div className="flex items-center gap-[16px]">
                <div
                  style={{
                    background: isStaked
                      ? "linear-gradient(180deg, #9B9B9B 0%, #C9C9C9 100%)"
                      : "linear-gradient(180deg, #000000 0%, #666666 100%)",
                  }}
                  className={`w-[24px] h-[24px] rounded-full`}
                />

                <div className="flex flex-col">
                  <span className="text-[20px] text-[var(--color-black)]">
                    {token.symbol}
                  </span>
                  {isStaked && (
                    <span className="text-[12px] text-[var(--color-black)]">
                      {token.subnetName}
                    </span>
                  )}
                </div>
                {isSelectable && <DrowDownIcon />}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[20px]">SELECT</span>
                {isSelectable && <DrowDownIcon />}
              </div>
            )}
          </button>
        </div>

        {balance && (
          <div
            className={`text-[14px] text-[var(--color-primary)] absolute mt-[88px] left-[15px] border-b-0 bg-[var(--bg-light)] px-[5px]`}
          >
            {subLabel && `${subLabel}: ${balance}`}
          </div>
        )}
      </div>

      {(error || externalError) && (
        <div className="text-xs text-red-500 mt-[10px] font-mono">
          {error || externalError}
        </div>
      )}
    </div>
  );
}
