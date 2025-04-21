"use client";

import {
  createChart,
  IChartApi,
  MouseEventParams,
  UTCTimestamp,
} from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";
import { useSubnetChartData } from "../../../hooks";
import * as services from "../../../services";

interface ChartData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradingChartProps {
  height?: number;
  interval?: 5 | 60 | 1440;
  width: number;
  onCrosshairMove?: (param: {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }) => void;
}

const ONE_MINUTE = 60 * 1000;

const formatDate = (timestamp: number, interval?: 5 | 60 | 1440): string => {
  const timestampSec =
    timestamp > 9999999999 ? Math.floor(timestamp / 1000) : timestamp;
  const date = new Date(timestampSec * 1000);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  if (interval === 1440) {
    return `${year}-${month}-${day}`;
  }
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const formatCandles = (candles: ChartData[]) =>
  candles.map((d) => ({
    time: Math.floor(d.time / 1000) as UTCTimestamp,
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
  }));

const formatVolumes = (candles: ChartData[]) =>
  candles.map((d) => ({
    time: (d.time / 1000) as UTCTimestamp,
    value: d.volume,
    color:
      d.close > d.open ? "rgba(37, 38, 38, 0.3)" : "rgba(152, 152, 152, 0.3)",
  }));

const TradingChart: React.FC<TradingChartProps> = ({
  height = 306,
  interval = 60,
  width = 760,
  onCrosshairMove,
}) => {
  const { subnetChartData: chartDatas } = useSubnetChartData(
    0,
    "5m",
    Math.floor(Date.now()) - interval * ONE_MINUTE * 40,
    Math.floor(Date.now())
  );

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const isFetchingRef = useRef(false);
  const mainSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (chartDatas?.length) {
      // Take last 20 items and sort them by time ascending
      const newData = chartDatas
        .slice(-20)
        .sort((a: ChartData, b: ChartData) => a.time - b.time);

      setChartData(newData);
    }
  }, [chartDatas]);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    if (chartRef.current) chartRef.current.remove();

    const chart = createChart(chartContainerRef.current, {
      width,
      height,
      layout: { background: { color: "#ffffff" }, textColor: "#333" },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
      crosshair: {
        mode: 1,
        vertLine: { labelVisible: true },
        horzLine: { labelVisible: true },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 0,
        barSpacing: 6,
        tickMarkFormatter: (time: UTCTimestamp) => {
          const date = new Date(time * 1000);
          if (interval === 1440) {
            return `${String(date.getUTCDate()).padStart(2, "0")} ${
              [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ][date.getUTCMonth()]
            } ${date.getUTCFullYear()}`;
          }
          return `${String(date.getUTCHours()).padStart(2, "0")}:${String(
            date.getUTCMinutes()
          ).padStart(2, "0")}`;
        },
      },
    });

    chartRef.current = chart;
    const mainSeries = chart.addCandlestickSeries({
      downColor: "#ffffff",
      upColor: "#252626",
      borderVisible: true,
      borderColor: "#252626",
      wickUpColor: "#252626",
      wickDownColor: "#252626",
      priceScaleId: "right",
    });
    mainSeriesRef.current = mainSeries;

    const volumeSeries = chart.addHistogramSeries({
      color: "#26a69a",
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });
    volumeSeriesRef.current = volumeSeries;
    chart.priceScale("volume")?.applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
      visible: true,
      autoScale: true,
    });

    if (chartData.length) {
      mainSeries.setData(formatCandles(chartData));
      volumeSeries.setData(formatVolumes(chartData));

      // Set initial visible range
      const now = Math.floor(Date.now() / 1000) as UTCTimestamp;
      const startTime = (now - interval * 60 * 50) as UTCTimestamp; // Show last 50 intervals initially
      chart.timeScale().setVisibleRange({
        from: startTime,
        to: now,
      });
    }

    chart.subscribeCrosshairMove((param: MouseEventParams) => {
      if (onCrosshairMove && param.time) {
        const candleData = param.seriesData.get(mainSeries) as {
          open: number;
          high: number;
          low: number;
          close: number;
        };
        const volumeData = param.seriesData.get(volumeSeries) as {
          value: number;
        };

        if (candleData) {
          onCrosshairMove({
            time: formatDate(Number(param.time) * 1000, interval),
            open: candleData.open,
            high: candleData.high,
            low: candleData.low,
            close: candleData.close,
            volume: volumeData?.value || 0,
          });
        }
      }
    });

    chart.timeScale().subscribeVisibleLogicalRangeChange(async (range) => {
      if (!range || isFetchingRef.current) return;

      const threshold = -15;
      if (range.from < threshold && chartData.length) {
        isFetchingRef.current = true;
        try {
          console.log("Current chartData:", chartData.slice(0, 5)); // Log first 5 items to see the structure

          // Get the latest timestamp from the visible range
          const visibleRange = chart.timeScale().getVisibleRange();
          if (!visibleRange) return;

          const toTimestamp = Math.floor(Number(visibleRange.from)) * 1000;
          const fromTimestamp = toTimestamp - 1 * ONE_MINUTE * 10;

          console.log("Timestamps:", {
            fromTimestamp: new Date(fromTimestamp).toISOString(),
            toTimestamp: new Date(toTimestamp).toISOString(),
          });

          const moreData = await services.getSubnetChartData(
            0,
            "5m",
            fromTimestamp,
            toTimestamp
          );

          console.log("Fetched data:", moreData?.length || 0, "items");

          if (moreData?.length) {
            // Sort and deduplicate the data by timestamp
            const newData = [...moreData, ...chartData]
              .sort((a, b) => a.time - b.time)
              .filter(
                (item, index, self) =>
                  index === 0 || item.time !== self[index - 1].time
              );

            setChartData(newData);

            mainSeriesRef.current?.setData(formatCandles(newData));
            volumeSeriesRef.current?.setData(formatVolumes(newData));

            // Adjust the visible range more smoothly
            const timeScale = chart.timeScale();
            const visibleRange = timeScale.getVisibleRange();
            if (visibleRange) {
              const newFrom = Math.min(
                fromTimestamp / 1000,
                Number(visibleRange.from)
              ) as UTCTimestamp;
              timeScale.setVisibleRange({
                from: newFrom,
                to: visibleRange.to,
              });
            }
          }
        } finally {
          isFetchingRef.current = false;
        }
      }
    });

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
      chartRef.current = null;
      mainSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, [height, width, interval, onCrosshairMove, chartData]);

  useEffect(() => {
    chartRef.current?.resize(width, height);
  }, [width, height]);

  return (
    <div className="w-full relative">
      <div ref={chartContainerRef} />
    </div>
  );
};

export default TradingChart;
