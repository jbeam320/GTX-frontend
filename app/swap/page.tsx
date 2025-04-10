"use client";

import TradingChartContainer from "../components/shared/dashboards/TradingChartDashBoard";
import SwapPanel from "../components/shared/panels/SwapPanel";
import { useState } from "react";

export default function Swap() {
  const [isChartVisible, setIsChartVisible] = useState(false);

  return (
    <div className="flex justify-center mt-[100px] relative">
      <div
        className={`transition-all duration-300 ease-in-out transform ${
          isChartVisible
            ? "opacity-100 translate-x-0 mr-[8px]"
            : "opacity-0 translate-x-[-100%] absolute left-[50%] -translate-x-[50%]"
        }`}
      >
        <TradingChartContainer
          tokenInfo={{
            symbol: "BTC",
            name: "Bitcoin",
            price: "50000",
            change: "1000",
            changePercentage: "2%",
            marketCap: "1000000000",
            volume: "500000000",
          }}
        />
      </div>
      <div
        className={`transition-all duration-300 ease-in-out transform ${
          isChartVisible
            ? "translate-x-0"
            : "left-[50%] -translate-x-[50%] absolute"
        }`}
      >
        <SwapPanel
          onToggleChart={() => setIsChartVisible(!isChartVisible)}
          isChartVisible={isChartVisible}
        />
      </div>
    </div>
  );
}
