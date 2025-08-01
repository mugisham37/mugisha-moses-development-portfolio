# Color Utility Functions

This module provides comprehensive color contrast and accessibility utilities for the brutalist portfolio design system.

## Features

- **WCAG 2.1 AA Compliance**: Automatic contrast ratio calculations and validation
- **Safe Color Recommendations**: Get accessible text/background color combinations
- **Development Validation**: Runtime warnings for accessibility violations
- **Hover State Management**: Consistent hover color patterns
- **CSS Generation**: Automatic CSS custom properties for safe color combinations

## Quick Start

```typescript
import {
  getContrastRatio,
  isAccessible,
  getSafeTextColor,
  getSafeBackgroundColor,
  validateColorCombinations,
  BRUTALIST_COLORS,
} from "./color-utils";

// Check contrast ratio
const ratio = getContrastRatio("#000000", "#ffffff"); // 21:1

// Validate accessibility
const check = isAccessible("#000000", "#ffffff");
console.log(check.passes); // true
console.log(check.wcagLevel); // "AAA"

// Get safe color recommendations
const safeText = getSafeTextColor("#ffff00"); // "#000000" (black)
const safeBg = getSafeBackgroundColor("#ffffff"); // "#000000" (black)

// Validate component colors (development only)
validateColorCombinations(
  [
    {
      foreground: "#000000",
      background: "#ffffff",
      context: "Button text",
    },
  ],
  "MyComponent"
);
```

## Core Functions

### `getContrastRatio(color1: string, color2: string): number`

Calculates the WCAG contrast ratio between two colors.

### `isAccessible(foreground: string, background: string, isLargeText?: boolean): AccessibilityCheck`

Checks if a color combination meets WCAG 2.1 AA standards.

### `getSafeTextColor(background: string, isLargeText?: boolean): string`

Returns the best text color for a given background from the brutalist palette.

### `getSafeBackgroundColor(text: string, isLargeText?: boolean): string`

Returns the best background color for a given text color from the brutalist palette.

### `getHoverColors(currentBg: string, currentText: string): {background: string, text: string}`

Returns appropriate hover colors following brutalist design patterns.

## Development Helpers

### `validateColorCombinations(combinations, componentName)`

Validates color combinations and logs warnings for accessibility issues (development only).

### `logPaletteValidation(palette, paletteName)`

Validates an entire color palette and logs results (development only).

### `generateSafeColorCSS(palette)`

Generates CSS custom properties for safe color combinations.

## Brutalist Color Constants

```typescript
export const BRUTALIST_COLORS = {
  BLACK: "#000000",
  WHITE: "#ffffff",
  YELLOW: "#ffff00",
  GRAY: "#808080",
  DARK_GRAY: "#2a2a2a",
  LIGHT_GRAY: "#f5f5f5",
  MEDIUM_GRAY: "#666666",
} as const;
```

## Testing the Functions

Run the demo functions in your browser console:

```typescript
import {
  runColorUtilityDemo,
  validateComponentColors,
} from "./color-utils-demo";

// Run comprehensive demo
runColorUtilityDemo();

// Validate specific components
validateComponentColors();
```

## WCAG Standards

The utilities follow WCAG 2.1 AA standards:

- **Normal text**: 4.5:1 minimum contrast ratio
- **Large text** (18pt+ or 14pt+ bold): 3.0:1 minimum contrast ratio
- **AAA level**: 7.0:1 for normal text, 4.5:1 for large text

## Integration with Components

Use these utilities in your React components:

```typescript
import { getSafeTextColor, validateColorCombinations } from "@/lib/color-utils";

export function BrutalistButton({ variant = "primary" }) {
  const backgroundColor = variant === "accent" ? "#ffff00" : "#ffffff";
  const textColor = getSafeTextColor(backgroundColor);

  // Development validation
  if (process.env.NODE_ENV === "development") {
    validateColorCombinations(
      [
        {
          foreground: textColor,
          background: backgroundColor,
          context: `${variant} button`,
        },
      ],
      "BrutalistButton"
    );
  }

  return (
    <button
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      Click me
    </button>
  );
}
```

## Requirements Addressed

This implementation addresses the following requirements:

- **1.1**: Ensures all text and icons are clearly visible with proper contrast ratios
- **2.1**: Meets WCAG 2.1 AA accessibility standards for color contrast
- **4.2**: Provides consistent color usage patterns and development utilities

The utilities automatically handle the brutalist color palette while ensuring accessibility compliance and providing development-time validation to prevent contrast issues.
