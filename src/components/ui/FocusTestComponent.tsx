"use client";

import React, { useEffect } from "react";
import BrutalistButton from "./BrutalistButton";
import BrutalistCard from "./BrutalistCard";
import DarkModeToggle from "./DarkModeToggle";
import { runFocusVisibilityTests } from "@/utils/focusVisibilityTester";
import { runEnhancedFocusVisibilityTests } from "@/utils/enhancedFocusVisibilityTester";
import {
  runKeyboardNavigationTests,
  testKeyboardNavigationFlow,
} from "@/utils/keyboardNavigationTester";

/**
 * Focus Test Component
 *
 * This component is used to test and validate focus indicators
 * across different interactive elements and backgrounds.
 */
export default function FocusTestComponent() {
  useEffect(() => {
    // Run enhanced focus tests after component mounts
    const timer = setTimeout(() => {
      if (process.env.NODE_ENV === "development") {
        console.log("🔍 Running legacy focus tests...");
        runFocusVisibilityTests();

        console.log("🚀 Running enhanced focus tests...");
        runEnhancedFocusVisibilityTests({
          minContrastRatio: 3.0,
          testAllBackgrounds: true,
          testHighContrastMode: true,
          testForcedColorsMode: true,
          testReducedMotion: true,
          includeAnimationTests: true,
          logResults: true,
          generateReport: true,
        });

        console.log("⌨️ Running keyboard navigation tests...");
        runKeyboardNavigationTests();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleTestKeyboardNavigation = () => {
    console.log("🔍 Testing keyboard navigation...");

    // Get all focusable elements
    const focusableElements = document.querySelectorAll(`
      button:not([disabled]),
      a[href],
      input:not([disabled]):not([type="hidden"]),
      textarea:not([disabled]),
      select:not([disabled]),
      [tabindex]:not([tabindex="-1"]):not([disabled])
    `);

    console.log(`Found ${focusableElements.length} focusable elements`);

    // Test tab order by focusing each element
    let currentIndex = 0;
    const testNextElement = () => {
      if (currentIndex < focusableElements.length) {
        const element = focusableElements[currentIndex] as HTMLElement;
        element.focus();
        console.log(
          `Focused element ${currentIndex + 1}:`,
          element.tagName,
          element.className
        );
        currentIndex++;
        setTimeout(testNextElement, 500);
      } else {
        console.log("✅ Keyboard navigation test complete");
      }
    };

    testNextElement();
  };

  return (
    <div className="p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black font-mono uppercase tracking-wider mb-4">
          Focus Indicator Test
        </h1>
        <p className="font-mono text-lg">
          Use Tab key to navigate through elements and test focus visibility
        </p>
      </div>

      {/* Test Controls */}
      <div className="flex gap-4 justify-center mb-8 flex-wrap">
        <button
          onClick={handleTestKeyboardNavigation}
          className="px-4 py-2 border-3 border-black bg-brutalist-yellow text-black font-mono font-bold uppercase tracking-wider hover:bg-black hover:text-brutalist-yellow nav-focus-safe"
        >
          Test Keyboard Navigation
        </button>
        <button
          onClick={() => {
            console.log("🚀 Running Enhanced Focus Visibility Tests...");
            runEnhancedFocusVisibilityTests({
              minContrastRatio: 3.0,
              testAllBackgrounds: true,
              testHighContrastMode: true,
              testForcedColorsMode: true,
              testReducedMotion: true,
              includeAnimationTests: true,
              logResults: true,
              generateReport: true,
            });
          }}
          className="px-4 py-2 border-3 border-black bg-white text-black font-mono font-bold uppercase tracking-wider hover:bg-black hover:text-white nav-focus-safe"
        >
          Run Enhanced Tests
        </button>
        <button
          onClick={() => {
            console.log("⌨️ Running Keyboard Navigation Tests...");
            runKeyboardNavigationTests();
          }}
          className="px-4 py-2 border-3 border-black bg-brutalist-light-gray text-black font-mono font-bold uppercase tracking-wider hover:bg-black hover:text-white nav-focus-safe"
        >
          Test Keyboard Nav
        </button>
        <button
          onClick={async () => {
            console.log("🎯 Starting Interactive Navigation Test...");
            await testKeyboardNavigationFlow();
          }}
          className="px-4 py-2 border-3 border-black bg-brutalist-medium-gray text-white font-mono font-bold uppercase tracking-wider hover:bg-black hover:text-white nav-focus-safe"
        >
          Interactive Test
        </button>
        <DarkModeToggle size="md" />
      </div>

      {/* White Background Section */}
      <section className="bg-white p-8 border-3 border-black">
        <h2 className="text-2xl font-black font-mono uppercase tracking-wider mb-6 text-black">
          White Background Tests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BrutalistButton variant="primary" size="md">
            Primary Button
          </BrutalistButton>
          <BrutalistButton variant="secondary" size="md">
            Secondary Button
          </BrutalistButton>
          <BrutalistButton variant="accent" size="md">
            Accent Button
          </BrutalistButton>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <BrutalistCard
            title="Interactive Card"
            description="This card is clickable and should have proper focus indicators"
            onClick={() => console.log("Card clicked")}
          />
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Test input field"
              className="w-full p-3 border-3 border-black font-mono bg-white text-black form-field"
            />
            <textarea
              placeholder="Test textarea"
              rows={3}
              className="w-full p-3 border-3 border-black font-mono bg-white text-black form-field"
            />
            <select className="w-full p-3 border-3 border-black font-mono bg-white text-black form-field">
              <option>Test select option 1</option>
              <option>Test select option 2</option>
            </select>
          </div>
        </div>
      </section>

      {/* Yellow Background Section */}
      <section className="bg-brutalist-yellow p-8 border-3 border-black">
        <h2 className="text-2xl font-black font-mono uppercase tracking-wider mb-6 text-black">
          Yellow Background Tests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BrutalistButton variant="primary" size="md">
            Primary Button
          </BrutalistButton>
          <BrutalistButton variant="secondary" size="md">
            Secondary Button
          </BrutalistButton>
          <BrutalistButton variant="accent" size="md">
            Accent Button
          </BrutalistButton>
        </div>

        <div className="mt-6">
          <BrutalistCard
            title="Card on Yellow"
            description="Testing focus visibility on yellow background"
            onClick={() => console.log("Yellow card clicked")}
          />
        </div>
      </section>

      {/* Dark Background Section */}
      <section className="bg-black p-8 border-3 border-white">
        <h2 className="text-2xl font-black font-mono uppercase tracking-wider mb-6 text-white">
          Dark Background Tests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BrutalistButton variant="primary" size="md">
            Primary Button
          </BrutalistButton>
          <BrutalistButton variant="secondary" size="md">
            Secondary Button
          </BrutalistButton>
          <BrutalistButton variant="accent" size="md">
            Accent Button
          </BrutalistButton>
        </div>

        <div className="mt-6">
          <BrutalistCard
            title="Card on Dark"
            description="Testing focus visibility on dark background"
            onClick={() => console.log("Dark card clicked")}
            customColors={{
              background: "#2a2a2a",
              text: "#ffffff",
              border: "#ffffff",
            }}
          />
        </div>
      </section>

      {/* Link Tests */}
      <section className="bg-brutalist-light-gray p-8 border-3 border-black">
        <h2 className="text-2xl font-black font-mono uppercase tracking-wider mb-6 text-black">
          Link Focus Tests
        </h2>
        <div className="space-y-4">
          <p className="font-mono">
            <a href="#test1" className="text-black underline nav-focus-safe">
              Regular link with focus indicator
            </a>
          </p>
          <p className="font-mono">
            <a
              href="#test2"
              className="text-brutalist-yellow font-bold nav-focus-safe"
            >
              Yellow link with focus indicator
            </a>
          </p>
          <p className="font-mono">
            <a
              href="#test3"
              className="text-black hover:text-brutalist-yellow nav-focus-safe"
            >
              Link with hover and focus states
            </a>
          </p>
        </div>
      </section>

      {/* Skip Link Test */}
      <section className="bg-white p-8 border-3 border-black">
        <h2 className="text-2xl font-black font-mono uppercase tracking-wider mb-6 text-black">
          Skip Link Test
        </h2>
        <p className="font-mono mb-4">
          Press Tab to see the skip link appear at the top of the page.
        </p>
        <a href="#main-content" className="skip-link">
          Skip to main content (test)
        </a>
      </section>

      {/* Keyboard Navigation Test Section */}
      <section className="bg-brutalist-medium-gray p-8 border-3 border-black">
        <h2 className="text-2xl font-black font-mono uppercase tracking-wider mb-6 text-white">
          Keyboard Navigation Test
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-black font-mono uppercase tracking-wider text-white">
              Interactive Elements
            </h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 border-3 border-white bg-black text-white font-mono font-bold uppercase tracking-wider hover:bg-white hover:text-black nav-focus-safe">
                Test Button 1
              </button>
              <button className="w-full px-4 py-2 border-3 border-white bg-brutalist-yellow text-black font-mono font-bold uppercase tracking-wider hover:bg-black hover:text-brutalist-yellow nav-focus-safe">
                Test Button 2
              </button>
              <input
                type="text"
                placeholder="Test input on gray background"
                className="w-full p-3 border-3 border-white font-mono bg-white text-black form-field"
              />
              <select className="w-full p-3 border-3 border-white font-mono bg-white text-black form-field">
                <option>Test select option 1</option>
                <option>Test select option 2</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-black font-mono uppercase tracking-wider text-white">
              Navigation Links
            </h3>
            <div className="space-y-3">
              <a
                href="#test1"
                className="block p-3 border-3 border-white bg-white text-black font-mono font-bold uppercase tracking-wider hover:bg-black hover:text-white nav-focus-safe"
              >
                Navigation Link 1
              </a>
              <a
                href="#test2"
                className="block p-3 border-3 border-white bg-brutalist-yellow text-black font-mono font-bold uppercase tracking-wider hover:bg-black hover:text-brutalist-yellow nav-focus-safe"
              >
                Navigation Link 2
              </a>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 border-3 border-white bg-white text-black font-mono font-bold text-sm uppercase tracking-wider hover:bg-black hover:text-white nav-focus-safe">
                  Small 1
                </button>
                <button className="flex-1 px-3 py-2 border-3 border-white bg-white text-black font-mono font-bold text-sm uppercase tracking-wider hover:bg-black hover:text-white nav-focus-safe">
                  Small 2
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instructions */}
      <section className="bg-brutalist-light-gray p-8 border-3 border-black">
        <h2 className="text-2xl font-black font-mono uppercase tracking-wider mb-6 text-black">
          Enhanced Testing Instructions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 font-mono">
            <h3 className="text-lg font-black uppercase tracking-wider text-black">
              Basic Testing
            </h3>
            <p>
              1. Use the <strong>Tab</strong> key to navigate through all
              interactive elements
            </p>
            <p>
              2. Check that each element has a visible yellow focus indicator
              with glow effect
            </p>
            <p>
              3. Verify focus indicators are visible on all background colors
            </p>
            <p>4. Test with both light and dark themes using the toggle</p>
            <p>
              5. Use <strong>Shift+Tab</strong> to navigate backwards
            </p>
            <p>
              6. Press <strong>Enter</strong> or <strong>Space</strong> to
              activate focused elements
            </p>
          </div>
          <div className="space-y-4 font-mono">
            <h3 className="text-lg font-black uppercase tracking-wider text-black">
              Advanced Testing
            </h3>
            <p>
              7. Check browser console for automated test results and
              accessibility scores
            </p>
            <p>8. Test with high contrast mode enabled in your OS</p>
            <p>9. Test with Windows High Contrast mode (if available)</p>
            <p>10. Test with reduced motion preferences enabled</p>
            <p>11. Verify minimum 44x44px touch targets on mobile</p>
            <p>
              12. Check that focus indicators have 3:1 minimum contrast ratio
            </p>
          </div>
        </div>
        <div className="mt-6 p-4 border-3 border-black bg-brutalist-yellow">
          <p className="font-mono font-bold text-black">
            <strong>Expected Results:</strong> All focus indicators should have
            yellow outlines with glowing effects, be clearly visible on all
            backgrounds, and maintain accessibility compliance with WCAG 2.1 AA
            standards.
          </p>
        </div>
      </section>
    </div>
  );
}
