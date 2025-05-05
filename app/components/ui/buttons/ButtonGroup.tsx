export default function ButtonGroup({
  labels,
  activeButton,
  setActiveButton,
}: {
  labels: string[];
  activeButton: string;
  setActiveButton: (button: string) => void;
}) {
  return (
    <div className="flex gap-[8px] px-[8px] items-center rounded-[5px] border-[1px] border-[var(--border-black)]">
      {labels.map((label) => (
        <button
          key={label}
          className={`text-[12px] cursor-pointer h-[30px] rounded-[4px] font-mono px-[10px] ${
            activeButton === label
              ? "bg-[var(--border-black)] text-[var(--color-light)]"
              : "bg-[var(--bg-light)] text-[var(--color-dark-100)]"
          }`}
          style={{ fontSize: "12px" }}
          onClick={() => setActiveButton(label)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
