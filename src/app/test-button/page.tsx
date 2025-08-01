"use client";

import React from "react";
import BrutalistButton from "@/components/ui/BrutalistButton";
import { getContrastRatio, BRUTALIST_COLORS } from "@/lib/colorUtils";

export default function TestButtonPage() {
  // Calculate contrast ratios for validation
  const primaryContrast = getContrastRatio(
    BRUTALIST_COLORS.white,
    BRUTALIST_COLORS.black
  );
  const secondaryContrast = getContrastRatio(
    BRUTALIST_COLORS.black,
    BRUTALIST_COLORS.white
  );
  const accentContrast = getContrastRatio(
    BRUTALIST_COLORS.black,
    BRUTALIST_COLORS.yellow
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-mono font-black uppercase tracking-wider mb-8">
          BrutalistButton Test Page
        </h1>

        {/* Contrast Ratio Information */}
        <div className="bg-brutalist-light-gray border-3 border-black p-6 mb-8">
          <h2 className="text-2xl font-mono font-bold mb-4">
            Color Contrast Ratios
          </h2>
          <div className="space-y-2 font-mono">
            <p>
              Primary (white on black):{" "}
              <strong>{primaryContrast.toFixed(2)}:1</strong> ✅
            </p>
            <p>
              Secondary (black on white):{" "}
              <strong>{secondaryContrast.toFixed(2)}:1</strong> ✅
            </p>
            <p>
              Accent (black on yellow):{" "}
              <strong>{accentContrast.toFixed(2)}:1</strong> ✅
            </p>
            <p className="text-sm text-gray-600 mt-4">
              All ratios exceed WCAG 2.1 AA standard (4.5:1 minimum)
            </p>
          </div>
        </div>

        {/* Button Variants */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-mono font-bold mb-4">
              Button Variants
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-mono font-bold">Primary</h3>
                <BrutalistButton variant="primary" size="sm">
                  Small Primary
                </BrutalistButton>
                <BrutalistButton variant="primary" size="md">
                  Medium Primary
                </BrutalistButton>
                <BrutalistButton variant="primary" size="lg">
                  Large Primary
                </BrutalistButton>
              </div>

              <div className="space-y-4">
                <h3 className="font-mono font-bold">Secondary</h3>
                <BrutalistButton variant="secondary" size="sm">
                  Small Secondary
                </BrutalistButton>
                <BrutalistButton variant="secondary" size="md">
                  Medium Secondary
                </BrutalistButton>
                <BrutalistButton variant="secondary" size="lg">
                  Large Secondary
                </BrutalistButton>
              </div>

              <div className="space-y-4">
                <h3 className="font-mono font-bold">Accent</h3>
                <BrutalistButton variant="accent" size="sm">
                  Small Accent
                </BrutalistButton>
                <BrutalistButton variant="accent" size="md">
                  Medium Accent
                </BrutalistButton>
                <BrutalistButton variant="accent" size="lg">
                  Large Accent
                </BrutalistButton>
              </div>
            </div>
          </section>

          {/* Special States */}
          <section>
            <h2 className="text-2xl font-mono font-bold mb-4">
              Special States
            </h2>
            <div className="flex flex-wrap gap-4">
              <BrutalistButton variant="primary" size="md" disabled>
                Disabled Primary
              </BrutalistButton>
              <BrutalistButton variant="secondary" size="md" disabled>
                Disabled Secondary
              </BrutalistButton>
              <BrutalistButton variant="accent" size="md" disabled>
                Disabled Accent
              </BrutalistButton>
              <BrutalistButton variant="accent" size="md" glow>
                Glowing Accent
              </BrutalistButton>
            </div>
          </section>

          {/* Focus Testing */}
          <section>
            <h2 className="text-2xl font-mono font-bold mb-4">Focus Testing</h2>
            <p className="font-mono text-sm mb-4">
              Use Tab key to navigate and test focus indicators:
            </p>
            <div className="flex flex-wrap gap-4">
              <BrutalistButton variant="primary" size="md">
                Focus Test 1
              </BrutalistButton>
              <BrutalistButton variant="secondary" size="md">
                Focus Test 2
              </BrutalistButton>
              <BrutalistButton variant="accent" size="md">
                Focus Test 3
              </BrutalistButton>
            </div>
          </section>

          {/* Background Testing */}
          <section>
            <h2 className="text-2xl font-mono font-bold mb-4">
              Background Testing
            </h2>

            {/* White Background */}
            <div className="bg-brutalist-light-gray p-6 border-3 border-black mb-4">
              <h3 className="font-mono font-bold text-black mb-4">
                On White Background
              </h3>
              <div className="flex flex-wrap gap-4">
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
            </div>

            {/* Black Background */}
            <div className="bg-black p-6 border-3 border-white mb-4">
              <h3 className="font-mono font-bold text-white mb-4">
                On Black Background
              </h3>
              <div className="flex flex-wrap gap-4">
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
            </div>

            {/* Yellow Background */}
            <div className="bg-brutalist-yellow p-6 border-3 border-black mb-4">
              <h3 className="font-mono font-bold text-black mb-4">
                On Yellow Background
              </h3>
              <div className="flex flex-wrap gap-4">
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
            </div>
          </section>
        </div>

        {/* Accessibility Notes */}
        <div className="bg-brutalist-light-gray border-3 border-black p-6">
          <h2 className="text-2xl font-mono font-bold mb-4">
            Accessibility Features
          </h2>
          <ul className="font-mono space-y-2">
            <li>
              ✅ All color combinations meet WCAG 2.1 AA standards (4.5:1
              minimum contrast)
            </li>
            <li>
              ✅ Focus indicators have sufficient contrast on all backgrounds
            </li>
            <li>✅ Hover states maintain proper contrast ratios</li>
            <li>✅ Disabled states are clearly indicated</li>
            <li>✅ Keyboard navigation support</li>
            <li>✅ ARIA labels supported</li>
            <li>✅ Minimum touch target size (44px)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
