import { useState } from "react";

interface Token {
  symbol: string;
  balance: string;
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
  size?: "sm" | "md" | "lg";
}

export function TaoInput({
  value,
  onChange,
  onClick,
  token,
  label,
  subLabel,
  isSelectable = false,
  balance,
  error: externalError,
  size = "md",
}: TaoInputProps) {
  const [error, setError] = useState<string | null>(null);

  const sizeClasses = {
    sm: {
      container: "px-3 py-2",
      input: "text-lg",
      label: "text-xs",
      balance: "text-xs",
      icon: "w-2 h-2",
      tokenText: "text-xs",
    },
    md: {
      container: "px-4 py-3",
      input: "text-2xl",
      label: "text-sm",
      balance: "text-xs",
      icon: "w-3 h-3",
      tokenText: "text-sm",
    },
    lg: {
      container: "px-5 py-4",
      input: "text-3xl",
      label: "text-base",
      balance: "text-sm",
      icon: "w-4 h-4",
      tokenText: "text-base",
    },
  };

  const styles = sizeClasses[size];

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
      {label && (
        <div className={`${styles.label} text-gray-500 mb-1`}>{label}</div>
      )}
      <div
        className={`border rounded-lg ${
          styles.container
        } flex justify-between items-center ${
          error || externalError ? "border-red-500" : ""
        } ${isSelectable ? "cursor-pointer" : ""}`}
        onClick={isSelectable ? onClick : undefined}
      >
        <input
          type="number"
          value={value}
          onChange={handleChange}
          placeholder="0"
          min="0"
          step="any"
          className={`${styles.input} font-bold w-full bg-transparent outline-none`}
          readOnly={isSelectable}
        />
        <button className="flex items-center gap-2" onClick={onClick}>
          <div className={`${styles.icon} rounded-full bg-gray-400`} />
          <div>
            <div className={`${styles.tokenText} font-bold`}>
              {token?.symbol || "SELECT"}
            </div>
            {!isSelectable && (
              <div className="text-xs text-gray-400 -mt-1">ROOT</div>
            )}
          </div>
          {isSelectable && <span>▼</span>}
        </button>
      </div>

      {(error || externalError) && (
        <div className="text-xs text-red-500 mt-1 font-mono">
          {error || externalError}
        </div>
      )}

      {balance && (
        <div className={`${styles.balance} mt-2 text-gray-500 font-mono`}>
          {subLabel}: {balance}
        </div>
      )}
    </div>
  );
}
