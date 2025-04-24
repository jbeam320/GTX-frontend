import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { TokenForBulk } from "../../../lib/types";
import Toggle from "../../ui/toggles/Toggle";
import QuotePanelContent from "./QuotePanelContent";
import InfoIcon from "/public/icons/info-light.svg";
import WhiteInfoIcon from "/public/icons/info-white.svg";
import WhiteNukeIcon from "/public/icons/nuke-white.svg";
import NukeIcon from "/public/icons/nuke.svg";
interface QuotePanelProps {
  tokens: TokenForBulk[];
  viewForMobile?: boolean;
  onToggle?: (mode: "Standard" | "Nuke") => void;
  onClear: () => void;
  onTokenSelect: () => void;
  setTokens(tokens: TokenForBulk[]): void;
}

export default function QuotePanel({
  tokens,
  onClear,
  onToggle,
  onTokenSelect,
  setTokens,
  viewForMobile,
}: QuotePanelProps) {
  const [mode, setMode] = useState<"Standard" | "Nuke">("Standard");
  const [errors, setErrors] = useState<{ [key: number]: string }>({});

  const handleToggle = (mode: number) => {
    handleClear();
    onToggle?.(mode === 1 ? "Standard" : "Nuke");
    mode === 1 ? setMode("Standard") : setMode("Nuke");
  };

  const handleClear = () => {
    onClear();
    setErrors({});
  };

  return (
    <div
      className={`${
        viewForMobile ? "max-[400px]:w-full" : "max-md:hidden"
      } flex items-center flex-col gap-[28px] w-[383px] h-full rounded-[8px] border-[1px] border-[var(--border-dark)] font-montserrat p-[13px] font-[500] relative`}
    >
      <div className="flex items-center justify-center">
        <label className="text-[18px] font-[500]">Quote</label>
        <button
          className="cursor-pointer w-[67px] h-[25px] rounded-[16px] absolute right-[15px] border-[1px] p-[10px] text-center flex items-center justify-center"
          style={{ fontSize: "12px" }}
          onClick={handleClear}
        >
          Clear
        </button>
      </div>

      <Toggle
        firstLabel="Standard"
        secondLabel="Nuke"
        firstStyle={{
          width: "154px",
          height: "40px",
          backgroundColor:
            mode === "Standard" ? "var(--bg-light)" : "var(--bg-dark-6)",
          color: "var(--color-black)",
          border: "none",
          borderLeft:
            mode === "Standard" ? "1px solid var(--color-black)" : "none",
          borderRight:
            mode === "Standard" ? "1px solid var(--color-black)" : "none",
        }}
        secondStyle={{
          width: "154px",
          height: "40px",
          backgroundColor:
            mode === "Nuke" ? "var(--bg-dark-7)" : "var(--bg-dark-6)",
          color: mode === "Nuke" ? "var(--color-light)" : "var(--color-dark-2)",
          border: "none",
        }}
        secondIcons={
          mode === "Standard"
            ? [<NukeIcon />, <InfoIcon />]
            : [<WhiteNukeIcon />, <WhiteInfoIcon />]
        }
        setMode={handleToggle}
        style={{
          fontWeight: "500",
          fontSize: "16px",
          border:
            mode === "Standard"
              ? "1px solid var(--color-black)"
              : "1px solid var(--bg-dark-1)",
          backgroundColor: "var(--bg-dark-6)",
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          className="w-full"
          key={mode}
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <QuotePanelContent
            errors={errors}
            mode={mode}
            tokens={tokens}
            setTokens={setTokens}
            setErrors={setErrors}
            onTokenSelect={onTokenSelect}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
    </div>
  );
}
