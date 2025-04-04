import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AnimationType = "expand" | "slide" | "fade";

interface AnimatedContainerProps {
  isVisible: boolean;
  children: React.ReactNode;
  duration?: number;
  className?: string;
  initialHeight?: number;
  type?: AnimationType;
  direction?: "up" | "down" | "left" | "right";
}

export default function AnimatedContainer({
  isVisible,
  children,
  duration = 0.3,
  className = "",
  initialHeight = 0,
  type = "expand",
  direction = "down",
}: AnimatedContainerProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(initialHeight);

  useEffect(() => {
    if (contentRef.current && type === "expand") {
      setHeight(isVisible ? contentRef.current.scrollHeight : initialHeight);
    }
  }, [isVisible, children, initialHeight, type]);

  const getAnimationProps = () => {
    if (type === "expand") {
      return {
        initial: { height: initialHeight },
        animate: { height },
        exit: { height: initialHeight },
        transition: { duration, ease: "easeInOut" },
      };
    }

    if (type === "slide") {
      const directionMap = {
        up: { y: -20, x: 0 },
        down: { y: 20, x: 0 },
        left: { x: -20, y: 0 },
        right: { x: 20, y: 0 },
      };

      return {
        initial: {
          opacity: 0,
          ...directionMap[direction],
        },
        animate: {
          opacity: 1,
          x: 0,
          y: 0,
        },
        exit: {
          opacity: 0,
          ...directionMap[direction],
        },
        transition: { duration, ease: "easeInOut" },
      };
    }

    // fade animation
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration, ease: "easeInOut" },
    };
  };

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          className={`overflow-hidden ${className}`}
          {...getAnimationProps()}
        >
          {type === "expand" ? (
            <div ref={contentRef}>{children}</div>
          ) : (
            children
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
