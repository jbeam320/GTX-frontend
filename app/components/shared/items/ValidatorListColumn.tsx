import SortButton from "../../ui/buttons/SortButton";
import InfoIcon from "/public/icons/info.svg";

const mobileColumns = ["Names", "7d τ APY", "Stake", "7d Yield"];
const desktopColumns = [
  "Names",
  "Infra Rating",
  "7d τ APY",
  "Stake",
  "7d Yield",
  "Balance",
  "Fee",
];

export default function ValidatorListColumn({
  label,
  isAscending,
  onSort,
}: {
  label: string;
  isAscending: boolean | null;
  onSort: (column: string) => void;
}) {
  return (
    <>
      {/* Mobile Columns */}
      <div className="flex md:hidden justify-between w-full px-[8px] h-full">
        {mobileColumns.map((column, index) => (
          <div key={index} className={`${index === 0 ? "w-120px" : ""}`}>
            <SortButton
              label={column}
              isAscending={label === column ? isAscending : null}
              onClick={() => onSort(column)}
            />
          </div>
        ))}
      </div>

      {/* Desktop Columns */}
      <div className="hidden md:flex justify-between w-[732px] h-full ml-[40px]">
        {desktopColumns.map((column, index) => (
          <SortButton
            key={index}
            label={column}
            isAscending={label === column ? isAscending : null}
            icon={column === "Infra Rating" && <InfoIcon />}
            onClick={() => onSort(column)}
          />
        ))}
      </div>
    </>
  );
}
