"use client";

import { Box, Container, Flex, Loader } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useBalances, useValidators } from "../../hooks";
import { Validator } from "../../lib/types";
import { useWalletStore } from "../../stores/store";
import { Button } from "../ui/buttons";
import WalletInfo from "../ui/cards/WalletInfo";
import DropdownMenu from "../ui/dropdowns/Dropdown";
import MobileNavigationModal from "../ui/modals/MobileNavigationModal";
import SettingsModal from "../ui/modals/SettingsModal";
import WalletConnectModal from "../ui/modals/WalletConnectModal";
import MenuIcon from "/public/icons/menu.svg";
import SettingIcon from "/public/icons/setting.svg";

const tabs = ["SWAP", "SUBNET", "BULK", "STAKE"];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    disconnectWallet,
    walletAddress,
    api,
    extension,
    selectedValidator,
    setSelectedValidator,
    reconnectWallet,
  } = useWalletStore();
  const { walletBalance, stakedBalance, loading_balances } = useBalances();
  const { validators } = useValidators();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    reconnectWallet();
  }, []);

  useEffect(() => {
    if (!api && !extension && walletAddress) {
      disconnectWallet();
    }
  }, [api, extension, walletAddress]);

  const handleTabClick = (tab: string) => {
    const url = tab !== "SUBNET" ? `/${tab.toLowerCase()}` : "/subnets";
    router.push(url);
  };

  const isActive = (tab: string) =>
    pathname === `/${tab.toLowerCase()}` ||
    (pathname === "/subnets" && tab === "SUBNET");

  return (
    <>
      {/* Desktop Header */}
      <Box bg="var(--bg-light)" className="hidden md:block">
        <Container size="1200px" className="mt-[60px]" px={0}>
          <Flex
            justify="space-between"
            align="center"
            style={{ width: "100%" }}
          >
            {/* LEFT SECTION */}
            <div className="flex items-center gap-6">
              <label className="text-[36px] font-sans font-bold w-[102px] mr-[54px]">
                GTX
              </label>

              <div className="flex gap-[60px]">
                {tabs.map((tab, i) => (
                  <label
                    key={i}
                    className={`text-[14px] font-[DM Mono] cursor-pointer ${
                      isActive(tab)
                        ? "text-black underline"
                        : "text-[var(--color-gray)]"
                    }`}
                    onClick={() => handleTabClick(tab)}
                  >
                    {tab}
                  </label>
                ))}
              </div>
            </div>

            {/* RIGHT SECTION */}
            <Flex align="center" gap="32px" style={{ flexShrink: 0 }}>
              {walletAddress ? (
                <Flex align="center" gap="32px">
                  <DropdownMenu
                    options={
                      validators ??
                      []?.map((validator: Validator) => ({
                        label: validator.name,
                        value: validator.hotkey,
                      }))
                    }
                    selectedOption={{
                      value: selectedValidator.hotkey,
                      label: selectedValidator.name,
                    }}
                    setOption={(option) =>
                      setSelectedValidator({
                        hotkey: option.value,
                        name: option.label,
                      })
                    }
                  />

                  {loading_balances ? (
                    <Loader color="var(--color-primary)" size="sm" />
                  ) : (
                    <WalletInfo
                      walletAddress={walletAddress}
                      walletBalance={walletBalance}
                      stakedBalance={stakedBalance}
                    />
                  )}
                </Flex>
              ) : (
                <Button
                  label="Connect Wallet"
                  fontSize="14px"
                  color="var(--color-light)"
                  backgroundColor="var(--bg-dark)"
                  borderRadius="8px"
                  border="1px solid var(--border-dark)"
                  width="167px"
                  height="40px"
                  onClick={() => setIsModalOpen(true)}
                />
              )}

              <SettingIcon
                className="cursor-pointer"
                onClick={() => setShowSettings(true)}
              />
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Mobile Header */}
      <Box
        bg="var(--bg-dark)"
        className="md:hidden fixed top-0 left-0 right-0 z-30 h-[86px]"
      >
        <div className="flex justify-between items-center px-[19px] pt-[10px]">
          <div className="flex items-center gap-[24px]">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="cursor-pointer"
            >
              <MenuIcon />
            </button>

            <div className="flex flex-col gap-[5px]">
              <div className="text-[23px] font-[900] text-white font-montserrat">
                GTX
              </div>
              <div className="text-[11px] font-[600] text-[var(--color-gray-secondary)]">
                General Tao Exchange
              </div>
            </div>
          </div>

          {loading_balances ? (
            <Loader color="var(--color-primary)" size="sm" />
          ) : (
            <WalletInfo
              walletAddress={walletAddress}
              walletBalance={walletBalance}
              stakedBalance={stakedBalance}
            />
          )}
        </div>
      </Box>

      <MobileNavigationModal
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <WalletConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}
