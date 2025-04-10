import * as api from "./api";

export const getSubnets = async () => {
  const response = await api.get("/subnet");
  return response;
};

export const getSubnet = async (subnetId: string) => {
  const response = await api.get(`/subnet/${subnetId}`);
  return response;
};

export const getSubnetChartData = async (netuid: string, period: string) => {
  const response = await api.get(`/chart?netuid=${netuid}&period=${period}`);
  return response;
};



