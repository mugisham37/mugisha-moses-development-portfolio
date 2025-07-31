"use client";

import React from "react";
import { scrollToSection } from "@/lib/utils";

interface CTASectionProps {
  className?: string;
}

const CTASection: React.FC<CTASectionProps> = ({ className = "" }) => {
  return (
    <section
      className={`bg-brutalist-yellow border-t-5 border-black py-16 ${className}`}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-6">
          Ready to Build Something Amazing?
        </h2>
        <p className="text-lg font-mono font-bold mb-8 max-w-2xl mx-auto">
          Let&apos;s discuss your project and create a digital experience that
          converts visitors into customers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => scrollToSection("contact")}
            className="bg-black text-brutalist-yellow border-3 border-black px-8 py-4 font-mono font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-300"
          >
            Start Your Project
          </button>
          <button
            onClick={() => scrollToSection("portfolio")}
            className="bg-white text-black border-3 border-black px-8 py-4 font-mono font-bold uppercase tracking-wider hover:bg-black hover:text-brutalist-yellow transition-colors duration-300"
          >
            View More Work
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
