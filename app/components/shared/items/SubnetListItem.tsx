import { Line, LineChart } from "recharts";
import { ResponsiveContainer } from "recharts";
import { Subnet } from "../../../lib/types";

import {
  formatCompact,
  formatPercent,
  formatPrice,
} from "../../../lib/utils/format";
import { taoPrice } from "../../../lib/data";

interface SubnetListItemProps {
  subnet: Subnet & { index: number };
  isUSD: boolean;
}

export default function SubnetListItem({
  subnet,
  isUSD = false,
}: SubnetListItemProps) {
  return (
    <div className="w-[1200px] h-[73px] px-[14px] py-[10px] my-[2px] rounded-[8px] bg-[var(--bg-light-1)] font-montserrat flex space-between items-center text-[14px] hover:bg-[var(--bg-dark-1)]">
      <div className="flex items-center basis-[250px]">
        <div className="text-[13px]">{subnet.index}</div>
        <div
          className="mx-[15px] rounded-full w-[34px] h-[34px]"
          style={{
            background: `linear-gradient(180deg, #000000 0%, #666666 100%)`,
          }}
        />
        <div className="flex flex-col h-[38px] justify-between">
          <div className="text-[14px]">{subnet.name}</div>
          <div className="text-[12px]">{subnet.netuid}</div>
        </div>
      </div>

      <div className="text-[14px] p-[10px] basis-[100px]">
        {formatPercent(subnet.emission / 1e9)}
      </div>
      <div className="text-[14px] p-[10px]  basis-[120px]">
        {formatPrice(subnet.price, isUSD ? taoPrice.price : null)}
      </div>

      <div className="flex gap-[25px] text-[14px] mr-[30px]">
        {["price_change_1h", "price_change_24h", "price_change_1w"].map(
          (key) => (
            <div
              key={key}
              className={`text-center h-[24px] w-full min-w-[83px]  border-[var(--border-black)] border-[1px] rounded-[16px] ${
                (subnet[key as keyof Subnet] as number) < 0
                  ? "bg-[var(--bg-dark-2)]"
                  : "bg-[var(--bg-light)]"
              }`}
            >
              {formatPercent(subnet[key as keyof Subnet] as number)}
            </div>
          )
        )}
      </div>

      <div className="basis-[100px] p-[10px] text-center">
        {formatCompact(subnet.market_cap, isUSD ? taoPrice.price : null)}
      </div>
      <div className="basis-[96px] p-[10px] text-center">
        {formatCompact(subnet.volume_24h, isUSD ? taoPrice.price : null)}
      </div>
      <div className="basis-[100px] p-[10px] text-center">
        {formatCompact(subnet.liquidity || 0, isUSD ? taoPrice.price : null)}
      </div>

      <div className="w-[66px] h-[15px] flex items-center justify-center">
        <ResponsiveContainer
          width="100%"
          height="100%"
          className="justify-center items-center"
        >
          <LineChart
            data={subnet.last_7days_trends.map((value, index) => ({
              name: `Day ${index + 1}`,
              value,
            }))}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <svg>
              <defs>
                <linearGradient
                  id="gradient1"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#666666" />
                  <stop offset="100%" stopColor="#000000" />
                </linearGradient>
              </defs>
            </svg>

            <Line
              type="monotone"
              dataKey="value"
              stroke={"url(#gradient1)"}
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
