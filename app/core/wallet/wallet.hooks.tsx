import { useState, useEffect } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useWalletStore } from "./wallet.store";
import { PLANCK_PER_TAO } from "../../utils/constants";

export const useWallet = () => {
  const { walletAddress, setWalletAddress } = useWalletStore((state) => state);

  const [stakedBalance, setStakedBalance] = useState<Number>(0);
  const [walletBalance, setWalletBalance] = useState<Number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let api: any = null;

    const fetchData = async () => {
      const provider = new WsProvider(
        process.env.NEXT_PUBLIC_BITTENSOR_NODE_ENDPOINT
      );
      const api = await ApiPromise.create({ provider });

      setLoading(true);
      await fetchWalletBalance(walletAddress, api);
      await fetchStakedBalance(walletAddress, api);
      setLoading(false);
    };

    if (walletAddress) {
      fetchData();
    }

    return () => {
      if (api) {
        api.disconnect();
        api = null;
      }
    };
  }, [walletAddress]);

  const connectWallet = async () => {
    try {
      const { web3Enable } = await import("@polkadot/extension-dapp");
      const extensions = await web3Enable("my-dapp");

      if (extensions.length == 0) {
        alert("Bittensor extension not found");
        return;
      }

      const injectedExtension = extensions[0];
      const accounts = await injectedExtension.accounts.get();

      if (accounts.length === 0) {
        console.error("No accounts found");
        return;
      }

      setWalletAddress(accounts[0].address);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const disconnectWallet = async () => {
    try {
      // Clear state variables related to wallet info
      setWalletAddress("");
      setWalletBalance(0);
      setStakedBalance(0);
      setLoading(true);
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  const fetchWalletBalance = async (userAddress: string, api: ApiPromise) => {
    try {
      const accountData = await api.query.system.account(userAddress);
      const balance = accountData.toHuman();
      const freeBalance = (balance as any)?.data?.free
        .toString()
        .replace(/,/g, "");

      setWalletBalance(Number(freeBalance) / PLANCK_PER_TAO);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const fetchStakedBalance = async (userAddress: string, api: ApiPromise) => {
    try {
      const infos: any[] =
        await api.call.stakeInfoRuntimeApi.getStakeInfoForColdkey(userAddress);
      const stakedBalance = infos?.reduce((total: Number, curr: any) => {
        return total + curr.stake.toString().replace(/,/g, "");
      }, 0);

      setStakedBalance(stakedBalance / PLANCK_PER_TAO);
    } catch (error) {
      console.error("Error fetching staked balance:", error);
    }
  };

  return {
    walletAddress,
    walletBalance,
    stakedBalance,
    loading,
    connectWallet,
    disconnectWallet,
  };
};
