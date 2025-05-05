"use client";

import { Container } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import ValidatorDashboard from "../components/shared/dashboards/ValidatorDashboard";
import StakePanel from "../components/shared/panels/StakePanel";

export default function StakeModalContainer() {
  const [showValidators, setShowValidators] = useState(false);

  return (
    <Container size="1245px" className="mt-[140px] md:mt-[100px]">
      <div className="w-full flex flex-col md:flex-row md:justify-between">
        {/* Validators Dashboard */}
        <AnimatePresence>
          {showValidators && (
            <motion.div
              key="validators"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="max-md:mt-[60px] mb-[20px] order-2 md:order-1"
            >
              <ValidatorDashboard />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stake Panel */}
        <motion.div
          layout
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="order-1 md:order-2 m-auto"
        >
          <StakePanel
            handleViewValidators={() => setShowValidators(!showValidators)}
            showValidators={showValidators}
          />
        </motion.div>
      </div>
    </Container>
  );
}
