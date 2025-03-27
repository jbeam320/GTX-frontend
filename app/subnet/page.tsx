"use client";

import { useSubnets } from "../hooks/subnet";

export default function SubnetPage() {
    const { subnets, isLoading } = useSubnets();

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Subnets</h1>
            {subnets.map((subnet: any) => (
                <div key={subnet.id}>{subnet.name}</div>
            ))}
        </div>
    );
}
