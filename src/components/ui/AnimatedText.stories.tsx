"use client";

import React, { useState } from "react";
import AnimatedText from "./AnimatedText";

// Demo component to showcase different variants
export const AnimatedTextDemo = () => {
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-brutalist-white p-8">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="text-center">
          <h1 className="font-mono text-4xl font-black uppercase mb-4">
            AnimatedText Component Demo
          </h1>
          <button
            onClick={handleReset}
            className="border-3 border-black bg-brutalist-yellow px-4 py-2 font-mono font-bold uppercase hover:bg-black hover:text-yellow-400 transition-colors"
          >
            Reset Animations
          </button>
        </div>

        {/* Typing Animation */}
        <section className="space-y-6">
          <h2 className="font-mono text-2xl font-bold uppercase border-b-3 border-black pb-2">
            Typing Animation
          </h2>
          <div className="space-y-4">
            <div className="border-5 border-black p-6 bg-white">
              <h3 className="font-mono text-lg font-bold mb-4">
                Basic Typing:
              </h3>
              <div className="text-2xl font-mono font-bold">
                <AnimatedText
                  key={`typing-basic-${resetKey}`}
                  text="I Build Digital Experiences That Convert"
                  variant="typing"
                  speed={80}
                />
              </div>
            </div>

            <div className="border-5 border-black p-6 bg-white">
              <h3 className="font-mono text-lg font-bold mb-4">
                Typing with Delay:
              </h3>
              <div className="text-xl font-mono">
                <AnimatedText
                  key={`typing-delay-${resetKey}`}
                  text="React Apps • E-commerce • SaaS Platforms"
                  variant="typing"
                  delay={1000}
                  speed={60}
                />
              </div>
            </div>

            <div className="border-5 border-black p-6 bg-white">
              <h3 className="font-mono text-lg font-bold mb-4">
                Looping Typing:
              </h3>
              <div className="text-lg font-mono">
                <AnimatedText
                  key={`typing-loop-${resetKey}`}
                  text="Full Stack Developer"
                  variant="typing"
                  loop
                  speed={100}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Reveal Animation */}
        <section className="space-y-6">
          <h2 className="font-mono text-2xl font-bold uppercase border-b-3 border-black pb-2">
            Reveal Animation
          </h2>
          <div className="space-y-4">
            <div className="border-5 border-black p-6 bg-white">
              <h3 className="font-mono text-lg font-bold mb-4">
                Basic Reveal:
              </h3>
              <div className="text-2xl font-bold">
                <AnimatedText
                  key={`reveal-basic-${resetKey}`}
                  text="BRUTALIST DESIGN"
                  variant="reveal"
                  className="font-mono uppercase"
                />
              </div>
            </div>

            <div className="border-5 border-black p-6 bg-white">
              <h3 className="font-mono text-lg font-bold mb-4">
                Staggered Reveals:
              </h3>
              <div className="space-y-2">
                <div className="text-xl font-bold">
                  <AnimatedText
                    key={`reveal-1-${resetKey}`}
                    text="BOLD"
                    variant="reveal"
                    delay={0}
                    className="font-mono uppercase"
                  />
                </div>
                <div className="text-xl font-bold">
                  <AnimatedText
                    key={`reveal-2-${resetKey}`}
                    text="CONTRASTING"
                    variant="reveal"
                    delay={0.3}
                    className="font-mono uppercase"
                  />
                </div>
                <div className="text-xl font-bold">
                  <AnimatedText
                    key={`reveal-3-${resetKey}`}
                    text="IMPACTFUL"
                    variant="reveal"
                    delay={0.6}
                    className="font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Glitch Animation */}
        <section className="space-y-6">
          <h2 className="font-mono text-2xl font-bold uppercase border-b-3 border-black pb-2">
            Glitch Animation
          </h2>
          <div className="space-y-4">
            <div className="border-5 border-black p-6 bg-black text-white">
              <h3 className="font-mono text-lg font-bold mb-4 text-brutalist-yellow">
                Basic Glitch:
              </h3>
              <div className="text-3xl font-bold">
                <AnimatedText
                  key={`glitch-basic-${resetKey}`}
                  text="CYBER AESTHETIC"
                  variant="glitch"
                  className="font-mono uppercase"
                />
              </div>
            </div>

            <div className="border-5 border-black p-6 bg-black text-white">
              <h3 className="font-mono text-lg font-bold mb-4 text-brutalist-yellow">
                Looping Glitch:
              </h3>
              <div className="text-2xl font-bold">
                <AnimatedText
                  key={`glitch-loop-${resetKey}`}
                  text="DIGITAL CHAOS"
                  variant="glitch"
                  loop
                  className="font-mono uppercase"
                />
              </div>
            </div>

            <div className="border-5 border-black p-6 bg-black text-white">
              <h3 className="font-mono text-lg font-bold mb-4 text-brutalist-yellow">
                Delayed Glitch:
              </h3>
              <div className="text-xl font-bold">
                <AnimatedText
                  key={`glitch-delay-${resetKey}`}
                  text="SYSTEM ERROR"
                  variant="glitch"
                  delay={1500}
                  className="font-mono uppercase"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Hero Section Example */}
        <section className="space-y-6">
          <h2 className="font-mono text-2xl font-bold uppercase border-b-3 border-black pb-2">
            Hero Section Example
          </h2>
          <div className="border-5 border-black p-8 bg-gradient-to-br from-white to-gray-100">
            <div className="text-center space-y-6">
              <div className="text-4xl md:text-6xl font-black">
                <AnimatedText
                  key={`hero-title-${resetKey}`}
                  text="I BUILD"
                  variant="reveal"
                  className="font-mono uppercase block"
                />
                <AnimatedText
                  key={`hero-title2-${resetKey}`}
                  text="DIGITAL EXPERIENCES"
                  variant="reveal"
                  delay={0.5}
                  className="font-mono uppercase block"
                />
                <AnimatedText
                  key={`hero-title3-${resetKey}`}
                  text="THAT CONVERT"
                  variant="glitch"
                  delay={1.0}
                  className="font-mono uppercase block text-brutalist-yellow"
                />
              </div>

              <div className="text-xl font-mono">
                <AnimatedText
                  key={`hero-subtitle-${resetKey}`}
                  text="React Apps • E-commerce • SaaS Platforms"
                  variant="typing"
                  delay={2000}
                  speed={80}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Custom Styling Examples */}
        <section className="space-y-6">
          <h2 className="font-mono text-2xl font-bold uppercase border-b-3 border-black pb-2">
            Custom Styling
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-5 border-black p-6 bg-brutalist-yellow">
              <h3 className="font-mono text-lg font-bold mb-4">
                Yellow Background:
              </h3>
              <AnimatedText
                key={`custom-1-${resetKey}`}
                text="STAND OUT"
                variant="reveal"
                className="text-3xl font-mono font-black uppercase"
              />
            </div>

            <div className="border-5 border-black p-6 bg-black text-white">
              <h3 className="font-mono text-lg font-bold mb-4 text-brutalist-yellow">
                Dark Theme:
              </h3>
              <AnimatedText
                key={`custom-2-${resetKey}`}
                text="BOLD CHOICE"
                variant="typing"
                className="text-2xl font-mono font-bold uppercase"
                speed={120}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnimatedTextDemo;
