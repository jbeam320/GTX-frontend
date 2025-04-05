"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StakePanel from "../components/shared/panels/StakePanel";
import ValidatorDashboard from "../components/shared/dashboards/ValidatorDashboard";
import { Container } from "@mantine/core";

export default function StakeModalContainer() {
  const [showValidators, setShowValidators] = useState(false);

  return (
    <Container size="xl" className="py-[100px]">
      <div className="w-full flex justify-between">
        {/* Validators Dashboard */}
        <AnimatePresence>
          {showValidators && (
            <motion.div
              key="validators"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-[60%] mr-[20px]"
            >
              <ValidatorDashboard />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stake Panel */}
        <motion.div
          layout
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            marginLeft: showValidators ? "0px" : "auto",
            marginRight: showValidators ? "0px" : "auto",
          }}
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
