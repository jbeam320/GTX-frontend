"use client";

import { useState } from "react";
import CloseIcon from "/public/icons/close-black.svg";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SLIPPAGE_OPTIONS = ["0.1", "0.5", "1", "1.5"];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [selectedSlippage, setSelectedSlippage] = useState("0.1");
  const [transactionDeadline, setTransactionDeadline] = useState("30");
  const [safeMode, setSafeMode] = useState(false);
  const [useFinney, setUseFinney] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal container */}
      <div className="relative z-[51] bg-[var(--bg-light)] rounded-[8px] p-[16px] pb-[84px] flex flex-col gap-[16px] w-[388px] max-[400px]:w-full max-w-[90vw]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[var(--color-disabled)] pb-[16px]">
          <h2 className="text-[20px] font-[500] font-mono">SETTINGS</h2>
          <button onClick={onClose} className="hover:opacity-80">
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-col gap-[32px]">
          {/* Slippage Tolerance */}
          <div className="space-y-[19px]">
            <h3 className="text-[14px] font-[400] text-[var(--color-black-secondary)] font-mono uppercase">
              SLIPPAGE TOLERANCE
            </h3>
            <div className="flex gap-[7px]">
              {SLIPPAGE_OPTIONS.map((value) => (
                <button
                  key={value}
                  disabled={!safeMode}
                  onClick={() => setSelectedSlippage(value)}
                  className={`h-[41px] px-[19px] rounded-[8px] font-mono font-[400] text-[14px] border border-[var(--color-disabled)] transition-colors ${
                    selectedSlippage === value
                      ? "bg-[var(--bg-dark)] text-white"
                      : "bg-[var(--bg-light)] text-[var(--color-black-secondary)]"
                  } ${!safeMode && "opacity-50"}`}
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Deadline */}
          <div className="space-y-[15px]">
            <h3 className="text-[14px] font-[400] text-[var(--color-black-secondary)] font-mono uppercase">
              TRANSACTION DEADLINE
            </h3>
            <div className="flex items-center gap-[7px] w-[182px] h-[41px] px-[16px] rounded-[8px] border-[1px] border-[var(--color-disabled)] bg-[var(--bg-light)]">
              <input
                type="number"
                value={transactionDeadline}
                onChange={(e) => setTransactionDeadline(e.target.value)}
                className="w-full text-[14px] text-[var(--color-black-secondary)] font-[400] font-mono  bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-[14px] text-[var(--color-black-secondary)] font-[400] font-mono">
                minutes
              </span>
            </div>
          </div>

          {/* Safe Mode */}
          <div className="space-y-[19px]">
            <h3 className="text-[14px] font-[400] text-[var(--color-black-secondary)] font-mono uppercase p-0">
              SAFE MODE
            </h3>

            <div className="flex items-start gap-[21px]">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={safeMode}
                  onChange={(e) => setSafeMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-[87px] h-[40px] p-[3px] bg-[var(--color-disabled)] peer-checked:bg-[var(--bg-dark)] rounded-full peer peer-checked:after:translate-x-[48px] after:content-[''] after:absolute after:top-[4px] after:bg-white after:rounded-full after:h-[33px] after:w-[33px] after:transition-all"></div>
              </label>
              <div className="text-[14px] font-[400] font-haffer">
                <p className="text-[var(--color-dark-3)]">
                  Prevent high price impact trades.
                </p>
                <p className="text-[var(--color-dark-3)]">
                  Disable at your own risk.
                </p>
                <a className="underline">Learn more</a>
              </div>
            </div>
          </div>

          {/* Network Endpoints */}
          <div className="space-y-[19px]">
            <h3 className="text-[14px] font-[400] text-[var(--color-black-secondary)] font-mono uppercase">
              CHANGE TO FINNEY NETWORK ENDPOINTS
            </h3>
            <div className="flex gap-[21px]">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useFinney}
                  onChange={(e) => setUseFinney(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-[87px] h-[40px] p-[3px] bg-[var(--color-disabled)] peer-checked:bg-[var(--bg-dark)] rounded-full peer peer-checked:after:translate-x-[48px] after:content-[''] after:absolute after:top-[5px] after:bg-white after:rounded-full after:h-[33px] after:w-[33px] after:transition-all"></div>
              </label>
              <div className="text-[14px] font-[400] font-haffer">
                <p className="text-[var(--color-dark-3)]">
                  When this button is off GTX endpoints are activated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
