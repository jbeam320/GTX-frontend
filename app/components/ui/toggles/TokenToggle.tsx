"use client";

import { useEffect, useState } from "react";

interface ToggleProps {
  firstLabel: string;
  secondLabel: string;
  setMode?: (modeNumber: 1 | 2) => void;
  className?: string;
}

export default function TokenToggle({
  firstLabel,
  secondLabel,
  setMode,
  className = "",
}: ToggleProps) {
  const [toggleState, setToggleState] = useState<1 | 2>(1);

  useEffect(() => {
    if (setMode) {
      setMode(toggleState);
    }
  }, [toggleState]);

  return (
    <div
      className={`flex items-center bg-[var(--bg-dark-6)] border-[1px] border-[var(--bg-dark-1)]  rounded-[16px] px-[7px] py-[4px] ${className}`}
      style={{ border: "1px solid var(--border-dark-1)" }}
    >
      <button
        onClick={() => setToggleState(1)}
        className={`px-[13px] py-[6px] rounded-[12px] text-[16px] font-medium transition-all duration-200 ${
          toggleState === 1
            ? "bg-black text-white"
            : "bg-transparent text-gray-500 hover:text-gray-700"
        }`}
      >
        {firstLabel}
      </button>
      <button
        onClick={() => setToggleState(2)}
        className={`px-[13px] py-[6px] rounded-[12px] text-[16px] font-medium transition-all duration-200 ${
          toggleState === 2
            ? "bg-black text-white"
            : "bg-transparent text-gray-500 hover:text-gray-700"
        }`}
      >
        {secondLabel}
      </button>
    </div>
  );
}
