import { Subnet } from "../../../lib/types";
import SubnetListItem from "../items/SubnetListItem";
import SubnetListColumn from "../items/SubnetListColumn";

export default function SubnetList({
  subnets,
  isUSD,
}: {
  subnets: Subnet[];
  isUSD: boolean;
}) {
  return (
    <div>
      <SubnetListColumn />
      {subnets.map((subnet, index) => (
        <SubnetListItem
          key={index}
          subnet={{ ...subnet, index }}
          isUSD={isUSD}
        />
      ))}
    </div>
  );
}
