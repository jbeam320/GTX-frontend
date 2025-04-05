import { ApiPromise } from "@polkadot/api";
import { PLANCK_PER_TAO } from "../lib/constants";
import { useWalletStore } from "../stores/store";
import { useEffect, useState } from "react";

export const useBalances = () => {
  const [loading_balances, setLoading_balances] = useState(false);

  const { walletAddress, api, walletBalance, stakedBalance, setWalletBalance, setStakedBalance } =
    useWalletStore();

  useEffect(() => {
    if (api && walletAddress) {
      const init = async () => {
        try {
          setLoading_balances(true);
          await fetchWalletBalance(walletAddress, api);
          await fetchStakedBalance(walletAddress, api);
        } catch (error) {
          console.error("Error fetching balances:", error);
        } finally {
          setLoading_balances(false);
        }
      };

      init();
    }
  }, [walletAddress, api]);

  const fetchWalletBalance = async (walletAddress: string, api: ApiPromise) => {
    if (!walletAddress || !api) throw new Error("wallet address not found");

    try {
      console.log("Fetching wallet balance for address:", walletAddress);
      const accountData = await api.query.system.account(walletAddress);
      const rawBalance = (accountData as any).data.free.toBigInt();
      const balanceInTao = Number(rawBalance) / Number(PLANCK_PER_TAO);
      const formattedBalance = balanceInTao.toFixed(2);
      setWalletBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const fetchStakedBalance = async (userAddress: string, api: ApiPromise) => {
    if (!userAddress || !api) throw new Error("wallet address not found");

    try {
      const infos: any[] =
        await api.call.stakeInfoRuntimeApi.getStakeInfoForColdkey(userAddress);

      const stakes =
        infos?.filter((info) => info.netuid.toString() === "0") ?? [];
      
        const totalStaked = stakes?.reduce((total: number, curr: any) => {
        return total + Number(curr.stake.toString().replace(/,/g, ""));
      }, 0);
      
      const formattedBalance = (totalStaked / PLANCK_PER_TAO).toFixed(2);
      setStakedBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching total staked balance:", error);
      setStakedBalance("0");
    }
  };

  return {
    loading_balances,
    walletBalance,
    stakedBalance,
  };
};
