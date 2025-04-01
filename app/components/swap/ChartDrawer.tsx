import { motion } from "framer-motion";
import { Token } from "../../utils/types";

interface ChartDrawerProps {
  fromToken: Token | null;
  toToken: Token | null;
  onClose: () => void;
}

const ChartDrawer = ({ fromToken, toToken, onClose }: ChartDrawerProps) => {
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-[480px] bg-white p-4 rounded-xl shadow-xl mr-4"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-lg">
          {fromToken?.symbol} ⇄ {toToken?.symbol}
        </h2>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="h-[280px] bg-gray-100 rounded">📊 Chart Placeholder</div>
    </motion.div>
  );
};

export default ChartDrawer;
