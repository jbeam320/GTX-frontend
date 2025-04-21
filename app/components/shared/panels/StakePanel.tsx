"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Button from "../../ui/buttons/Button";
import Toggle from "../../ui/toggles/Toggle";
import StakePanelContent from "./StakePanelContent";
import TransactionPanel from "./TransactionPanel";
import CloseIcon from "/public/icons/close-small.svg";
import ViewIcon from "/public/icons/view.svg";

export default function StakePanel({
  handleViewValidators,
  showValidators,
}: {
  handleViewValidators: () => void;
  showValidators: boolean;
}) {
  const [mode, setMode] = useState<"stake" | "unstake">("stake");
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <TransactionPanel
      topNode={
        <Toggle
          firstLabel="STAKE"
          secondLabel="UNSTAKE"
          setMode={(modeNumber) =>
            setMode(modeNumber === 1 ? "stake" : "unstake")
          }
        />
      }
      bottomNode={
        <Button
          label="VIEW VALIDATORS"
          variant="primary"
          onClick={handleViewValidators}
          icon={showValidators ? <CloseIcon /> : <ViewIcon />}
          isRounded={true}
        />
      }
      childrens={
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <StakePanelContent
              isStake={mode === "stake"}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          </motion.div>
        </AnimatePresence>
      }
    />
  );
}
