"use client";
import { useEffect, useState } from "react";
import { Subnet } from "../lib/types";

import SubnetList from "../components/shared/lists/SubnetList";
import SearchInput from "../components/ui/inputs/SearchInput";
import TokenToggle from "../components/ui/toggles/TokenToggle";
import { subnets } from "../lib/data";

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

          <TokenToggle
            firstLabel="TAO"
            secondLabel="USD"
            setMode={(modeNumber) => setIsUSD(modeNumber === 2)}
          />
        </div>

        <SubnetList subnets={filtered} isUSD={isUSD} />
      </div>
    </div>
  );
}
