import ValidatorTable from "./ValidatorTable";
import { Card } from "../components/base";
import { taoPrice } from "../utils/data";
import { formatPercent, formatNumberForCard } from "../utils/format";

export default function ValidatorDashboard() {
  // const { taoPrice } = useWallet();
  const price_percent = formatPercent(taoPrice.percent_24h_change);

  return (
    <div className="flex flex-col gap-6">
      {/* 4 Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card
          title="BITTENSOR PRICE"
          content={`$${formatNumberForCard(taoPrice.price)}`}
          sub={price_percent}
        />
        <Card
          title="MARKET CAP"
          content={`$${formatNumberForCard(taoPrice.market_cap)}`}
          sub={price_percent}
        />
        <Card
          title="24H VOLUME"
          content={`$${formatNumberForCard(taoPrice.volume_24h)}`}
          sub={price_percent}
        />
        <Card title="STAKED SUPPLY" content="72.50%" sub={price_percent} />
      </div>

      {/* Table */}
      <div className="overflow-auto bg-white rounded-xl shadow">
        <ValidatorTable />
      </div>
    </div>
  );
}
