"use client";

//third party
import {
  Button,
  Text,
  Flex,
  ActionIcon,
  Box,
  Container,
  Loader,
} from "@mantine/core";
import { MoonStars, Settings } from "tabler-icons-react";

//hooks
import { useWallet } from "../../core";

//components
import WalletConnectModal from "../modals/WalletConnectModal";

//constants
import { TAO, PLANCK_PER_TAO } from "../../utils/constants";

const tabs = ["Swap", "Subnet", "Bulk", "Stake"];

export default function Header() {
  const {
    disconnectWallet,
    walletAddress,
    walletBalance,
    stakedBalance,
    loading,
  } = useWallet();

  return (
    <Box bg="white" style={{ borderBottom: "1px solid #eee" }}>
      <Container size="xl">
        <Flex
          justify="space-between"
          align="center"
          py="sm"
          style={{ width: "100%" }}
        >
          {/* LEFT SECTION */}
          <Flex align="center" gap="lg" style={{ flex: 1 }}>
            <Text fw={700} fz="xl">
              GTX
            </Text>

            <Flex gap="xs">
              {tabs.map((tab, i) => (
                <Button
                  key={tab}
                  variant={i === 0 ? "filled" : "light"}
                  color={i === 0 ? "dark" : "gray"}
                  radius="xl"
                  size="xs"
                  px="md"
                >
                  {tab}
                </Button>
              ))}
            </Flex>
          </Flex>

          {/* RIGHT SECTION */}
          <Flex align="center" gap="xs" style={{ flexShrink: 0 }}>
            {walletAddress ? (
              <Flex align="center" gap="xs">
                <Text size="sm">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </Text>

                {loading ? (
                  <Loader color="blue" />
                ) : (
                  <Text size="sm">
                    Staked: {stakedBalance.toString()}
                    {TAO} | Wallet: {walletBalance.toString()}
                    {TAO}
                  </Text>
                )}

                <Button
                  size="xs"
                  variant="outline"
                  color="gray"
                  radius="xl"
                  onClick={disconnectWallet}
                >
                  Disconnect
                </Button>
              </Flex>
            ) : (
              <WalletConnectModal />
            )}

            <ActionIcon size="lg" variant="light" radius="xl">
              <MoonStars size={18} />
            </ActionIcon>
            <ActionIcon size="lg" variant="light" radius="xl">
              <Settings size={18} />
            </ActionIcon>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
