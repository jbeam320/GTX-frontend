import { useQuery } from "@tanstack/react-query";
import * as services from "../services";

export const useSubnets = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["subnets"],
        queryFn: services.getSubnets,
        initialData: [], // or null, depending on your needs
    });

    return { subnets: data || [], isLoading };
};