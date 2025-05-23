"use client";

import { ReactNode, useEffect, useState } from "react";
import Button from "../buttons/Button";

export default function Toggle({
  firstLabel,
  secondLabel,
  setMode,
  firstStyle,
  secondStyle,
  firstIcons,
  secondIcons,
  ...restProps
}: {
  firstLabel: string;
  secondLabel: string;
  firstStyle?: {};
  secondStyle?: {};
  firstIcons?: ReactNode[];
  secondIcons?: ReactNode[];
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
      className="rounded-full overflow-hidden flex shadow max-w-fit outline-none"
      style={{ border: "1px solid var(--border-dark)" }}
      {...restProps}
    >
      <Button
        label={firstLabel}
        variant={toggleState === 1 ? "dark" : "disabled"}
        fontSize="18px"
        isRounded={true}
        border={toggleState === 1 ? "1px solid var(--border-dark)" : "none"}
        onClick={() => setToggleState(1)}
        width="154px"
        height="43px"
        icon={firstIcons?.[0]}
        icon2={firstIcons?.[1]}
        {...firstStyle}
      />
      <Button
        label={secondLabel}
        variant={toggleState === 2 ? "dark" : "disabled"}
        fontSize="18px"
        isRounded={true}
        border={toggleState === 2 ? "1px solid var(--border-dark)" : "none"}
        onClick={() => setToggleState(2)}
        width="154px"
        height="43px"
        icon={secondIcons?.[0]}
        icon2={secondIcons?.[1]}
        {...secondStyle}
      />
    </div>
  );
}
