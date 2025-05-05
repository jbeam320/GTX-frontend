import { useMemo } from "react";
import { useTaoPrice } from "../../../hooks";
import { TokenForBulk } from "../../../lib/types";
import { formatCompact, formatPrice } from "../../../lib/utils/format";
import { ContainerCard } from "../../ui/cards";

interface TokenListItemProps {
  token: TokenForBulk;
  disabled?: boolean;
  selectedMobileColumn?: string;
  onBuy: (token: TokenForBulk) => void;
  onSell: (token: TokenForBulk) => void;
  [key: string]: any;
}

const TokenListItem = ({
  token,
  disabled = false,
  selectedMobileColumn,
  onBuy,
  onSell,
  ...restProps
}: TokenListItemProps) => {
  const { taoPrice } = useTaoPrice();

  const data = useMemo(() => {
    return [
      {
        column: "Price",
        element: (
          <div
            className="basis-[100px] text-[15px] font-semibold"
            style={{ fontFamily: "Montserrat" }}
          >
            {formatPrice(token.price, taoPrice?.price, 3)}
          </div>
        ),
      },

      {
        column: "Reserve",
        element: (
          <div className="flex flex-col basis-[200px] gap-[10px]">
            <span className="text-[15px] font-semibold">
              {formatCompact(token.market_cap, taoPrice?.price)} USDC
            </span>
            <span className="text-[12px] font-medium">
              {formatCompact(token.market_cap)} TAO
            </span>
          </div>
        ),
      },

      {
        column: "Balance",
        element: (
          <div className="flex flex-col basis-[100px] gap-[10px]">
            <span className="text-[15px] font-semibold">
              {formatPrice(+token.balance, null, 2)}
            </span>
            <span className="text-[12px] font-medium">0.000 B</span>
          </div>
        ),
      },

      {
        column: "Trade",
        element: (
          <div className="flex gap-[6px] md:gap-[19px]">
            <button
              disabled={disabled}
              onClick={() => onBuy(token)}
              className={`h-[37px] rounded-[16px] bg-[var(--bg-light)] border-[1px] border-[var(--color-black)] text-[14px] font-medium cursor-pointer ${
                token.type === "buy" ? "w-[185px]" : "w-[83px]"
              } ${token.type === "sell" && "hidden"}`}
            >
              Buy
            </button>
            <button
              disabled={disabled}
              onClick={() => onSell(token)}
              className={`h-[37px] rounded-[16px] bg-[var(--bg-dark-2)] border-[1px] border-[var(--color-black)] text-[14px] font-medium cursor-pointer ${
                token.type === "sell" ? "w-[185px]" : "w-[83px]"
              } ${token.type === "buy" && "hidden"}`}
            >
              Sell
            </button>
          </div>
        ),
      },
    ];
  }, [token, onSell, onBuy]);

  return (
    <div>
      <div
        className="max-md:hidden flex justify-between items-center px-4 py-3 w-[824px] h-[73px] px-[15px] font-montserrat"
        {...restProps}
      >
        <div className="flex items-center gap-[14px]">
          <div
            className="w-[34px] h-[34px] mr-[14px] rounded-full"
            style={{ background: "var(--gradient-primary-reverse)" }}
          />

          <div className="flex flex-col gap-[10px] w-[100px]">
            <span className="text-left text-[15px] font-semibold">
              {token.symbol}
            </span>
            <span className="text-left text-[12px] font-medium">
              {token.symbol}
            </span>
          </div>
        </div>

        {data.map((item) => (
          <div key={item.column}>{item.element}</div>
        ))}
      </div>

      <ContainerCard
        firstChild={
          <div className="flex flex-col gap-[6px]">
            <span className="text-left text-[15px] font-[600] font-montserrat">
              {token.symbol}
            </span>
            <span className="text-left text-[12px] font-[500] font-montserrat">
              {token.symbol}
            </span>
          </div>
        }
        secondChild={
          data.find((item) => item.column === selectedMobileColumn)?.element
        }
        className="md:hidden"
      />
    </div>
  );
};

export default TokenListItem;
