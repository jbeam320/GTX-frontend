import Image from "next/image";
import { Subnet } from "../../../lib/types";
import { formatCompact, formatPrice } from "../../../lib/utils/format";
import { taoPrice } from "../../../lib/data";
import * as service from "../../../services";
import { useWalletStore } from "../../../stores/store";
import { useEffect } from "react";
import { useState } from "react";

interface TokenListItemProps {
  token: Subnet;
  onBuy?: () => void;
  onSell?: () => void;
  [key: string]: any;
}

const TokenListItem = ({
  token,
  onBuy,
  onSell,
  ...restProps
}: TokenListItemProps) => {
  const { getValidatorStake, selectedValidator } = useWalletStore();

  const [balance, setBalance] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    getValidatorStake(selectedValidator.hotkey, token.netuid).then((stake) =>
      setBalance(stake)
    );
  }, [token.netuid]);

  const handleBuy = () => {
    setStatus(status => {
      if (status === "buy") {
        return "";
      }
      return "buy";
    });

    onBuy?.();
  }

  const handleSell = () => {
    setStatus(status => {
      if (status === "sell") {
        return "";
      }
      return "sell";
    });

    onSell?.();
  }

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
        <span className="text-[15px] font-semibold">
          {token.symbol}
        </span>
        <span className="text-[12px] font-medium">
          {token.symbol}
        </span>
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
        <span className="text-[15px] font-semibold">{balance}</span>
        <span className="text-[12px] font-medium">0.000 B</span>
      </div>

      <div className="flex gap-[19px]">
        <button
          onClick={handleBuy}
          className={`h-[37px] rounded-[16px] bg-[var(--bg-light)] border-[1px] border-[var(--color-black)] text-[14px] font-medium cursor-pointer ${status === "buy" ? "w-[185px]" : "w-[83px]"} ${status === "sell" && "hidden"}`}
        >
          Buy
        </button>
        <button
          onClick={handleSell}
          className={`h-[37px] rounded-[16px] bg-[var(--bg-dark-2)] border-[1px] border-[var(--color-black)] text-[14px] font-medium cursor-pointer ${status === "sell" ? "w-[185px]" : "w-[83px]"} ${status === "buy" && "hidden"}`}
        >
          Sell
        </button>
      </div>
    </div >
  );
};

export default TokenListItem;
