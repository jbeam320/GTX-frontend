"use client";

import { useEffect, useRef, useState } from "react";
import { subnetData } from "../../../lib/data";
import ButtonGroup from "../../ui/buttons/ButtonGroup";
import TradingChart from "../../ui/charts/TradingChart";
import ExpandIcon from "/public/icons/expand.svg";
import SwapIcon from "/public/icons/swap1.svg";

interface TokenInfo {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercentage: string;
  marketCap: string;
  volume: string;
}

interface TradingChartContainerProps {
  tokenInfo: TokenInfo;
}

interface ChartData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ChartValues {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const DEFAULT_WIDTH = 760;
const DEFAULT_HEIGHT = 306;

type IntervalType = "5M" | "1H" | "1D";

const INTERVALS: Record<IntervalType, 5 | 60 | 1440> = {
  "5M": 5,
  "1H": 60,
  "1D": 1440,
};

export default function TradingChartContainer({
  tokenInfo,
}: TradingChartContainerProps) {
  const [interval, setInterval] = useState<IntervalType>("1H");
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [chartValues, setChartValues] = useState<ChartValues | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        if (!isFullScreen) {
          setWidth(DEFAULT_WIDTH);
          setHeight(DEFAULT_HEIGHT);
        } else {
          setWidth(window.innerWidth - 100); // Leave some padding
          setHeight(window.innerHeight - 300); // Leave space for header and info
        }
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isFullScreen]);

  const handleFullScreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullScreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullScreen(false);
      }
    } catch (err) {
      console.error("Error attempting to enable full-screen mode:", err);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
      if (document.fullscreenElement) {
        setWidth(window.innerWidth - 100);
        setHeight(window.innerHeight - 300);
      } else {
        setWidth(DEFAULT_WIDTH);
        setHeight(DEFAULT_HEIGHT);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div
      className={`bg-[var(--bg-light)] rounded-[8px] border-[1px] border-[var(--border-dark)] p-[16px] w-[792px] flex flex-col gap-[21px] shadow-md ${
        isFullScreen ? "fixed inset-0 z-50" : ""
      }`}
      ref={containerRef}
    >
      {/* Header */}
      <div className="border-b-[1px] border-[var(--border-dark)] pb-[19px]">
        <div className="flex items-center gap-[16px]">
          <div className="flex items-center gap-[16px]">
            <div
              className="w-[24px] h-[24px] rounded-full"
              style={{ background: "var(--gradient-secondary)" }}
            />
            <div className="flex flex-col gap-[4px] font-mono">
              <span className="text-[20px]">ALPHA</span>
              <span className="text-[12px]">ALPHA</span>
            </div>
          </div>

          <SwapIcon />

          <div className="flex items-center gap-[16px]">
            <div
              className="w-[24px] h-[24px] rounded-full"
              style={{ background: "var(--gradient-primary-reverse)" }}
            />
            <div className="flex flex-col gap-[4px] font-mono">
              <span className="text-[20px]">TAO</span>
              <span className="text-[12px]">TAO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price and subnet data */}
      <div className="flex flex-col gap-[24px]">
        <div className="flex justify-between">
          <div className="flex flex-col gap-[8px]">
            <div className="flex flex-row items-center gap-[16px] h-[38px]">
              <label className="text-[28px] font-haffer font-semibold">
                ${tokenInfo.price}
              </label>
              <span className={`text-[20px] font-light`}>τ1.00</span>
            </div>
            <div className="text-[13px] font-mono">
              <span className="text-[var(--color-red)]">
                -{tokenInfo.change} (-{tokenInfo.changePercentage})&nbsp;
              </span>
              <span>DAY</span>
            </div>
          </div>

          <div className="flex flex-row gap-[8px] h-[38px]">
            <ButtonGroup
              labels={["5M", "1H", "1D"]}
              activeButton={interval}
              setActiveButton={(value) => setInterval(value as IntervalType)}
            />
            <button
              className="cursor-pointer rounded-[4px] bg-[var(--border-black)] w-[38px] h-[38px] flex items-center justify-center"
              onClick={handleFullScreen}
            >
              <ExpandIcon />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center">
            <div className="text-[12px] font-normal font-haffer text-[var(--color-dark-100)]">
              Mket Cap
            </div>
            <div className="text-[14px] font-normal font-mono">
              {subnetData.marketCap}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[12px] font-normal font-haffer text-[var(--color-dark-100)]">
              Alpha in Pool
            </div>
            <div className="text-[14px] font-normal font-mono">
              {subnetData.alphaInPool}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[12px] font-normal font-haffer text-[var(--color-dark-100)]">
              TAO in Pool
            </div>
            <div className="text-[14px] font-normal font-mono">
              {subnetData.taoInPool}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[12px] font-normal font-haffer text-[var(--color-dark-100)]">
              24h Vol
            </div>
            <div className="text-[14px] font-normal font-mono">
              {subnetData.volume24h}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[12px] font-normal font-haffer text-[var(--color-dark-100)]">
              FDV (USD)
            </div>
            <div className="text-[14px] font-normal font-mono">
              {subnetData.fdvUSD}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[12px] font-normal font-haffer text-[var(--color-dark-100)]">
              Liquidity (a)
            </div>
            <div className="text-[14px] font-normal font-mono">
              {subnetData.liquidityA}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[12px] font-normal font-haffer text-[var(--color-dark-100)]">
              Liquidity (t)
            </div>
            <div className="text-[14px] font-normal font-mono">
              {subnetData.liquidityT}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[12px] font-normal font-haffer text-[var(--color-dark-100)]">
              Circulating supply
            </div>
            <div className="text-[14px] font-normal font-mono">
              {subnetData.circulatingSupply}
            </div>
          </div>
        </div>

        {chartValues && (
          <div className="flex gap-[16px] text-[12px] font-mono font-normal">
            <div className="text-[var(--color-dark-100)]">
              T: {new Date(chartValues.time).toLocaleString()}
            </div>
            <div>
              O:{" "}
              <label className="text-[var(--color-red)]">
                {chartValues.open.toFixed(4)}
              </label>
            </div>
            <div>
              H:{" "}
              <label className="text-[var(--color-red)]">
                {chartValues.high.toFixed(4)}
              </label>
            </div>
            <div>
              L:{" "}
              <label className="text-[var(--color-red)]">
                {chartValues.low.toFixed(4)}
              </label>
            </div>
            <div>
              C:{" "}
              <label className="text-[var(--color-red)]">
                {chartValues.close.toFixed(4)}
              </label>
            </div>
            <div>
              V:{" "}
              <label className="text-[var(--color-red)]">
                {chartValues.volume.toFixed(4)}
              </label>
            </div>
          </div>
        )}
      </div>

      <TradingChart
        width={width}
        height={height}
        interval={INTERVALS[interval]}
        onCrosshairMove={setChartValues}
      />

      <div className="flex flex-col gap-[16px]">
        <div className="flex flex-row gap-[8px] items-center">
          <label
            className="w-[24px] h-[24px] rounded-full"
            style={{ background: "var(--gradient-secondary)" }}
          />
          <span className="text-[24px] font-mono font-medium">ALPHA</span>
        </div>

        <p className="text-[14px] leading-[150%] font-normal">
          ALPHA embodies the essence of being a true alpha and a GIGA Chad. A
          true alpha is not just about dominance; it's about leadership,
          resilience, and integrity. They lead by example, showing strength in
          adversity while maintaining respect for others. A true alpha amplifies
          this, standing as an icon of peak physical and mental prowess.
        </p>

        <div className="flex flex-row gap-[100px] text-[14px] text-[var(--color-dark)]">
          <a href="https://alpha.to">ALPHA.TO</a>
          <a href="https://alphastats.io">ALPHASTATS.IO/</a>
          <a href="https://taomarketcap.com/alpha">TAOMARKETCAP.COM/ALPHA</a>
        </div>
      </div>
    </div>
  );
}
