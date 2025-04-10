import TradingChartContainer from "../components/shared/dashboards/TradingChartDashBoard";

export default function Bulk() {
  return (
    <div>
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
  );
}
