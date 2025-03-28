import ValidatorTable from "./ValidatorTable";
import { Card } from "../components/base";

export default function ValidatorDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* 4 Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card title="Bittensor Price" content="$356.45" sub="+0.17%" />
        <Card title="Market Cap" content="$2,990,275,347" sub="+0.17%" />
        <Card title="24H Volume" content="$241,916,302" sub="+0.17%" />
        <Card title="Staked Supply" content="72.50%" sub="+0.17%" />
      </div>

      {/* Table */}
      <div className="overflow-auto bg-white rounded-xl shadow">
        <ValidatorTable />
      </div>
    </div>
  );
}
