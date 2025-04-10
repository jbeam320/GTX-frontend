import axios from "axios";
import { formatUrl } from "../lib/utils/formatUrl";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
});

api.interceptors.request.use((config) => {
  config.url = formatUrl(config.url || "");
  return config;
});

export const get = async (url: string, params: any = {}) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    errorHandler(error);
  }
};

export const post = async (url: string, data: any) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    errorHandler(error);
  }
};

export const put = async (url: string, data: any) => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    errorHandler(error);
  }
};

export const del = async (url: string, data: any) => {
  try {
    const response = await api.delete(url, data);
    return response.data;
  } catch (error) {
    errorHandler(error);
  }
};

const errorHandler = (error: any) => {
  throw error;
  // TODO: handle error
};
