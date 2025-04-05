import * as api from "./api";


export const getTaoPrice = async () => {
    const response = await api.get("/tao_price");
    return response;
};



