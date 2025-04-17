import { useSubnets } from "./useSubnets";
import { useEffect, useState } from "react";
import { useWalletStore } from "../stores/store";
import { TokenForBulk, Subnet } from "../lib/types";
import { subnets } from "../lib/data";

export const useTokens = () => {
  const { selectedValidator, getValidatorStake } = useWalletStore();
  // const { subnets } = useSubnets();

  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<TokenForBulk[]>([]);

  useEffect(() => {
    if (subnets?.length && selectedValidator.hotkey) {
      const init = async () => {
        try {
          setLoading(true);

          const balances = await Promise.all(
            subnets.map(
              async (subnet: Subnet) =>
                await getValidatorStake(selectedValidator.hotkey, subnet.netuid)
            )
          );

          const tokens = subnets.map((subnet: Subnet, index: number) => ({
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
  }, [subnets, selectedValidator]);

  return {
    tokens,
    loading,
    setTokens,
  };
};
