import { useState, useRef, useEffect } from "react";
import { SUBNETS } from "../../utils/data";
import { Token } from "../../utils/types";
import { motion, AnimatePresence } from "framer-motion";

interface SubnetSelectorProps {
  onSelect: (subnet: Token) => void;
  onClose: () => void;
}

const SubnetSelector = ({ onSelect, onClose }: SubnetSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredSubnets = SUBNETS.filter(
    (subnet) =>
      subnet.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subnet.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subnet.netuid.toString().includes(searchQuery)
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

          <div className="relative mb-6">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Subnet name or number"
              className="w-full pl-12 pr-4 py-3 bg-[#2C2C2C] text-white rounded-lg outline-none placeholder-gray-500"
            />
          </div>

          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {filteredSubnets.map((subnet) => (
              <motion.button
                key={subnet.symbol}
                onClick={() => onSelect({ ...subnet, balance: "0" })}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#2C2C2C] transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gray-600" />
                  <div className="text-left">
                    <div className="text-white font-medium">
                      {subnet.symbol}
                    </div>
                    <div className="text-xs text-gray-500 uppercase">
                      {subnet.label}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-400 font-mono">
                  SN{subnet.netuid}
                </div>
              </motion.button>
            ))}
            {filteredSubnets.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No subnets found
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubnetSelector;
