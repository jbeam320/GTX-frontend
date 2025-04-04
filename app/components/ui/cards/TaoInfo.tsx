export default function TaoInfo({
  label,
  value,
  percentage,
}: {
  label: string;
  value: string;
  percentage: string;
}) {
  return (
    <div className="bg-[var(--bg-dark-5)] rounded-[4px] p-[10px] flex flex-col items-center justify-center space-y-[8px] w-[184px] h-[89px]">
      <div className="text-[12px] text-[var(--color-dark-70)]">{label}</div>
      <div className="text-[16px] text-[var(--color-dark)]">{value}</div>
      <div className="text-[12px] text-[var(--color-dark-70)]">
        {percentage}
      </div>
    </div>
  );
}
