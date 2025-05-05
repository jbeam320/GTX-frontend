import * as api from "./api";

export const getValidators = async () => {
  const response = await api.get("/validators");
  return response;
};





