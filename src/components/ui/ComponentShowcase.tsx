"use client";

import React from "react";
import BrutalistCard from "./BrutalistCard";
import BrutalistButton from "./BrutalistButton";
import AnimatedText from "./AnimatedText";

export const ComponentShowcase = () => {
  return (
    <div className="min-h-screen bg-brutalist-white p-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <AnimatedText
            text="BRUTALIST UI COMPONENTS"
            variant="reveal"
            className="text-4xl md:text-6xl font-mono font-black uppercase"
          />
          <AnimatedText
            text="Bold • Contrasting • Impactful"
            variant="typing"
            delay={1000}
            speed={80}
            className="text-xl font-mono"
          />
        </div>

        {/* Hero Demo Section */}
        <section className="border-5 border-black p-8 bg-gradient-to-br from-white to-gray-100">
          <div className="text-center space-y-6">
            <AnimatedText
              text="I BUILD DIGITAL EXPERIENCES"
              variant="reveal"
              className="text-3xl md:text-5xl font-mono font-black uppercase block"
            />
            <AnimatedText
              text="THAT CONVERT"
              variant="glitch"
              delay={1.0}
              className="text-3xl md:text-5xl font-mono font-black uppercase block text-brutalist-yellow"
            />

            <div className="pt-4">
              <AnimatedText
                text="React Apps • E-commerce • SaaS Platforms"
                variant="typing"
                delay={2000}
                speed={60}
                className="text-lg font-mono"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <BrutalistButton variant="accent" size="lg" glow>
                View My Work
              </BrutalistButton>
              <BrutalistButton variant="secondary" size="lg">
                Get In Touch
              </BrutalistButton>
            </div>
          </div>
        </section>

        {/* Services Grid Demo */}
        <section className="space-y-6">
          <AnimatedText
            text="SERVICES"
            variant="reveal"
            className="text-3xl font-mono font-black uppercase text-center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BrutalistCard
              title="Web Development"
              description="Custom websites and web applications built with modern technologies and best practices."
              hover="lift"
            >
              <div className="space-y-2">
                <BrutalistButton variant="primary" size="sm">
                  Learn More
                </BrutalistButton>
              </div>
            </BrutalistCard>

            <BrutalistCard
              title="E-commerce Solutions"
              description="Complete online stores with payment processing, inventory management, and analytics."
              hover="glow"
              accent
            >
              <div className="space-y-2">
                <BrutalistButton variant="secondary" size="sm">
                  View Projects
                </BrutalistButton>
              </div>
            </BrutalistCard>

            <BrutalistCard
              title="SaaS Platforms"
              description="Scalable software-as-a-service applications with user management and subscription billing."
              hover="invert"
            >
              <div className="space-y-2">
                <BrutalistButton variant="accent" size="sm">
                  Get Quote
                </BrutalistButton>
              </div>
            </BrutalistCard>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="space-y-6">
          <AnimatedText
            text="INTERACTIVE ELEMENTS"
            variant="reveal"
            className="text-3xl font-mono font-black uppercase text-center"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Button Variants */}
            <div className="border-5 border-black p-6 bg-brutalist-light-gray">
              <h3 className="font-mono text-xl font-bold uppercase mb-4">
                Button Variants
              </h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <BrutalistButton variant="primary" size="md">
                    Primary
                  </BrutalistButton>
                  <BrutalistButton variant="secondary" size="md">
                    Secondary
                  </BrutalistButton>
                  <BrutalistButton variant="accent" size="md">
                    Accent
                  </BrutalistButton>
                </div>
                <div className="flex flex-wrap gap-3">
                  <BrutalistButton variant="primary" size="sm" glow>
                    Glow Effect
                  </BrutalistButton>
                  <BrutalistButton variant="secondary" size="lg">
                    Large Size
                  </BrutalistButton>
                </div>
              </div>
            </div>

            {/* Text Animations */}
            <div className="border-5 border-black p-6 bg-black text-white">
              <h3 className="font-mono text-xl font-bold uppercase mb-4 text-brutalist-yellow">
                Text Animations
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-mono mb-2 text-gray-300">
                    Typing Effect:
                  </p>
                  <AnimatedText
                    text="Dynamic content loading..."
                    variant="typing"
                    className="font-mono"
                    loop
                    speed={100}
                  />
                </div>
                <div>
                  <p className="text-sm font-mono mb-2 text-gray-300">
                    Glitch Effect:
                  </p>
                  <AnimatedText
                    text="SYSTEM ONLINE"
                    variant="glitch"
                    className="font-mono font-bold uppercase text-green-400"
                    loop
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center space-y-6 border-5 border-black p-8 bg-brutalist-yellow">
          <AnimatedText
            text="READY TO BUILD SOMETHING AMAZING?"
            variant="reveal"
            className="text-2xl md:text-4xl font-mono font-black uppercase"
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BrutalistButton variant="primary" size="lg" glow>
              Start Project
            </BrutalistButton>
            <BrutalistButton variant="secondary" size="lg">
              View Portfolio
            </BrutalistButton>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center border-t-5 border-black pt-8">
          <AnimatedText
            text="Built with Next.js, TypeScript, Tailwind CSS & Framer Motion"
            variant="typing"
            className="font-mono text-sm opacity-70"
            speed={50}
          />
        </footer>
      </div>
    </div>
  );
};

export default ComponentShowcase;
