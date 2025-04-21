import { useQuery } from "@tanstack/react-query";
import * as services from "../services";

export const useValidators = () => {
  const { data: validators, isLoading: loading_validators } = useQuery({
    queryKey: ["validators"],
    queryFn: services.getValidators,
  });

  return {
    validators,
    loading_validators,
  };
};
