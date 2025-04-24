interface ContainerCardProps {
  firstChild: React.ReactNode;
  secondChild: React.ReactNode;
  className?: string;
}

export const ContainerCard = ({
  firstChild,
  secondChild,
  className,
}: ContainerCardProps) => {
  return (
    <div className={`w-full h-[68px] flex items-center relative ${className}`}>
      <span
        className="absolute left-0 w-[45px] h-[45px] rounded-full"
        style={{ background: "var(--gradient-primary-reverse)" }}
      />

      <div className="w-full h-full py-[15px] pr-[18px] pl-[41px] flex bg-[var(--bg-light-15)] rounded-[16px] items-center ml-[22px]">
        <span className="flex-1 text-[15px] font-semibold">{firstChild}</span>
        <span className="flex-1 text-[12px] font-medium">{secondChild}</span>
      </div>
    </div>
  );
};
