import ValidatorTable from "./ValidatorTable";

export default function ValidatorDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* 4 Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card title="Bittensor Price" value="$356.45" sub="+0.17%" />
        <Card title="Market Cap" value="$2,990,275,347" sub="+0.17%" />
        <Card title="24H Volume" value="$241,916,302" sub="+0.17%" />
        <Card title="Staked Supply" value="72.50%" sub="+0.17%" />
      </div>

      {/* Table */}
      <div className="overflow-auto bg-white rounded-xl shadow">
        <ValidatorTable />
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow-sm text-center">
      <div className="text-[10px] tracking-wide uppercase font-mono text-gray-400 mb-2">
        {title}
      </div>
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-[10px] text-gray-400 mt-1">{sub}</div>
    </div>
  );
}
