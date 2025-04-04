"use client";

import { useEffect, useState } from "react";
import Button from "../buttons/Button";

export default function Toggle({
  firstLabel,
  secondLabel,
  setMode,
  ...restProps
}: {
  firstLabel: string;
  secondLabel: string;
  setMode?: (modeNumber: 1 | 2) => void;
  [key: string]: any;
}) {
  const [toggleState, setToggleState] = useState<1 | 2>(1);

  useEffect(() => {
    if (setMode) {
      setMode(toggleState);
    }
  }, [toggleState]);

  return (
    <div
      className="rounded-full overflow-hidden flex shadow max-w-fit"
      style={{ border: "1px solid var(--border-dark)" }}
      {...restProps}
    >
      <Button
        label={firstLabel}
        variant={toggleState === 1 ? "dark" : "disabled"}
        fontFamily="dm-mono"
        isRounded={true}
        size="medium"
        onClick={() => setToggleState(1)}
      />
      <Button
        label={secondLabel}
        variant={toggleState === 2 ? "dark" : "disabled"}
        fontFamily="dm-mono"
        isRounded={true}
        size="medium"
        onClick={() => setToggleState(2)}
      />
    </div>
  );
}
