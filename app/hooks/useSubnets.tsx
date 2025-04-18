import { useQuery } from "@tanstack/react-query";
import * as services from "../services";

export const useSubnets = () => {
  const { data: subnets, isLoading: loading_subnets } = useQuery({
    queryKey: ["subnets"],
    queryFn: services.getSubnets,
  });

  return {
    subnets,
    loading_subnets,
  };
};

export const useSubnet = (netuid: string) => {
  const { data: subnet, isLoading: loading_subnet } = useQuery({
    queryKey: ["subnet", netuid],
    queryFn: () => services.getSubnet(netuid),
  });

  return {
    subnet,
    loading_subnet,
  };
};

export const useSubnetChartData = (
  netuid: number,
  period: string,
  startTime: number,
  endTime: number
) => {
  const { data: subnetChartData, isLoading: loading_subnetChartData } =
    useQuery({
      queryKey: ["subnetChart", netuid, period],
      queryFn: () =>
        services.getSubnetChartData(netuid, period, startTime, endTime),
    });

  return {
    subnetChartData,
    loading_subnetChartData,
  };
};
