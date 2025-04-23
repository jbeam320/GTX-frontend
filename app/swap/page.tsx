"use client";

import { Container } from "@mantine/core";
import TradingChartContainer from "../components/shared/dashboards/TradingChartDashBoard";
import SwapPanel from "../components/shared/panels/SwapPanel";
import { useState } from "react";

export default function Swap() {
  const [isChartVisible, setIsChartVisible] = useState(false);

  return (
    <Container
      size="1235px"
      className="h-[calc(100vh-140px)] md:h-auto mt-[140px] md:mt-[100px] px-0 md:px-6"
    >
      <div className="w-full h-full flex flex-col md:flex-row md:justify-between">
        {/* Chart Container */}
        <div
          className={`transition-all duration-300 ease-in-out transform w-full ${
            isChartVisible
              ? "opacity-100 translate-x-0 md:mr-[8px]"
              : "opacity-0 translate-x-[-100%] absolute left-[50%] -translate-x-[50%]"
          } max-md:mt-[60px] mb-[20px] order-2 md:order-1 ${
            !isChartVisible && "max-md:hidden"
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

        {/* Swap Panel */}
        <div className="order-1 md:order-2 mx-auto w-full md:w-auto px-4 md:px-0 flex justify-center h-full md:h-auto">
          <SwapPanel
            onToggleChart={() => setIsChartVisible(!isChartVisible)}
            isChartVisible={isChartVisible}
          />
        </div>
      </div>
    </Container>
  );
}
