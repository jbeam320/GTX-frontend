export default function WalletInfo({
  walletAddress,
  walletBalance,
  stakedBalance,
}: {
  walletAddress: string;
  walletBalance: string;
  stakedBalance: string;
}) {
  return (
    <div className="flex items-center justify-center gap-[10px] bg-[var(--bg-light)] h-[40px] min-w-[384px] rounded-[8px] px-[12px] py-[3px] border-[1px] border-[var(--border-black-15)]">
      <div className="flex items-center gap-[8px] w-[179px] border-r-[1px] border-[var(--border-dark-70)]">
        <div
          className="w-[27px] h-[27px] rounded-full"
          style={{
            background: "linear-gradient(180deg, #000000 0%, #666666 100%)",
          }}
        />
        <span className="font-mono text-[14px]">
          {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-6)}`}
        </span>
      </div>

      <div className="flex flex-col items-end">
        <div className="text-[12px] font-mono">
          <span className="text-[var(--color-black)]">STAKED BALANCE: </span>
          <span>{stakedBalance}τ</span>
        </div>
        <div className="text-[12px] font-mono">
          <span className="text-[var(--color-black)]">WALLET BALANCE: </span>
          <span>{walletBalance}τ</span>
        </div>
      </div>
    </div>
  );
}
