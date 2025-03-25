"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Select, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useConnectWallet } from "../../core";

export default function WalletConnectModal() {
  const { connect } = useConnectWallet();
  const modals = useModals();

  const [network, setNetwork] = useState<string>("BitTensor Wallet");

  const handleConnect = async () => {
    try {
      connect();
      modals.closeAll();
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const handleModalButton = useCallback(
    () =>
      modals.openConfirmModal({
        title: "Connect Wallet",
        children: (
          <>
            <Text>Choose your network and connect your wallet</Text>
            <Select
              label="Network"
              value={network}
              onChange={() => setNetwork}
              data={["BitTensor Wallet", "Other Network"]}
              style={{ marginBottom: 10 }}
            />
            <Button fullWidth variant="filled" onClick={handleConnect}>
              Connect
            </Button>
          </>
        ),
        onConfirm: handleConnect,
      }),
    [handleConnect]
  );

  return (
    <>
      <Button variant="filled" onClick={handleModalButton}>
        Connect Wallet
      </Button>
    </>
  );
}
