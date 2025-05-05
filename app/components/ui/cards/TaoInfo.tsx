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
    <div className="bg-[var(--bg-dark-5)] rounded-[4px] p-[10px] flex flex-col items-center justify-center gap-[8px] w-full md:w-[184px] h-[89px] font-mono font-[400]">
      <div className="text-[12px] text-[var(--color-dark-70)]">{label}</div>
      <div className="text-[16px] text-[var(--color-black-secondary)] font-[400] font-mono">
        {value}
      </div>
      <div className="text-[12px] text-[var(--color-dark-70)]">
        {percentage}
      </div>
    </div>
  );
}
