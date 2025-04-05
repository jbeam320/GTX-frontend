import { useEffect } from "react";
import { useWalletStore } from "../stores/store";


export const useValidatorStake = () => {
  const { selectedValidator, validatorStake, getValidatorStake, setValidatorStake} = useWalletStore();

  useEffect(() => {
    if (selectedValidator) {
      getValidatorStake(selectedValidator.hotkey, 0).then((stake) => {
        if (stake) {
          setValidatorStake(stake);
        }
      });
    }
  }, [selectedValidator]);
  
  return {
    validatorStake
  };
};
    