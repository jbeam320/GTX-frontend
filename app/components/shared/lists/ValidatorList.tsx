import React, { useEffect, useState } from "react";
import ValidatorListItem from "../items/ValidatorListItem";
import ValidatorListColumn from "../items/ValidatorListColumn";
import { Validator } from "../../../lib/types/validator-type";
import { useWalletStore } from "../../../stores/store";

interface ValidatorListProps {
  validators: Validator[];
}

// add balance to validator type
type ExtendedValidator = Validator & {
  balance: string;
};

export default function ValidatorList({ validators }: ValidatorListProps) {
  const { getValidatorStake, walletAddress, api } = useWalletStore();
  const [validatorStakes, setValidatorStakes] = useState<
    Record<string, string>
  >({});

  const [isAscending, setIsAscending] = useState<boolean | null>(null);
  const [sortedColumn, setSortedColumn] = useState<string>("Names");
  const [data, setData] = useState<ExtendedValidator[]>([]);

  useEffect(() => {
    if (!walletAddress || !api) return;

    validators.forEach(async (validator) => {
      const stake = await getValidatorStake(validator.hotkey, 0);
      if (stake) {
        setValidatorStakes((prev) => ({ ...prev, [validator.hotkey]: stake }));
      }
    });
  }, [getValidatorStake, validators, walletAddress, api]);

  useEffect(() => {
    setData(
      validators.map((validator) => ({
        ...validator,
        balance: validatorStakes[validator.hotkey] || "0",
      }))
    );
  }, [validators, validatorStakes]);

  const handleSort = (column: string) => {
    setSortedColumn(column);
    setIsAscending(!isAscending); // Toggle sorting direction (ascending/descending)
  };

  const sortedValidators = [...data].sort((a, b) => {
    const columnKey = sortedColumn as keyof ExtendedValidator;
    const aValue = a[columnKey];
    const bValue = b[columnKey];

    if (isAscending) {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });

  return (
    <div className="overflow-y-auto bg-[var(--bg-light)] rounded-[8px] border-[var(--border-black-15)] border-[1px] w-[792px] max-h-[844px] px-[8px]">
      {/* title */}
      <div className="text-[20px] text-[var(--color-black)] px-[8px] py-[16px] border-b-[var(--border-dark)] border-b-[1px]">
        VALIDATORS
      </div>

      {/* Column Headers */}
      <ValidatorListColumn
        label={sortedColumn}
        isAscending={isAscending}
        onSort={handleSort}
      />

      {/* Validator List */}
      <div>
        {sortedValidators.map((validator, index) => (
          <ValidatorListItem key={index} validator={validator} />
        ))}
      </div>
    </div>
  );
}
