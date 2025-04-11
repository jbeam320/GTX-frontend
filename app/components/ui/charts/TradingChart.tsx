import {
  createChart,
  IChartApi,
  MouseEventParams,
  UTCTimestamp,
} from "lightweight-charts";
import React, { useEffect, useRef } from "react";

interface ChartData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradingChartProps {
  data: ChartData[];
  height?: number;
  interval?: "5M" | "1H" | "1D";
  width: number;
  isLoading?: boolean;
  onCrosshairMove?: (param: {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }) => void;
}

const formatDate = (
  timestamp: number,
  interval?: "5M" | "1H" | "1D"
): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // For daily interval, show only date
  if (interval === "1D") {
    return `${year}-${month}-${day}`;
  }
  // For other intervals, show date and time
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const TradingChart: React.FC<TradingChartProps> = ({
  data,
  height = 306,
  interval = "1H",
  width = 760,
  isLoading = false,
  onCrosshairMove,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up previous chart instance if it exists
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chartInstance = createChart(chartContainerRef.current, {
      width: width,
      height: height,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          labelVisible: true,
        },
        horzLine: {
          labelVisible: true,
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: UTCTimestamp) => {
          const date = new Date(time * 1000);
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          return `${hours}:${minutes}`;
        },
      },
    });

    chartRef.current = chartInstance;

    // Create price series
    const mainSeries = chartInstance.addCandlestickSeries({
      downColor: "#ffffff",
      upColor: "#252626",
      borderVisible: true,
      borderColor: "#252626",
      wickUpColor: "#252626",
      wickDownColor: "#252626",
      priceScaleId: "right",
    });

    // Configure main price scale to leave room for volume
    const mainPriceScale = chartInstance.priceScale("right");
    if (mainPriceScale) {
      mainPriceScale.applyOptions({
        scaleMargins: {
          top: 0.1, // Leave 10% space from top
          bottom: 0.2, // Leave 20% space for volume
        },
      });
    }

    // Create volume series
    const volumeSeries = chartInstance.addHistogramSeries({
      color: "#26a69a",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "volume",
    });

    // Configure the volume scale
    const volumePriceScale = chartInstance.priceScale("volume");
    if (volumePriceScale) {
      volumePriceScale.applyOptions({
        scaleMargins: {
          top: 0.8, // Start at 80% of the chart height
          bottom: 0.0,
        },
        visible: true,
        autoScale: true,
      });
    }

    // Set the data for main series
    mainSeries.setData(
      data.map((d) => ({
        time: (d.time / 1000) as UTCTimestamp,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }))
    );

    // Set the data for volume series
    volumeSeries.setData(
      data.map((d) => ({
        time: (d.time / 1000) as UTCTimestamp,
        value: d.volume,
        color:
          d.close > d.open
            ? "rgba(37, 38, 38, 0.3)"
            : "rgba(152, 152, 152, 0.3)",
      }))
    );

    // Subscribe to crosshair moves
    chartInstance.subscribeCrosshairMove((param: MouseEventParams) => {
      if (onCrosshairMove && param.time) {
        const candleData = param.seriesData.get(mainSeries) as any;
        const volumeData = param.seriesData.get(volumeSeries) as any;

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

    chartInstance.timeScale().fitContent();

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, height, width, interval, onCrosshairMove]);

  // Update chart size when dimensions change
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize(width, height);
      chartRef.current.timeScale().fitContent();
    }
  }, [width, height]);

  return (
    <div className="w-full">
      <div ref={chartContainerRef} />
    </div>
  );
};

export default TradingChart;
