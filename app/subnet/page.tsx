"use client";
import React, { useEffect, useState } from "react";
import { Subnet } from "../lib/types";
import { Button, Group } from "@mantine/core";

import {
  subnets,
  taoPrice,
  loading_subnets,
  loading_taoPrice,
} from "../lib/data";
import SubnetList from "../components/shared/lists/SubnetList";
import SearchInput from "../components/ui/inputs/SearchInput";

export default function SubnetPage() {
  // const { subnets, loading_subnets } = useSubnet();
  // const { taoPrice, loading_taoPrice } = useTaoPrice();

  const [filtered, setFiltered] = useState<Subnet[]>([]);
  const [search, setSearch] = useState("");
  const [isUSD, setIsUSD] = useState(false);

  // Filter subnets based on search term
  useEffect(() => {
    if (!search) return setFiltered(subnets);
    setFiltered(
      subnets.filter(
        (s: Subnet) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.netuid.toString().includes(search.toLowerCase())
      )
    );
  }, [search, subnets]);

  return (
    <div className="flex justify-center items-center mt-[70px]">
      {/* Table with Data */}
      <div>
        <div className="mb-[14px] flex gap-[14px]">
          <SearchInput onChange={(value) => setSearch(value)} />

          <Group>
            <Button.Group>
              <Button
                variant={!isUSD ? "filled" : "default"}
                onClick={() => setIsUSD(false)}
                radius="xl"
                style={{ backgroundColor: !isUSD ? "#000" : "transparent" }}
              >
                TAO
              </Button>
              <Button
                variant={isUSD ? "filled" : "default"}
                onClick={() => setIsUSD(true)}
                radius="xl"
                style={{ backgroundColor: isUSD ? "#000" : "transparent" }}
              >
                USD
              </Button>
            </Button.Group>
          </Group>
        </div>

        <SubnetList subnets={filtered} isUSD={isUSD} />
      </div>
    </div>
  );
}
