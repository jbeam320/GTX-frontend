import { Line, LineChart, ResponsiveContainer } from "recharts";
import { useTaoPrice } from "../../../hooks";
import { Subnet } from "../../../lib/types";
import {
  formatCompact,
  formatPercent,
  formatPrice,
} from "../../../lib/utils/format";

interface SubnetListItemProps {
  subnet: Subnet & { index: number };
  isUSD: boolean;
}

export default function SubnetListItem({
  subnet,
  isUSD = false,
}: SubnetListItemProps) {
  const { taoPrice } = useTaoPrice();

  return (
    <div className="w-full md:w-[1200px] h-[73px] px-[0px] md:px-[14px] py-[10px] my-[2px] rounded-[8px] bg-[var(--bg-light-1)] font-[500] font-montserrat flex items-center justify-between text-[13px] md:text-[14px] hover:bg-[var(--bg-dark-1)]">
      {/* Name */}
      <div className="flex items-center min-w-[110px] md:w-[230px]">
        <div className="text-[13px] max-md:hidden font-[400]">
          {subnet.index}
        </div>
        <div
          className="mx-[10px] md:mx-[15px] rounded-full w-[34px] h-[34px]"
          style={{
            background: `linear-gradient(180deg, #000000 0%, #666666 100%)`,
          }}
        />
        <div className="flex flex-col h-[38px] justify-between">
          <div className="md:text-[14px] font-[600]">{subnet.name}</div>
          <div className="text-[12px]">{subnet.netuid}</div>
        </div>
      </div>

      <div className="hidden md:block text-[14px] p-[10px] w-[100px] font-[600]">
        {formatPercent(subnet.emission / 1e9)}
      </div>

      <div className="text-[14px] p-[10px]  md:w-[100px] font-[600]">
        T {formatPrice(subnet.price, isUSD ? taoPrice?.price : null)}
      </div>

      {/* 24h price for mobile */}
      <div
        className={`md:hidden text-center h-[24px] w-[83px] border-[var(--border-black)] border-[1px] rounded-[16px] ${
          subnet.price_change_24h < 0
            ? "bg-[var(--bg-dark-2)]"
            : "bg-[var(--bg-light)]"
        }`}
      >
        {formatPercent(subnet.price_change_24h)}
      </div>

      {/* price changes */}
      <div className="hidden md:flex gap-[25px] text-[14px]">
        <div
          className={`text-center h-[24px] w-[83px] border-[var(--border-black)] border-[1px] rounded-[16px] ${
            subnet.price_change_1h < 0
              ? "bg-[var(--bg-dark-2)]"
              : "bg-[var(--bg-light)]"
          }`}
        >
          {formatPercent(subnet.price_change_1h)}
        </div>

        <div
          className={`text-center h-[24px] w-[83px] border-[var(--border-black)] border-[1px] rounded-[16px] ${
            subnet.price_change_24h < 0
              ? "bg-[var(--bg-dark-2)]"
              : "bg-[var(--bg-light)]"
          }`}
        >
          {formatPercent(subnet.price_change_24h)}
        </div>

        <div
          className={`text-center h-[24px] w-[83px] border-[var(--border-black)] border-[1px] rounded-[16px] ${
            subnet.price_change_1w < 0
              ? "bg-[var(--bg-dark-2)]"
              : "bg-[var(--bg-light)]"
          }`}
        >
          {formatPercent(subnet.price_change_1w)}
        </div>
      </div>

      <div className="w-[90px] md:w-[100px] p-[10px] text-center font-[600]">
        {formatCompact(subnet.market_cap, isUSD ? taoPrice?.price : null)}
      </div>

      <div className="hidden md:block w-[96px] p-[10px] text-center font-[600]">
        {formatCompact(subnet.volume_24h, isUSD ? taoPrice?.price : null)}
      </div>

      <div className="hidden md:block w-[100px] p-[10px] text-center font-[600]">
        {formatCompact(subnet.liquidity || 0, isUSD ? taoPrice?.price : null)}
      </div>

      {/* chart */}
      <div className="hidden md:block w-[66px] h-[15px]">
        <ResponsiveContainer width="100%" height="100%">
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
