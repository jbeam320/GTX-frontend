import TokenList from "../components/shared/lists/TokenList";
import { subnets } from "../lib/data";

export default function Bulk() {
  return (
    <div className="flex items-center justify-center gap-[4px] mt-[70px]">
      <TokenList tokens={subnets} />
      <div>ss</div>
    </div>
  );
}
