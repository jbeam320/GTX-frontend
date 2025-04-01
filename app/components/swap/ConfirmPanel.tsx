import { Token } from "../../utils/types";

interface ConfirmPanelProps {
  fromToken: Token | null;
  toToken: Token | null;
  amount: string;
}

export default function ConfirmPanel({
  fromToken,
  toToken,
  amount,
}: ConfirmPanelProps) {
  if (!fromToken || !toToken || !amount) {
    return (
      <button
        className="mt-4 w-full py-2 bg-gray-300 text-white rounded cursor-not-allowed"
        disabled
      >
        SELECT TOKENS
      </button>
    );
  }

  return (
    <div className="mt-4">
      <div className="text-xs text-gray-500">
        {amount} {fromToken.symbol} = 1.62 {toToken.symbol} ($400.33 USD){" "}
        <span className="text-green-500">+45.04%</span>
      </div>
      <button className="w-full mt-2 py-2 bg-black text-white rounded">
        CONFIRM
      </button>
    </div>
  );
}
