import ChevronDownIcon from "/public/icons/chevron-down.svg";
import ChevronLeftIcon from "/public/icons/chevron-left.svg";
import ChevronUpIcon from "/public/icons/chevron-up.svg";

export default function SortButton({
  label,
  isAscending = null,
  icon,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  isAscending?: boolean | null;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center text-center p-[10px] space-x-[10px] bg-[var(--bg-light)] ${
        isAscending === null
          ? "text-[var(--color-dark-70)]"
          : "text-[var(--bg-dark)]"
      }`}
      style={{ fontSize: "12px" }}
    >
      <div className="flex items-center gap-[8px]">
        {label}
        {icon}
      </div>

      <div>
        {isAscending === null ? (
          <ChevronLeftIcon />
        ) : isAscending ? (
          <ChevronUpIcon />
        ) : (
          <ChevronDownIcon />
        )}
      </div>
    </button>
  );
}
