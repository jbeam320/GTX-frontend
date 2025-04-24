"use client";
import { useEffect, useState } from "react";
import { Subnet } from "../lib/types";
import SubnetList from "../components/shared/lists/SubnetList";
import SearchInput from "../components/ui/inputs/SearchInput";
import TokenToggle from "../components/ui/toggles/TokenToggle";
import { useSubnets } from "../hooks";
import { subnets } from "../lib/data";
import DropdownMenu from "../components/ui/dropdowns/Dropdown";

export default function SubnetPage() {
  // const { subnets } = useSubnets();

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
      <div className="max-md:w-full">
        <div className="md:hidden font-[600] text-[24px] font-montserrat mt-[34px] mb-[28px] px-[24px]">
          Subnet
        </div>
        <div className="mb-[14px] flex flex-col max-md:px-[12px] md:flex-row gap-[30px] md:gap-[14px]">
          <SearchInput onChange={(value) => setSearch(value)} />

          <div className="flex justify-between items-center">
            <TokenToggle
              firstLabel="TAO"
              secondLabel="USD"
              setMode={(modeNumber) => setIsUSD(modeNumber === 2)}
            />

            <div className="md:hidden flex gap-[26px]">
              <span>Rows</span>
              <button />
            </div>
          </div>
        </div>

        <SubnetList subnets={filtered} isUSD={isUSD} />
      </div>
    </div>
  );
}
