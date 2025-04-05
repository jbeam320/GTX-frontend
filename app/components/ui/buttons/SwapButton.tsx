import SwapIcon1 from "/public/icons/swap1.svg";
import SwapIcon2 from "/public/icons/swap2.svg";
interface SwapButtonProps {
  isFromStaked?: boolean;
  onClick: () => void;
}

export default function SwapButton({
  isFromStaked = true,
  onClick,
}: SwapButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-[151px] h-[60px] bg-[var(--bg-dark-8)] rounded-[16px] flex items-center justify-between px-[12px] py-[10px]"
    >
      <div
        className={`w-[32px] h-[32px] rounded-full`}
        style={{
          background: isFromStaked
            ? "linear-gradient(180deg, #9B9B9B 0%, #C9C9C9 100%)"
            : "linear-gradient(180deg, #000000 0%, #666666 100%)",
        }}
      />

      {isFromStaked ? <SwapIcon1 /> : <SwapIcon2 />}

      <div
        className={`w-[32px] h-[32px] rounded-full`}
        style={{
          background: isFromStaked
            ? "linear-gradient(180deg, #000000 0%, #666666 100%)"
            : "linear-gradient(180deg, #9B9B9B 0%, #C9C9C9 100%)",
        }}
      />
    </button>
  );
}
