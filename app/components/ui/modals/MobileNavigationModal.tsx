"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SettingsModal from "./SettingsModal";
import CloseIcon from "/public/icons/close-gray.svg";
import DarkSettingIcon from "/public/icons/setting-dark.svg";
interface MobileNavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tabs = ["SWAP", "SUBNET", "BULK", "STAKE"];

export default function MobileNavigationModal({
  isOpen,
  onClose,
}: MobileNavigationModalProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .slide-enter {
        animation: slideRight 0.7s ease-out forwards;
      }
      
      @keyframes slideRight {
        0% { transform: translateX(100%); }
        100% { transform: translateX(0); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleTabClick = (tab: string) => {
    const url = tab !== "SUBNET" ? `/${tab.toLowerCase()}` : "/subnets";
    router.push(url);
  };

  const isActive = (tab: string) =>
    pathname === `/${tab.toLowerCase()}` ||
    (pathname === "/subnets" && tab === "SUBNET");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-40 flex flex-col justify-center md:hidden">
      {/* Header with GTX and close button */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-[24px] py-[20px]">
        <span className="text-white text-[36px] font-[900] font-mono">GTX</span>
        <button onClick={onClose} className="cursor-pointer">
          <CloseIcon />
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col mx-[20px] border-t-[1px] border-[var(--border-dark-1)]">
        {tabs.map((tab, i) => (
          <div
            key={i}
            onClick={() => handleTabClick(tab)}
            className={`flex border-b-[1px] ${
              isActive(tab)
                ? "border-[var(--color-light)] justify-start"
                : "border-[var(--border-dark-1)] justify-end"
            } px-[16px] cursor-pointer h-[64px]`}
          >
            <span
              className={`py-[16px] text-[24px] font-mono uppercase ${
                isActive(tab)
                  ? "text-white font-[500] slide-enter"
                  : "text-[var(--color-dark)] font-[400]"
              }`}
            >
              {tab}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-6">
        <div className="flex items-center justify-center">
          <button
            className="cursor-pointer flex items-center gap-[10px] opacity-50 rounded-[16px] border-[1px] border-[var(--border-light-66)] h-[40px] px-[18px] py-[10px]"
            onClick={() => setShowSettings(true)}
          >
            <DarkSettingIcon />
            <span className="text-[14px] font-[450] text-[var(--border-light-66)]">
              SETTINGS
            </span>
          </button>
        </div>

        <div className="mt-[35px] text-center text-[11px] font-haffer font-[300] text-white opacity-30">
          © 2025 TaoMarketCap. All rights reserved.
        </div>
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
