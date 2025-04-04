import React from "react";

export default function TransactionPanel({
  topNode,
  bottomNode,
  childrens,
}: {
  topNode: React.ReactNode;
  bottomNode: React.ReactNode;
  childrens?: React.ReactNode;
}) {
  return (
    <div className="w-[398px] rounded-[8px] bg-[var(--bg-light)] border-[var(--border-black-15)] border-[1px] px-[17px] pt-[68px] pb-[59px] relative flex flex-col justify-center">
      <div
        className={`absolute -top-5 left-1/2 -translate-x-1/2 flex items-center`}
      >
        {topNode}
      </div>

      {childrens && childrens}

      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center">
        {bottomNode}
      </div>
    </div>
  );
}
