import { useState, useEffect } from "react";
import { useWalletStore } from "../store";
import { useQuery } from "@tanstack/react-query";
import * as services from "../services";
import { PLANCK_PER_TAO } from "../utils/constants";

export const useWallet = () => {
  const {
    walletAddress,
    selectedValidator,
    api,
    setupExtension,
    connectWallet,
    disconnectWallet,
    stakeTx,
    unstakeTx,
  } = useWalletStore((state) => state);

  const [loading_balances, setBalanceLoading] = useState<boolean>(false);
  const [validatorStake, setValidatorStake] = useState<string>("0");
  const [loading_validatorStake, setLoading_validatorStake] =
    useState<boolean>(false);

  // Load validator stake when validator changes
  useEffect(() => {
    const loadValidatorStake = async () => {
      if (
        !selectedValidator ||
        !api ||
        !walletAddress ||
        loading_validatorStake
      ) {
        return;
      }

      setLoading_validatorStake(true);

      try {
        console.log("Loading stake for validator:", selectedValidator);
        const info: any =
          await api.call.stakeInfoRuntimeApi.getStakeInfoForHotkeyColdkeyNetuid(
            selectedValidator,
            walletAddress,
            0
          );

        if (!info) {
          console.log("No stake info found for validator:", selectedValidator);
          setValidatorStake("0");
          return;
        }

        try {
          const stakeStr = info.toHuman().stake.toString().replace(/,/g, "");
          const stakeValue = Number(stakeStr);

          if (isNaN(stakeValue)) {
            console.error("Invalid stake value:", stakeStr);
            setValidatorStake("0");
            return;
          }

          const stakeInTao = stakeValue / Number(PLANCK_PER_TAO);
          const formattedStake = stakeInTao.toFixed(2);

          console.log("Validator stake loaded:", {
            validator: selectedValidator,
            rawStake: stakeStr,
            formattedStake: formattedStake,
          });

          setValidatorStake(formattedStake);
        } catch (conversionError) {
          console.error("Error converting stake value:", conversionError);
          setValidatorStake("0");
        }
      } catch (error) {
        console.error("Error getting validator stake:", error);
        setValidatorStake("0");
      } finally {
        setLoading_validatorStake(false);
      }
    };

    loadValidatorStake();
  }, [selectedValidator, walletAddress]);

  const {
    data: subnets,
    isLoading: loading_subnets,
    error: subnetsError,
  } = useQuery({
    queryKey: ["subnets"],
    queryFn: services.getSubnets,
  });

  const {
    data: taoPrice,
    isLoading: loading_taoPrice,
    error: taoPriceError,
  } = useQuery({
    queryKey: ["taoPrice"],
    queryFn: services.getTaoPrice,
  });

  return {
    walletAddress,
    subnets,
    taoPrice,
    validatorStake,
    loading_balances,
    loading_subnets,
    loading_taoPrice,
    loading_validatorStake,
    connectWallet,
    disconnectWallet,
    stakeTx,
    unstakeTx,
    setValidatorStake,
  };
};
