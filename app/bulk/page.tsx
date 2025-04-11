import TokenList from "../components/shared/lists/TokenList";
import { subnets } from "../lib/data";

export default function Bulk() {
  return (
    <div>
      <TokenList tokens={subnets} />
    </div>
  );
}
