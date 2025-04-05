import { Button } from "../buttons";
import { useWalletStore } from "../../../stores/store";

import { useEffect, useRef } from "react";
import ArrowDownIcon from "/public/icons/arrow-down.svg";
const WalletConnectModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { connectWallet } = useWalletStore();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleConnect = async () => {
    try {
      onClose();
      await connectWallet();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-[var(--bg-dark-overlay)] backdrop-blur-sm" />
      <div className="relative flex justify-end">
        <div
          ref={modalRef}
          className=" w-[388px] h-[575px] bg-[var(--bg-light)] rounded-[8px] overflow-hidden mt-[56px] mr-[114px] border-[1px] border-[var(--border-dark-1)]"
        >
          <div className="p-[14px] flex flex-col items-center">
            <h2 className="text-[18px] font-montserrat text-center mb-[12px]">
              Connect Wallet
            </h2>

            <div className="bg-[var(--bg-dark-4)]  px-[25px] py-[15px] mb-[308px] h-[132px] rounded-[8px]">
              <label className="text-[11px] mb-[12px] font-montserrat block">
                Network
              </label>

              <button className="w-[298px] h-[52px] bg-[var(--bg-light)] border-[1px] border-[var(--color-black)] rounded-[8px] p-[10px] flex items-center justify-between">
                <div className="flex items-center gap-[7px]">
                  <div
                    className="w-[33px] h-[33px] rounded-full"
                    style={{
                      background:
                        "linear-gradient(180deg, #000000 0%, #666666 100%)",
                    }}
                  ></div>
                  <span className="text-[18px] font-montserrat">
                    BitTensor Wallet
                  </span>
                </div>

                <ArrowDownIcon />
              </button>
            </div>

            <Button
              label="Connect"
              width="337px"
              height="60px"
              backgroundColor="var(--bg-dark)"
              color="var(--color-light)"
              borderRadius="8px"
              fontSize="18px"
              onClick={handleConnect}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;
