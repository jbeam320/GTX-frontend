import * as api from "./api";

export const getSubnets = async () => {
        const response = await api.get("/subnet");
        return response;
};

export const getTaoPrice = async () => {
    const response = await api.get("/tao_price");
    return response;
};



