import React from "react";

interface SubnetModalItemProps {
  token: string;
  subnet: string;
  netuid: string;
  onClick: () => void;
}

const SubnetModalItem: React.FC<SubnetModalItemProps> = ({
  token,
  subnet,
  netuid,
  onClick,
}) => {
  return (
    <div
      className="flex items-center space-between px-[24px] py-[16px] w-[400px] h-[74px] cursor-pointer"
      style={{ backgroundColor: "var(--bg-dark)" }}
      onClick={onClick}
    >
      {/* Left Section */}
      <div className="flex items-center space-x-[16px]">
        {/* Circle Avatar */}
        <div
          className="w-[24px] h-[24px] rounded-full"
          style={{
            background: "linear-gradient(180deg, #9B9B9B 0%, #C9C9C9 100%)",
          }}
        />
        <div className="flex flex-col w-[229px]">
          <div className="text-white text-[20px]">{token}</div>
          <div
            className="text-[12px]"
            style={{ color: "var(--color-light-80)" }}
          >
            {subnet}
          </div>
        </div>
      </div>

      {/* netuid */}
      <div className="text-white text-[14px] w-[72px] text-right">{netuid}</div>
    </div>
  );
};

export default SubnetModalItem;
