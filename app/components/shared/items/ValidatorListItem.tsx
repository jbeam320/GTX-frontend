import { Validator } from "../../../lib/types/validator-type";
import { taoPrice } from "../../../lib/data";
import { formatPercent, formatCompactSimple } from "../../../lib/utils/format";

export default function ValidatorListItem({
  validator,
}: {
  validator: Validator & {
    balance: string;
  };
}) {
  return (
    <div className="flex items-center justify-between w-[776px] h-[64px] bg-[var(--bg-dark-3)] rounded-[4px] text-[14px] hover:bg-[var(--bg-dark-15)] mb-[2px] px-[18px]">
      <div className="flex items-center gap-[16px]">
        <div
          className="w-[24px] h-[24px] rounded-full"
          style={{
            background: `linear-gradient(180deg, #000000 0%, #666666 100%)`,
          }}
        />
        <div>{validator.name}</div>
      </div>

      <div>{formatPercent(validator.infra_rating)}</div>

      <div>{formatPercent(validator.tao_7d_apy)}</div>

      <div className="flex flex-col">
        <div className="text-right">
          {formatCompactSimple(validator.stake)}τ
        </div>
        <div className="text-right">
          {formatCompactSimple(validator.stakeChange)}τ
        </div>
      </div>

      <div className="flex flex-col">
        <div className="text-right">
          {formatCompactSimple(validator.yield_7d)}τ
        </div>
        <div className="text-right">
          {formatCompactSimple(validator.yield_7d, taoPrice.price)}$
        </div>
      </div>

      <div className="flex flex-col">
        <div className="text-right">{validator.balance}τ</div>
        <div className="text-right">
          {formatCompactSimple(+validator.balance, taoPrice.price)}$
        </div>
      </div>

      <div>{formatPercent(validator.fee)}</div>
    </div>
  );
}
