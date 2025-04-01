import { useEffect } from "react";
import { useWalletStore } from "../store";


export const useValidatorStake = () => {
  const { selectedValidator, getValidatorStake, setValidatorStake} = useWalletStore();

  useEffect(() => {
    if (selectedValidator) {
      getValidatorStake(selectedValidator).then((stake) => {
        if (stake) {
          setValidatorStake(stake);
        }
      });
    }
  }, [selectedValidator]);
  
  
};
    