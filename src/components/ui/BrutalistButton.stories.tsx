"use client";

import React from "react";
import BrutalistButton from "./BrutalistButton";

// Demo component to showcase different variants
export const BrutalistButtonDemo = () => {
  const handleClick = (buttonType: string) => {
    console.log(`${buttonType} button clicked!`);
  };

  return (
    <div className="min-h-screen bg-brutalist-white p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="font-mono text-4xl font-black uppercase">
          BrutalistButton Component Demo
        </h1>

        {/* Button Variants */}
        <section className="space-y-4">
          <h2 className="font-mono text-2xl font-bold uppercase">
            Button Variants
          </h2>
          <div className="flex flex-wrap gap-4">
            <BrutalistButton
              variant="primary"
              size="md"
              onClick={() => handleClick("Primary")}
            >
              Primary Button
            </BrutalistButton>
            <BrutalistButton
              variant="secondary"
              size="md"
              onClick={() => handleClick("Secondary")}
            >
              Secondary Button
            </BrutalistButton>
            <BrutalistButton
              variant="accent"
              size="md"
              onClick={() => handleClick("Accent")}
            >
              Accent Button
            </BrutalistButton>
          </div>
        </section>

        {/* Button Sizes */}
        <section className="space-y-4">
          <h2 className="font-mono text-2xl font-bold uppercase">
            Button Sizes
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <BrutalistButton
              variant="primary"
              size="sm"
              onClick={() => handleClick("Small")}
            >
              Small
            </BrutalistButton>
            <BrutalistButton
              variant="primary"
              size="md"
              onClick={() => handleClick("Medium")}
            >
              Medium
            </BrutalistButton>
            <BrutalistButton
              variant="primary"
              size="lg"
              onClick={() => handleClick("Large")}
            >
              Large
            </BrutalistButton>
          </div>
        </section>

        {/* Glow Effects */}
        <section className="space-y-4">
          <h2 className="font-mono text-2xl font-bold uppercase">
            Glow Effects
          </h2>
          <div className="flex flex-wrap gap-4">
            <BrutalistButton
              variant="primary"
              size="md"
              glow
              onClick={() => handleClick("Primary Glow")}
            >
              Primary Glow
            </BrutalistButton>
            <BrutalistButton
              variant="secondary"
              size="md"
              glow
              onClick={() => handleClick("Secondary Glow")}
            >
              Secondary Glow
            </BrutalistButton>
            <BrutalistButton
              variant="accent"
              size="md"
              glow
              onClick={() => handleClick("Accent Glow")}
            >
              Accent Glow
            </BrutalistButton>
          </div>
        </section>

        {/* States */}
        <section className="space-y-4">
          <h2 className="font-mono text-2xl font-bold uppercase">
            Button States
          </h2>
          <div className="flex flex-wrap gap-4">
            <BrutalistButton
              variant="primary"
              size="md"
              onClick={() => handleClick("Normal")}
            >
              Normal State
            </BrutalistButton>
            <BrutalistButton
              variant="primary"
              size="md"
              disabled
              onClick={() => handleClick("Disabled")}
            >
              Disabled State
            </BrutalistButton>
          </div>
        </section>

        {/* Accessibility Features */}
        <section className="space-y-4">
          <h2 className="font-mono text-2xl font-bold uppercase">
            Accessibility Features
          </h2>
          <div className="flex flex-wrap gap-4">
            <BrutalistButton
              variant="accent"
              size="md"
              ariaLabel="Submit form"
              onClick={() => handleClick("Accessible")}
            >
              With Aria Label
            </BrutalistButton>
            <BrutalistButton
              variant="secondary"
              size="md"
              type="submit"
              onClick={() => handleClick("Submit")}
            >
              Submit Type
            </BrutalistButton>
          </div>
        </section>

        {/* Custom Styling */}
        <section className="space-y-4">
          <h2 className="font-mono text-2xl font-bold uppercase">
            Custom Styling
          </h2>
          <div className="flex flex-wrap gap-4">
            <BrutalistButton
              variant="primary"
              size="md"
              className="border-red-500 bg-red-500 hover:bg-red-600"
              onClick={() => handleClick("Custom Red")}
            >
              Custom Red
            </BrutalistButton>
            <BrutalistButton
              variant="secondary"
              size="lg"
              className="rounded-lg"
              onClick={() => handleClick("Rounded")}
            >
              Rounded Corners
            </BrutalistButton>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="space-y-4">
          <h2 className="font-mono text-2xl font-bold uppercase">
            Usage Examples
          </h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <BrutalistButton
                variant="accent"
                size="lg"
                glow
                onClick={() => handleClick("CTA")}
              >
                Get Started
              </BrutalistButton>
              <BrutalistButton
                variant="secondary"
                size="lg"
                onClick={() => handleClick("Secondary CTA")}
              >
                Learn More
              </BrutalistButton>
            </div>
            <div className="flex flex-wrap gap-4">
              <BrutalistButton
                variant="primary"
                size="sm"
                onClick={() => handleClick("View Work")}
              >
                View My Work
              </BrutalistButton>
              <BrutalistButton
                variant="accent"
                size="sm"
                onClick={() => handleClick("Contact")}
              >
                Get In Touch
              </BrutalistButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BrutalistButtonDemo;
