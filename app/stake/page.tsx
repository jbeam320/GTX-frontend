"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StakePanel from "./StakePanel";
import ValidatorDashboard from "./ValidatorDashboard";

export default function StakeModalContainer() {
  const [showValidators, setShowValidators] = useState(false);

  return (
    <div className="relative w-full px-4 flex justify-center mt-[100px] min-h-screen">
      {/* Validators Panel */}
      <AnimatePresence>
        {showValidators && (
          <motion.div
            key="validators"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-[60%] mr-5"
          >
            <ValidatorDashboard />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stake Panel */}
      <motion.div
        layout
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-[420px] min-w-[420px]" // 👈 fixed width!
        style={{
          marginLeft: showValidators ? "0px" : "auto", // 👈 pushes to center or right
          marginRight: showValidators ? "0px" : "auto", // 👈 works with flex-center
        }}
      >
        <StakePanel
          onToggle={() => setShowValidators(!showValidators)}
          showValidators={showValidators}
        />
      </motion.div>
    </div>
  );
}
