import { useTaoPrice, useValidators } from "../../../hooks";
import { formatCompactSimple, formatPercent } from "../../../lib/utils/format";
import { TaoInfo } from "../../ui/cards";
import { ValidatorList } from "../lists";
import { validators } from "../../../lib/data";

type TaoPriceKey = "price" | "market_cap" | "volume_24h" | "staked_supply";

export default function ValidatorDashboard() {
  const { taoPrice } = useTaoPrice();
  // const { validators } = useValidators();

  const price_percent = formatPercent(taoPrice?.percent_24h_change);

  const cards = [
    { label: "BITTENSOR PRICE", key: "price" as TaoPriceKey },
    { label: "MARKET CAP", key: "market_cap" as TaoPriceKey },
    { label: "24H VOLUME", key: "volume_24h" as TaoPriceKey },
    { label: "STAKED SUPPLY", key: "staked_supply" as TaoPriceKey },
  ];

  return (
    <div className="w-full flex flex-col gap-[24px] md:gap-[16px]">
      {/* 4 Cards */}
      <div className="w-full grid grid-cols-2 md:flex md:flex-row gap-[8px] md:justify-between">
        {cards.map(({ key, label }) => (
          <TaoInfo
            key={key}
            label={label}
            value={
              key === "staked_supply"
                ? `${formatPercent(taoPrice?.[key] ?? 0)}%`
                : `$${formatCompactSimple(taoPrice?.[key] ?? 0)}`
            }
            percentage={price_percent}
          />
        ))}
      </div>

      {/* Table */}
      <ValidatorList validators={validators ?? []} />
    </div>
  );
}
