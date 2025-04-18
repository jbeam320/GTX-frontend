import { useEffect, useState } from "react";
import { Subnet, TokenForBulk } from "../lib/types";
import { useWalletStore } from "../stores/store";
import { useSubnets } from "./useSubnets";

export const useTokens = () => {
  const { selectedValidator, walletBalance, getValidatorStake } =
    useWalletStore();
  const { subnets } = useSubnets();

  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<TokenForBulk[]>([]);

  useEffect(() => {
    if (subnets?.length && selectedValidator.hotkey) {
      const init = async () => {
        try {
          setLoading(true);

          const balances = await Promise.all(
            subnets?.map(
              async (subnet: Subnet) =>
                await getValidatorStake(selectedValidator.hotkey, subnet.netuid)
            )
          );

          const tokens = subnets?.map((subnet: Subnet, index: number) => ({
            ...subnet,
            balance: balances[index],
            amount: 0,
            type: "none" as "none" | "sell" | "buy",
          }));

          setTokens(tokens);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      init();
    }
  }, [subnets, selectedValidator, walletBalance]);

  return {
    tokens,
    loading,
    setTokens,
  };
};
