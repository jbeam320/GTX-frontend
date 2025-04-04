import SortButton from "../../ui/buttons/SortButton";
import InfoIcon from "/public/icons/info.svg";

const columns = [
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
    <div className="flex justify-between w-[732px] h-full  my-[8px] ml-[30px]">
      {columns.map((column, index) => (
        <SortButton
          key={index}
          label={column}
          isAscending={label === column ? isAscending : null}
          icon={column === "Infra Rating" && <InfoIcon />}
          onClick={() => onSort(column)}
        />
      ))}
    </div>
  );
}
