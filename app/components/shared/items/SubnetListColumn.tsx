export default function SubnetListColumn() {
  return (
    <div className="font-montserrat text-[13px] w-[1200px] h-[65px] bg-[var(--bg-light)] border-t-[1px] border-[var(--color-black)] flex justify-between items-center">
      <div className="p-[10px] mr-[205px]"># &nbsp; Subnet</div>
      <div className="mr-[69px]">Emission</div>
      <div className="mr-[53px]">Price</div>
      <div className="mr-[84px]">1H</div>
      <div className="mr-[72px]">24H</div>
      <div className="mr-[45px]">1W</div>
      <div className="p-[10px]">Market Cap</div>
      <div className="p-[10px]">Volume (24h)</div>
      <div className="p-[10px]">Liquidity</div>
      <div className="p-[10px]">Last 7 days</div>
    </div>
  );
}
