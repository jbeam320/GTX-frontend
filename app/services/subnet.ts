import * as api from "./api";

export const getSubnets = async () => {
  const response = await api.get("/subnet");
  return response;
};

export const getSubnet = async (subnetId: string) => {
  const response = await api.get(`/subnet/${subnetId}`);
  return response;
};

export const getSubnetChartData = async (netuid: number, interval: string, startTime: number, endTime: number) => {
  const response = await api.get(`/chart?netuid=${netuid}&interval=${interval}&start_time=${startTime}&end_time=${endTime}`);
  return response;
};



