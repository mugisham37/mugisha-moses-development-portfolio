/**
 * Manual verification script for DarkModeToggle visibility improvements
 * Run this in the browser console to verify the toggle enhancements
 */

function verifyToggleVisibility() {
  console.log("🔍 Verifying DarkModeToggle visibility improvements...\n");

  // Find toggle elements
  const toggles = document.querySelectorAll(".brutalist-toggle");

  if (toggles.length === 0) {
    console.error("❌ No toggle elements found");
    return;
  }

  console.log(`✅ Found ${toggles.length} toggle element(s)`);

  toggles.forEach((toggle, index) => {
    console.log(`\n📋 Toggle ${index + 1} Analysis:`);

    // Check for enhanced visibility class
    const hasEnhancedVisibility = toggle.classList.contains(
      "toggle-enhanced-visibility"
    );
    console.log(
      `   Enhanced visibility class: ${hasEnhancedVisibility ? "✅" : "❌"}`
    );

    // Check accessibility attributes
    const hasAriaChecked = toggle.hasAttribute("aria-checked");
    const hasAriaLabel = toggle.hasAttribute("aria-label");
    const hasRole = toggle.getAttribute("role") === "switch";

    console.log(`   Accessibility attributes:`);
    console.log(`     - aria-checked: ${hasAriaChecked ? "✅" : "❌"}`);
    console.log(`     - aria-label: ${hasAriaLabel ? "✅" : "❌"}`);
    console.log(`     - role="switch": ${hasRole ? "✅" : "❌"}`);

    // Check for icons
    const sunIcon = toggle.querySelector('[data-testid="sun-icon"]');
    const moonIcon = toggle.querySelector('[data-testid="moon-icon"]');
    const bgSunIcon = toggle.querySelector('[data-testid="bg-sun-icon"]');
    const bgMoonIcon = toggle.querySelector('[data-testid="bg-moon-icon"]');

    console.log(`   Icon visibility:`);
    console.log(`     - Main sun icon: ${sunIcon ? "✅" : "❌"}`);
    console.log(`     - Main moon icon: ${moonIcon ? "✅" : "❌"}`);
    console.log(`     - Background sun icon: ${bgSunIcon ? "✅" : "❌"}`);
    console.log(`     - Background moon icon: ${bgMoonIcon ? "✅" : "❌"}`);

    // Check computed styles
    const computedStyle = window.getComputedStyle(toggle);
    const borderColor = computedStyle.borderColor;
    const backgroundColor = computedStyle.backgroundColor;

    console.log(`   Computed styles:`);
    console.log(`     - Border color: ${borderColor}`);
    console.log(`     - Background color: ${backgroundColor}`);

    // Check thumb visibility
    const thumb = toggle.querySelector(".brutalist-toggle-thumb");
    if (thumb) {
      const thumbStyle = window.getComputedStyle(thumb);
      console.log(`     - Thumb background: ${thumbStyle.backgroundColor}`);
      console.log(`     - Thumb border: ${thumbStyle.borderColor}`);
    }
  });

  console.log("\n🎯 Manual Testing Checklist:");
  console.log(
    "   1. Toggle icons are clearly visible in both light and dark modes"
  );
  console.log(
    "   2. Background icons have appropriate opacity (80% when visible)"
  );
  console.log("   3. Focus outline is visible with yellow color");
  console.log(
    "   4. Hover effects enhance visibility without breaking contrast"
  );
  console.log("   5. Toggle thumb moves smoothly between states");
  console.log("   6. All text and icons maintain proper contrast ratios");

  console.log(
    "\n✨ Verification complete! Check the visual elements manually."
  );
}

// Auto-run if in browser
if (typeof window !== "undefined") {
  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", verifyToggleVisibility);
  } else {
    verifyToggleVisibility();
  }
}

// Export for manual use
if (typeof module !== "undefined" && module.exports) {
  module.exports = { verifyToggleVisibility };
}
