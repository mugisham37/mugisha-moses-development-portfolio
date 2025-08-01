"use client";

import React from "react";
import BrutalistCard from "./BrutalistCard";

// Demo component to showcase different variants
export const BrutalistCardDemo = () => {
  return (
    <div className="min-h-screen bg-brutalist-white p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="font-mono text-4xl font-black uppercase">
          BrutalistCard Component Demo
        </h1>

        {/* Basic Cards */}
        <section className="space-y-4">
          <h2 className="font-mono text-2xl font-bold uppercase">
            Basic Cards
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <BrutalistCard
              title="Default Card"
              description="This is a basic brutalist card with default styling and lift hover effect."
            />
            <BrutalistCard
              title="Accent Card"
              description="This card uses the accent styling with yellow background."
              accent
            />
            <BrutalistCard
              title="With Children"
              description="This card demonstrates how children content is displayed."
            >
              <div className="space-y-2">
                <p className="text-xs">Additional content goes here</p>
                <div className="flex gap-2">
                  <span className="rounded bg-black px-2 py-1 text-xs text-white">
                    Tag 1
                  </span>
                  <span className="rounded bg-black px-2 py-1 text-xs text-white">
                    Tag 2
                  </span>
                </div>
              </div>
            </BrutalistCard>
          </div>
        </section>

        {/* Hover Effects */}
        <section className="space-y-4">
          <h2 className="font-mono text-2xl font-bold uppercase">
            Hover Effects
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <BrutalistCard
              title="Lift Effect"
              description="Hover to see the lift animation with shadow."
              hover="lift"
            />
            <BrutalistCard
              title="Glow Effect"
              description="Hover to see the glow animation with yellow shadow."
              hover="glow"
            />
            <BrutalistCard
              title="Invert Effect"
              description="Hover to see the color inversion effect."
              hover="invert"
            />
          </div>
        </section>

        {/* Interactive Cards */}
        <section className="space-y-4">
          <h2 className="font-mono text-2xl font-bold uppercase">
            Interactive Cards
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <BrutalistCard
              title="Clickable Card"
              description="This card is clickable and shows cursor pointer on hover."
              hover="glow"
              onClick={() => alert("Card clicked!")}
            />
            <BrutalistCard
              title="Custom Styling"
              description="This card demonstrates custom className usage."
              className="border-red-500 bg-red-100"
              hover="lift"
            />
          </div>
        </section>

        {/* Enhanced Color Features */}
        <section className="space-y-4">
          <h2 className="font-mono text-2xl font-bold uppercase">
            Enhanced Color Features
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <BrutalistCard
              title="High Contrast Mode"
              description="This card uses high contrast mode for better accessibility."
              highContrast
              hover="lift"
            />
            <BrutalistCard
              title="Custom Colors"
              description="This card demonstrates custom color combinations with accessibility validation."
              customColors={{
                background: "#2a2a2a",
                text: "#ffffff",
                border: "#ffff00",
              }}
              hover="glow"
            />
            <BrutalistCard
              title="Theme Aware"
              description="This card automatically adapts to light/dark theme with enhanced contrast."
              accent
              hover="invert"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default BrutalistCardDemo;
