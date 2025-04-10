import React, { useState } from "react";
import AnimatedContainer from "./AnimatedContainer";
import Button from "../buttons/Button";

interface AnimatedSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  animationType?: "expand" | "slide" | "fade";
  direction?: "up" | "down" | "left" | "right";
}

export default function AnimatedSection({
  title,
  children,
  defaultExpanded = false,
  animationType = "expand",
  direction = "down",
}: AnimatedSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
      <div
        className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-medium">{title}</h3>
        <Button
          label={isExpanded ? "Hide" : "Show"}
          variant="dark"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>

      <AnimatedContainer
        isVisible={isExpanded}
        type={animationType}
        direction={direction}
        className="p-4"
      >
        {children}
      </AnimatedContainer>
    </div>
  );
}
