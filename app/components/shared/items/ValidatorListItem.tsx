import { taoPrice } from "../../../lib/data";
import { Validator } from "../../../lib/types/validator";
import { formatCompactSimple, formatPercent } from "../../../lib/utils/format";

export default function ValidatorListItem({
  validator,
}: {
  validator: Validator & {
    balance: string;
  };
}) {
  return (
    <div className="flex items-center h-[64px] bg-[var(--bg-dark-3)] rounded-[4px] text-[14px] hover:bg-[var(--bg-dark-15)] mb-[2px] px-[18px]">
      <div className="flex items-center gap-[16px] min-w-[152px] mr-[30px] ">
        <div
          className="w-[24px] h-[24px] rounded-full"
          style={{
            background: `linear-gradient(180deg, #000000 0%, #666666 100%)`,
          }}
        />
        <div>{validator.name}</div>
      </div>

      <div className="mr-[44px] w-[55px] text-center">
        {formatPercent(validator.infra_rating)}
      </div>

      <div className="mr-[45px] w-[60px] text-center">
        {formatPercent(validator.tao_7d_apy)}
      </div>

      <div className="flex flex-col mr-[45px]">
        <div className="text-right">
          {formatCompactSimple(validator.stake)}τ
        </div>
        <div className="text-right">
          {formatCompactSimple(validator.stakeChange)}τ
        </div>
      </div>

      <div className="flex flex-col mr-[45px]">
        <div className="text-right">
          {formatCompactSimple(validator.yield_7d)}τ
        </div>
        <div className="text-right">
          {formatCompactSimple(validator.yield_7d, taoPrice.price)}$
        </div>
      </div>

      <div className="flex flex-col mr-[45px]">
        <div className="text-right">{validator.balance}τ</div>
        <div className="text-right">
          {formatCompactSimple(+validator.balance, taoPrice.price)}$
        </div>
      </div>

      <div className="w-[60px] text-center">{formatPercent(validator.fee)}</div>
    </div>
  );
}
