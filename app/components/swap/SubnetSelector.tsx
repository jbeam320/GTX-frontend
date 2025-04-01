import { useRef, useEffect } from "react";
import { SUBNETS } from "../../utils/data";
import { Token } from "../../utils/types";
import { motion, AnimatePresence } from "framer-motion";
import { SearchableList } from "../base/SearchableList";

interface SubnetSelectorProps {
  onSelect: (subnet: Token) => void;
  onClose: () => void;
}

const SubnetSelector = ({ onSelect, onClose }: SubnetSelectorProps) => {
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

  const renderSubnet = (subnet: (typeof SUBNETS)[0]) => (
    <button
      onClick={() => onSelect({ ...subnet, balance: "0" })}
      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#2C2C2C] transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full bg-gray-600" />
        <div className="text-left">
          <div className="text-white font-medium">{subnet.symbol}</div>
          <div className="text-xs text-gray-500 uppercase">{subnet.label}</div>
        </div>
      </div>
      <div className="text-sm text-gray-400 font-mono">SN{subnet.netuid}</div>
    </button>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
      >
        <motion.div
          ref={modalRef}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-[480px] mx-auto mt-20 bg-[#1C1C1C] rounded-xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-mono text-white">SELECT A SUBNET</h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-2xl"
            >
              ×
            </button>
          </div>

          <SearchableList
            data={SUBNETS}
            searchConfig={{
              fields: ["symbol", "label", "netuid"],
            }}
            renderItem={renderSubnet}
            searchPlaceholder="Search by Subnet name or number"
            maxHeight="400px"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubnetSelector;
