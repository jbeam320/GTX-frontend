'use client';

import { Button } from '@mantine/core';
import { useEffect, useState } from 'react';

export default function WalletConnectButton() {
  const [walletInstalled, setWalletInstalled] = useState(false);

  useEffect(() => {
    if ((window as any).talismanEth) {
      setWalletInstalled(true);
    }
  }, []);

  const connectWallet = async () => {
    try {
      const accounts = await (window as any).talismanEth.request({
        method: 'eth_requestAccounts',
      });
      console.log('Connected account:', accounts[0]);
    } catch (err) {
      console.error(err);
    }
  };

  if (!walletInstalled) {
    return <Button color="red">Talisman Wallet not installed</Button>;
  }

  return <Button onClick={connectWallet}>Connect Talisman Wallet</Button>;
}
