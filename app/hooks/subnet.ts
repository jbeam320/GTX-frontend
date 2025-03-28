import { useQuery } from "@tanstack/react-query";
import * as services from "../services";

export const useSubnets =  () => {
  const {
    data,
    isLoading: subnetsLoading,
    error: subnetsError,
  } =  useQuery({
    queryKey: ["subnets"],
    queryFn: services.getSubnets,
  });

  const {
    data: taoPrice,
    isLoading: taoPriceLoading,
    error: taoPriceError,
  } =  useQuery({
    queryKey: ["taoPrice"],
    queryFn: services.getTaoPrice,
  });

  return {
    subnets: data,
    taoPrice,
    isLoading: subnetsLoading || taoPriceLoading,
    error: subnetsError || taoPriceError,
  };
};
