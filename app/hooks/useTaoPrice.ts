import { useQuery } from "@tanstack/react-query";
import * as services from "../services";

export const useTaoPrice = () => {
  const { data: taoPrice, isLoading: loading_taoPrice } = useQuery({
    queryKey: ["taoPrice"],
    queryFn: services.getTaoPrice,
  });

  return {
    taoPrice,
    loading_taoPrice,
  };
};
