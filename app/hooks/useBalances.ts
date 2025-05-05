import { ApiPromise } from "@polkadot/api";
import { PLANCK_PER_TAO } from "../lib/constants";
import { useWalletStore } from "../stores/store";
import { useEffect, useState } from "react";

export const useBalances = () => {
  const [loading_balances, setLoading_balances] = useState(false);

  const {
    walletAddress,
    api,
    selectedValidator,
    walletBalance,
    stakedBalance,
    fetchStakedBalance,
    fetchWalletBalance,
  } = useWalletStore();

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
  }, [walletAddress, api, selectedValidator]);

  return {
    loading_balances,
    walletBalance,
    stakedBalance,
  };
};
