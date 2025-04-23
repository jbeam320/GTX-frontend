"use client";

import { SearchableList } from "../../shared/lists";
import SubnetListItem from "../../shared/items/SubnetModalItem";
import { Token, Subnet } from "../../../lib/types";
import { useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "/public/icons/close.svg";
import { createPortal } from "react-dom";

interface SubnetSelectorProps {
  subnets: Subnet[];
  onSelect?: (token: Token) => void;
  onClose: () => void;
}

const SubnetSelector = ({
  subnets,
  onSelect,
  onClose,
}: SubnetSelectorProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const renderSubnet = (subnet: Subnet) => (
    <SubnetListItem
      token={subnet.symbol}
      subnet={subnet.name}
      netuid={subnet.netuid.toString()}
      onClick={() =>
        onSelect?.({
          symbol: subnet.symbol,
          subnetName: subnet.name,
          netuid: subnet.netuid,
          balance: "0",
          isStaked: false,
          price: 0,
        })
      }
    />
  );

  const data = useMemo(() => {
    return subnets?.map((subnet) => ({
      ...subnet,
      balance: "0",
      isStaked: true,
      subnetName: subnet.name,
    }));
  }, [subnets]);

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center"
      >
        <motion.div
          ref={modalRef}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full md:w-[400px] max-h-[1012px] h-full rounded-[8px] overflow-y-hidden"
          style={{ backgroundColor: "var(--bg-dark)" }}
        >
          <div className="flex justify-center mb-[27px] mt-[24px] relative">
            <div className="text-[18px] text-white flex justify-center items-center w-[250px] h-[43px]">
              SELECT A SUBNET
            </div>

            <CloseIcon
              onClick={onClose}
              className="cursor-pointer absolute right-[20px]"
            />
          </div>

          <SearchableList
            data={data}
            searchConfig={{
              fields: ["symbol", "netuid"],
            }}
            renderItem={renderSubnet}
            searchPlaceholder="Search by Subnet name or number"
            style={{
              backgroundColor: "var(--bg-dark-10)",
              border: "1px solid var(--border-dark-50)",
              marginBottom: "24px",
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  if (typeof window === "undefined") return null;

  return createPortal(modalContent, document.body);
};

export default SubnetSelector;
