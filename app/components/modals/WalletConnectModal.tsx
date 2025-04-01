"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Select, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useWalletStore } from "../../store";

export default function WalletConnectModal() {
  const { connectWallet } = useWalletStore();
  const modals = useModals();

  const [walletProvider, setWalletProvider] =
    useState<string>("BitTensor Wallet");

  const handleConnect = async () => {
    try {
      connectWallet();
      modals.closeAll();
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const handleModalButton = () =>
    modals.openModal({
      title: "Connect Wallet",
      children: (
        <>
          <Text>Choose your network and connect your wallet</Text>
          <Select
            label="Network"
            value={walletProvider}
            onChange={() => setWalletProvider}
            data={["BitTensor Wallet"]}
            style={{ marginBottom: 10 }}
          />
          <Button fullWidth variant="filled" onClick={handleConnect}>
            Connect
          </Button>
        </>
      ),
    });

  return (
    <>
      <Button variant="filled" onClick={handleModalButton}>
        Connect Wallet
      </Button>
    </>
  );
}
