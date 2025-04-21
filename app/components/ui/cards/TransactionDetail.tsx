import React, { useState } from "react";
import AnimatedContainer from "../animations/AnimatedContainer";
import ArrowDown from "/public/icons/arrow-down.svg";
import ArrowUp from "/public/icons/arrow-up.svg";

interface TransactionDetailProps {
  tokenAmount: string;
  usdAmount: string;
  percentageChange?: string;
  fee?: string;
  priceImpact?: string;
  slippageTolerance?: string;
  isFromAlpha?: boolean;
  alphaAmount?: string;
  isShow?: boolean;
  [key: string]: any;
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({
  tokenAmount,
  usdAmount,
  percentageChange = "+45.04%",
  fee = "0.00005",
  priceImpact = "0.08%",
  slippageTolerance = "0.99%",
  isFromAlpha = true,
  alphaAmount,
  isShow = true,
  ...restProps
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className="w-[366px] bg-[var(--bg-light)] font-[Contango Black] color-[var(--color-black-secondary)] text-[12px]"
      {...restProps}
    >
      {/* Main details (Token + Percentage) */}
      <div className={`${isShow ? "visible" : "invisible"}`}>
        <div className="text-[var(--color-dark)] text-[14px] mb-[8px] text-center">
          TRANSACTION DETAILS
        </div>

        <div className="flex justify-between items-center relative">
          <div className={`flex justify-center w-full`}>
            {isFromAlpha ? `${alphaAmount} ALPHA` : `${tokenAmount} TAO`} =
            {isFromAlpha ? `${tokenAmount} TAO` : `${alphaAmount} ALPHA`} (
            {usdAmount} USD) &nbsp;
            <div className="bg-[var(--bg-secondary)] text-[var(--color-black-secondary)]">
              {percentageChange}
            </div>
          </div>

          <button
            onClick={handleToggle}
            className="cursor-pointer absolute right-[8px]"
          >
            {isExpanded ? <ArrowUp /> : <ArrowDown />}
          </button>
        </div>
      </div>

      <AnimatedContainer isVisible={isExpanded} type="slide" direction="up">
        <div>
          <div className="flex justify-between mt-[24px]">
            <span>FEE</span>
            <span>{fee}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span>PRICE IMPACT</span>
            <span>{priceImpact}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span>SLIPPAGE TOLERANCE</span>
            <span>{slippageTolerance}</span>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default TransactionDetail;
