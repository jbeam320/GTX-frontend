interface DetailProps {
  exclPriceImpact?: number;
  priceImpact?: number;
  inclPriceImpact?: number;
  fee?: number;
}

export default function Detail({
  exclPriceImpact = 48.0,
  priceImpact = -0.489,
  inclPriceImpact = 48.391,
  fee = 0.002,
}: DetailProps) {
  return (
    <div className="pl-[8px]">
      <h3 className="font-[500] text-[14px] font-montserrat mb-[20px] mt-[31px]">
        Transaction Details
      </h3>

      <div className="flex flex-col gap-[10px] font-montserrat text-[12px] font-[500] pr-[21px]">
        <div className="flex justify-between">
          <h4>Value in excl. Price Impact</h4>
          <h4>{exclPriceImpact} USDC</h4>
        </div>

        <div className="flex justify-between">
          <h4>Price Impact on Input</h4>
          <h4>{priceImpact} USDC</h4>
        </div>

        <div className="flex justify-between">
          <h4>Value in incl. Price Impact</h4>
          <h4>{inclPriceImpact} USDC</h4>
        </div>

        <div className="flex justify-between">
          <h4>Transaction Fee</h4>
          <h4>{fee} USDC</h4>
        </div>
      </div>
    </div>
  );
}
