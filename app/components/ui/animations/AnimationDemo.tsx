import React, { useState } from "react";
import { AnimatedSection } from "./index";
import Button from "../buttons/Button";

export default function AnimationDemo() {
  const [activeTab, setActiveTab] = useState<"expand" | "slide" | "fade">(
    "expand"
  );
  const [direction, setDirection] = useState<"up" | "down" | "left" | "right">(
    "down"
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Animation Demo</h2>

      <div className="mb-6 flex space-x-2">
        <Button
          label="Expand"
          variant={activeTab === "expand" ? "primary" : "dark"}
          onClick={() => setActiveTab("expand")}
        />
        <Button
          label="Slide"
          variant={activeTab === "slide" ? "primary" : "dark"}
          onClick={() => setActiveTab("slide")}
        />
        <Button
          label="Fade"
          variant={activeTab === "fade" ? "primary" : "dark"}
          onClick={() => setActiveTab("fade")}
        />
      </div>

      {activeTab === "slide" && (
        <div className="mb-6 flex space-x-2">
          <Button
            label="Up"
            variant={direction === "up" ? "primary" : "dark"}
            onClick={() => setDirection("up")}
          />
          <Button
            label="Down"
            variant={direction === "down" ? "primary" : "dark"}
            onClick={() => setDirection("down")}
          />
          <Button
            label="Left"
            variant={direction === "left" ? "primary" : "dark"}
            onClick={() => setDirection("left")}
          />
          <Button
            label="Right"
            variant={direction === "right" ? "primary" : "dark"}
            onClick={() => setDirection("right")}
          />
        </div>
      )}

      <AnimatedSection
        title="Expand Animation"
        animationType="expand"
        defaultExpanded={activeTab === "expand"}
      >
        <p>
          This section uses the expand animation. The content smoothly expands
          and collapses when toggled.
        </p>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h4 className="font-medium">Sample Content</h4>
          <p>
            This is some sample content that will be shown or hidden with
            animation.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection
        title="Slide Animation"
        animationType="slide"
        direction={direction}
        defaultExpanded={activeTab === "slide"}
      >
        <p>
          This section uses the slide animation. The content slides in from the{" "}
          {direction} direction.
        </p>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h4 className="font-medium">Sample Content</h4>
          <p>
            This is some sample content that will slide in and out with
            animation.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection
        title="Fade Animation"
        animationType="fade"
        defaultExpanded={activeTab === "fade"}
      >
        <p>
          This section uses the fade animation. The content fades in and out
          when toggled.
        </p>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h4 className="font-medium">Sample Content</h4>
          <p>
            This is some sample content that will fade in and out with
            animation.
          </p>
        </div>
      </AnimatedSection>
    </div>
  );
}
