import SearchIcon from "/public/icons/search-dark.svg";

export default function SearchInput({
  onChange,
  ...restProps
}: {
  onChange?: (value: string) => void;
  [key: string]: any;
}) {
  return (
    <div
      className="bg-[var(--bg-dark-6)] border-[1px] border-[var(--bg-dark-1)] py-[10px] px-[23px] w-full md:w-[282px] rounded-[16px] flex items-center"
      {...restProps}
    >
      <SearchIcon />
      <input
        className="outline-none mx-[12px]"
        placeholder="Search a subnet"
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
