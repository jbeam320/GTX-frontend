export default function SubnetListColumn() {
  return (
    <div className="font-montserrat text-[13px] w-full md:w-[1200px] h-[65px] bg-[var(--bg-light)] md:border-t-[1px] border-[var(--color-black)] flex justify-between items-center px-6 md:px-0">
      <div className="p-[10px] mr-[20px] md:mr-[160px] max-md:hidden">
        # &nbsp; Subnet
      </div>
      <div className="p-[10px] mr-[20px] md:hidden">Name</div>

      <div className="hidden md:block mr-[70px]">Emission</div>

      <div className="mr-[20px] md:mr-[60px]">Price</div>
      <div className="hidden md:block mr-[70px]">1H</div>
      <div className="mr-[20px] md:mr-[60px]">24H</div>
      <div className="hidden md:block mr-[35px]">1W</div>

      <div className="p-[10px] max-md:hidden">Market Cap</div>
      <div className="p-[10px] md:hidden">M. Cap</div>

      <div className="hidden md:block p-[10px]">Volume (24h)</div>
      <div className="hidden md:block p-[10px]">Liquidity</div>
      <div className="hidden md:block p-[10px]">Last 7 days</div>
    </div>
  );
}
