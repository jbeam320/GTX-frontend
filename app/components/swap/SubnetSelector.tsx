import { SUBNETS } from "../../utils/data";
import { Token } from "../../utils/types";

interface SubnetSelectorProps {
  onSelect: (subnet: Token) => void;
  onClose: () => void;
}

const SubnetSelector = ({ onSelect, onClose }: SubnetSelectorProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-lg font-semibold">SELECT A SUBNET</h3>
      <button onClick={onClose} className="text-gray-500">
        ✕ Close
      </button>
      <input
        type="text"
        placeholder="Search by Subnet name or number"
        className="w-full mb-4 px-3 py-2 rounded bg-gray-800 text-white outline-none"
      />
      {SUBNETS.map((subnet) => (
        <div
          key={subnet.symbol}
          onClick={() => onSelect({ ...subnet, balance: "0" })}
          className="flex items-center justify-between p-2 rounded hover:bg-gray-700 cursor-pointer"
        >
          <div>
            <div className="font-semibold">{subnet.symbol}</div>
            <div className="text-xs text-gray-400">{subnet.label}</div>
          </div>
          <div className="text-sm text-gray-300">{subnet.netuid}</div>
        </div>
      ))}
    </div>
  );
};

export default SubnetSelector;
