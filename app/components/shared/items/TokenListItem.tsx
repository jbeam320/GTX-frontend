import { taoPrice } from "../../../lib/data";
import { TokenForBulk } from "../../../lib/types";
import { formatCompact, formatPrice } from "../../../lib/utils/format";

interface TokenListItemProps {
  token: TokenForBulk;
  onBuy: (token: TokenForBulk) => void;
  onSell: (token: TokenForBulk) => void;
  [key: string]: any;
}

const TokenListItem = ({
  token,
  onBuy,
  onSell,
  ...restProps
}: TokenListItemProps) => {
  return (
    <div
      className="flex justify-between items-center px-4 py-3 w-[824px] h-[73px] px-[15px] font-montserrat"
      {...restProps}
    >
      <div
        className="w-[34px] h-[34px] mr-[14px] rounded-full"
        style={{ background: "var(--gradient-primary-reverse)" }}
      />

      <div className="flex flex-col gap-[10px] w-[130px]">
        <span className="text-[15px] font-semibold">{token.symbol}</span>
        <span className="text-[12px] font-medium">{token.symbol}</span>
      </div>

      <div
        className="basis-[100px] text-[15px] font-semibold"
        style={{ fontFamily: "Montserrat" }}
      >
        {formatPrice(token.price, taoPrice.price, 3)}
      </div>

      <div className="flex flex-col basis-[200px] gap-[10px]">
        <span className="text-[15px] font-semibold">
          {formatCompact(token.market_cap, taoPrice.price)} USDC
        </span>
        <span className="text-[12px] font-medium">
          {formatCompact(token.market_cap)} TAO
        </span>
      </div>

      <div className="flex flex-col basis-[100px] gap-[10px]">
        <span className="text-[15px] font-semibold">{token.balance}</span>
        <span className="text-[12px] font-medium">0.000 B</span>
      </div>

      <div className="flex gap-[19px]">
        <button
          onClick={() => onBuy(token)}
          className={`h-[37px] rounded-[16px] bg-[var(--bg-light)] border-[1px] border-[var(--color-black)] text-[14px] font-medium cursor-pointer ${
            token.type === "buy" ? "w-[185px]" : "w-[83px]"
          } ${token.type === "sell" && "hidden"}`}
        >
          Buy
        </button>
        <button
          onClick={() => onSell(token)}
          className={`h-[37px] rounded-[16px] bg-[var(--bg-dark-2)] border-[1px] border-[var(--color-black)] text-[14px] font-medium cursor-pointer ${
            token.type === "sell" ? "w-[185px]" : "w-[83px]"
          } ${token.type === "buy" && "hidden"}`}
        >
          Sell
        </button>
      </div>
    </div>
  );
};

export default TokenListItem;
