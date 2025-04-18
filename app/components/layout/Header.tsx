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
import WalletConnectModal from "../ui/modals/WalletConnectModal";
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

  useEffect(() => {
    reconnectWallet();
  }, []);

  useEffect(() => {
    if (!api && !extension && walletAddress) {
      disconnectWallet();
    }
  }, [api, extension, walletAddress]);

  const isActive = (tab: string) => pathname === `/${tab.toLowerCase()}`;

  const handleTabClick = (tab: string) => {
    const url = tab !== "SUBNET" ? `/${tab.toLowerCase()}` : "/subnets";
    router.push(url);
  };

  return (
    <Box bg="var(--bg-light)">
      <Container size="1200px" className="mt-[60px]" px={0}>
        <Flex justify="space-between" align="center" style={{ width: "100%" }}>
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
                      ? "text-black  underline"
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
                  options={validators.map((validator: Validator) => ({
                    label: validator.name,
                    value: validator.hotkey,
                  }))}
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

            <SettingIcon className="cursor-pointer" />
          </Flex>
        </Flex>

        <WalletConnectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </Container>
    </Box>
  );
}
