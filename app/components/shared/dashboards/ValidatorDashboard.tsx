import { ValidatorList } from "../lists";
import { TaoInfo } from "../../ui/cards";
import { taoPrice, validators } from "../../../lib/data";
import { formatPercent, formatCompactSimple } from "../../../lib/utils/format";
import { useTaoPrice } from "../../../hooks";

type TaoPriceKey = "price" | "market_cap" | "volume_24h" | "staked_supply";

export default function ValidatorDashboard() {
  // const { taoPrice } = useTaoPrice();
  const price_percent = formatPercent(taoPrice.percent_24h_change);
  const cards = [
    { label: "BITTENSOR PRICE", key: "price" as TaoPriceKey },
    { label: "MARKET CAP", key: "market_cap" as TaoPriceKey },
    { label: "24H VOLUME", key: "volume_24h" as TaoPriceKey },
    { label: "STAKED SUPPLY", key: "staked_supply" as TaoPriceKey },
  ];

  return (
    <div className="flex flex-col gap-[16px]">
      {/* 4 Cards */}
      <div className="flex flex-row gap-[18px]">
        {cards.map(({ key, label }) => (
          <TaoInfo
            key={key}
            label={label}
            value={
              key === "staked_supply"
                ? `${formatPercent(taoPrice[key])}%`
                : `$${formatCompactSimple(taoPrice[key])}`
            }
            percentage={price_percent}
          />
        ))}
      </div>

      {/* Table */}
      <ValidatorList validators={validators} />
    </div>
  );
}
