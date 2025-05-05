import { useTaoPrice } from "../../../hooks";
import { Validator } from "../../../lib/types/validator";
import { formatCompactSimple, formatPercent } from "../../../lib/utils/format";

export default function ValidatorListItem({
  validator,
}: {
  validator: Validator & {
    balance: string;
  };
}) {
  const { taoPrice } = useTaoPrice();

  return (
    <>
      {/* Mobile View */}
      <div className="flex md:hidden items-center justify-between h-[64px] bg-[var(--bg-dark-5)] rounded-[4px] hover:bg-[var(--bg-dark-15)] mb-[2px] px-[8px] md:px-[16px] text-[var(--color-black-secondary)]">
        <div className="flex items-center gap-[8px] basis-[110px]">
          <div
            className="w-[24px] h-[24px] rounded-full"
            style={{
              background: `linear-gradient(180deg, #000000 0%, #666666 100%)`,
            }}
          />
          <div className="text-[12px] font-[400]">{validator.name}</div>
        </div>

        <div className="text-[12px] font-[400]">
          {formatPercent(validator.tao_7d_apy)}
        </div>

        <div className="flex flex-col font-[400]">
          <div className="text-right text-[12px]">
            {formatCompactSimple(validator.stake)}τ
          </div>
          <div className="text-right text-[10px]">
            {formatCompactSimple(validator.stakeChange)}τ
          </div>
        </div>

        <div className="flex flex-col font-[400]">
          <div className="text-right text-[12px]">
            {formatCompactSimple(validator.yield_7d)}τ
          </div>
          <div className="text-right text-[10px]">
            {formatCompactSimple(validator.yield_7d, taoPrice?.price)}$
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex items-center h-[64px] bg-[var(--bg-dark-3)] rounded-[4px] text-[var(--color-black-secondary)] text-[14px] hover:bg-[var(--bg-dark-15)] mb-[2px] px-[18px]">
        <div className="flex items-center gap-[16px] min-w-[152px] mr-[30px]">
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
            {formatCompactSimple(validator.yield_7d, taoPrice?.price)}$
          </div>
        </div>

        <div className="flex flex-col mr-[45px]">
          <div className="text-right">{validator.balance}τ</div>
          <div className="text-right">
            {formatCompactSimple(+validator.balance, taoPrice?.price)}$
          </div>
        </div>

        <div className="w-[60px] text-center">
          {formatPercent(validator.fee)}
        </div>
      </div>
    </>
  );
}
