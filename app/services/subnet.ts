import * as api from "./api";

export const getSubnets = async () => {
        const response = await api.get("/subnet");
        return response;
};




