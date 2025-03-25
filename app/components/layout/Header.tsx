"use client";

//third party
import { Button, Text, Flex, ActionIcon, Box, Container } from "@mantine/core";
import { MoonStars, Settings } from "tabler-icons-react";

//hooks
import { useWalletStore, useConnectWallet } from "../../core";

//components
import WalletConnectModal from "../modals/WalletConnectModal";

const tabs = ["Swap", "Subnet", "Bulk", "Stake"];

export default function Header() {
  const { disconnect } = useConnectWallet();

  const accountInfo = useWalletStore((state) => state.walletAddress);

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
            {accountInfo ? (
              <Flex align="center" gap="xs">
                <Text size="sm">
                  {accountInfo.slice(0, 6)}...{accountInfo.slice(-4)}
                </Text>
                <Text size="sm">Staked: 504.00t | Wallet: 1443.00t</Text>
                <Button
                  size="xs"
                  variant="outline"
                  color="gray"
                  radius="xl"
                  onClick={disconnect}
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
