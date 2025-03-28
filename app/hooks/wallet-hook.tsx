import { useState, useEffect } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useWalletStore } from "../store";
import { PLANCK_PER_TAO } from "../utils/constants";
import { info } from "console";
import { web3Enable } from "@polkadot/extension-dapp";
import { web3FromAddress } from "@polkadot/extension-dapp";

export const useWallet = () => {
  const { walletAddress, setWalletAddress } = useWalletStore((state) => state);

  const [stakedBalance, setStakedBalance] = useState<string>("0");
  const [walletBalance, setWalletBalance] = useState<string>("0");
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
      setWalletBalance("0");
      setStakedBalance("0");
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

      setWalletBalance((freeBalance / PLANCK_PER_TAO).toFixed(2));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const fetchStakedBalance = async (userAddress: string, api: ApiPromise) => {
    try {
      const infos: any[] =
        await api.call.stakeInfoRuntimeApi.getStakeInfoForColdkey(userAddress);
      const stakes =
        infos?.filter((info) => info.netuid.toString() === "0") ?? [];

      const stakedBalance = stakes?.reduce((total: number, curr: any) => {
        return total + curr.stake.toString().replace(/,/g, "");
      }, 0);

      setStakedBalance((stakedBalance / PLANCK_PER_TAO).toFixed(2));
    } catch (error) {
      console.error("Error fetching staked balance:", error);
    }
  };

  const stakeTx = async (validator: string, amount: number) => {
    if (!walletAddress) throw new Error("wallet address not found");

    const { web3Enable, web3FromAddress } = await import(
      "@polkadot/extension-dapp"
    );

    await web3Enable("my-dapp");
    const account = await web3FromAddress(walletAddress);

    if (!account) throw new Error("Account not found");

    const provider = new WsProvider(
      process.env.NEXT_PUBLIC_BITTENSOR_NODE_ENDPOINT
    );
    const api = await ApiPromise.create({ provider });
    await api.isReady;

    const stakeTx = api.tx.subtensorModule.addStake(validator, 0, amount);

    const txHash = await stakeTx.signAndSend(
      walletAddress,
      {
        signer: account.signer,
        withSignedTransaction: !0,
      },
      async (result) => {
        const { dispatchError, isInBlock, isFinalized } = result;
        if (!isFinalized) return;

        if (dispatchError) {
          console.error("Transaction failed:", dispatchError.toString());
          throw dispatchError;
        } else {
          console.log("Block:", isInBlock);
        }
      }
    );

    return txHash;
  };

  const unstakeTx = async (validator: string, amount: number) => {
    if (!walletAddress) throw new Error("wallet address not found");

    const { web3Enable, web3FromAddress } = await import(
      "@polkadot/extension-dapp"
    );

    await web3Enable("my-dapp");
    const account = await web3FromAddress(walletAddress);

    if (!account) throw new Error("Account not found");

    const provider = new WsProvider(
      process.env.NEXT_PUBLIC_BITTENSOR_NODE_ENDPOINT
    );
    const api = await ApiPromise.create({ provider });
    await api.isReady;

    const unstakeTx = api.tx.subtensorModule.removeStake(validator, 0, amount);

    const txHash = await unstakeTx.signAndSend(
      walletAddress,
      {
        signer: account.signer,
      },
      (result) => {
        const { dispatchError, isInBlock, isFinalized } = result;
        if (!isFinalized) return;

        if (dispatchError) {
          console.error("Transaction failed:", dispatchError.toString());
          throw dispatchError;
        } else {
          console.log("Block:", isInBlock);
        }
      }
    );

    return txHash;
  };

  return {
    walletAddress,
    walletBalance,
    stakedBalance,
    loading,
    connectWallet,
    disconnectWallet,
    stakeTx,
    unstakeTx,
  };
};
