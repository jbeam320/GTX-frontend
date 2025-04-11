import Image from "next/image";
import { Subnet } from "../../../lib/types";

interface TokenListItemProps {
  token: Subnet;
  onBuy?: () => void;
  onSell?: () => void;
}

const TokenListItem = ({ token, onBuy, onSell }: TokenListItemProps) => {
  return (
    <div className="flex items-center px-4 py-3 hover:bg-gray-100/5">
      <div className="w-8 h-8 mr-3">
        <Image
          src={`/icons/tokens/${token.symbol.toLowerCase()}.svg`}
          alt={token.symbol}
          width={32}
          height={32}
        />
      </div>

      <div className="flex-1 grid grid-cols-5 items-center">
        <div className="flex flex-col">
          <span className="text-white text-sm font-medium">{token.symbol}</span>
          <span className="text-gray-400 text-xs">{token.symbol}</span>
        </div>

        <div className="text-white">{token.price.toFixed(3)} USDC</div>

        <div className="flex flex-col">
          <span className="text-white">{token.market_cap} USDC</span>
          <span className="text-gray-400 text-xs">{token.market_cap}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-white">""</span>
          <span className="text-gray-400 text-xs">""</span>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onBuy}
            className="px-4 py-1 rounded-full bg-transparent border border-white text-white hover:bg-white/10"
          >
            Buy
          </button>
          <button
            onClick={onSell}
            className="px-4 py-1 rounded-full bg-transparent border border-white text-white hover:bg-white/10"
          >
            Sell
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenListItem;
