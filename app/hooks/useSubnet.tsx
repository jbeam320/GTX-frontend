import { useQuery } from "@tanstack/react-query";
import * as services from "../services";

export const useSubnet = () => {
  const { data: subnets, isLoading: loading_subnets } = useQuery({
    queryKey: ["subnets"],
    queryFn: services.getSubnets,
  });

  return {
    subnets,
    loading_subnets,
  };
};
