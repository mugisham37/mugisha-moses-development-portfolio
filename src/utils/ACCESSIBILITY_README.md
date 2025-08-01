# Accessibility Validation System

This comprehensive accessibility validation system provides WCAG 2.1 AA compliance checking, development warnings, and programmatic testing utilities for the brutalist portfolio project.

## Overview

The system consists of several interconnected utilities:

- **Core Validation** (`accessibilityValidator.ts`) - WCAG 2.1 compliance checking
- **Development Checker** (`devAccessibilityChecker.ts`) - Real-time development warnings
- **Test Runner** (`accessibilityTestRunner.ts`) - Programmatic testing capabilities
- **Integration Helpers** (`accessibilityIntegration.ts`) - React hooks and component validation
- **Demo & Examples** (`accessibilityDemo.ts`) - Usage demonstrations

## Features

### ✅ WCAG 2.1 AA Compliance

- Contrast ratio calculations (4.5:1 for normal text, 3:1 for large text)
- Focus indicator validation (3:1 ratio requirement)
- Non-text element validation
- AAA level checking for enhanced accessibility

### 🔍 Development-Time Validation

- Real-time color contrast checking
- Console warnings for accessibility violations
- DOM scanning for potential issues
- Component-specific validation

### 🧪 Programmatic Testing

- Automated test suites for color combinations
- Comprehensive reporting
- Brutalist theme validation
- Custom test suite creation

### ⚛️ React Integration

- Custom hooks for component validation
- Theme accessibility checking
- Automatic validation on prop changes

## Quick Start

### Basic Usage

```typescript
import {
  checkWCAGCompliance,
  validateSingleCombination,
} from "./utils/accessibility";

// Check a single color combination
const result = checkWCAGCompliance("#000000", "#ffffff");
console.log(result.passes); // true
console.log(result.contrastRatio); // ~21
console.log(result.wcagLevel); // "AAA"

// Quick validation with logging
validateSingleCombination(
  "#ffffff",
  "#ffff00",
  "White text on yellow background"
);
// Logs: ❌ White text on yellow background: 1.07:1 (FAIL)
```

### Component Validation

```typescript
import { ComponentAccessibilityValidator } from "./utils/accessibility";

const validator = new ComponentAccessibilityValidator("MyButton");

validator
  .addTextValidation("#000000", "#ffffff", "Button text")
  .addFocusValidation("#ffff00", "#000000", "Focus outline")
  .validate();
```

### React Hook Usage

```typescript
import { useComponentAccessibility } from "./utils/accessibilityIntegration";

function MyComponent() {
  useComponentAccessibility("MyComponent", [
    {
      foreground: "#000000",
      background: "#ffffff",
      context: "Component text",
    },
  ]);

  return <div>My Component</div>;
}
```

## API Reference

### Core Functions

#### `checkWCAGCompliance(foreground, background, options)`

Checks if a color combination meets WCAG standards.

**Parameters:**

- `foreground` (string): Foreground color in hex format
- `background` (string): Background color in hex format
- `options` (object, optional):
  - `isLargeText` (boolean): Whether text is large (≥18pt or ≥14pt bold)
  - `isFocusIndicator` (boolean): Whether this is a focus indicator
  - `isNonText` (boolean): Whether this is a non-text element
  - `targetLevel` ('AA' | 'AAA'): Target WCAG level

**Returns:** `AccessibilityCheck` object with:

- `passes` (boolean): Whether the combination passes
- `contrastRatio` (number): Calculated contrast ratio
- `wcagLevel` ('AA' | 'AAA' | 'FAIL'): Achieved WCAG level

#### `validateColorCombinations(combinations)`

Validates multiple color combinations at once.

**Parameters:**

- `combinations` (array): Array of color combination objects

**Returns:** `ValidationResult` object with summary and detailed results.

### Development Tools

#### `ComponentAccessibilityValidator`

Class for validating component color combinations.

```typescript
const validator = new ComponentAccessibilityValidator("ComponentName");

// Add validations
validator.addTextValidation(fg, bg, context, isLargeText);
validator.addFocusValidation(fg, bg, context);
validator.addNonTextValidation(fg, bg, context);

// Run validation
const result = validator.validate();
```

#### `devAccessibilityChecker`

Singleton for development-time checking.

```typescript
// Validate colors
devAccessibilityChecker.validateColors("Component", combinations);

// Scan DOM for issues
devAccessibilityChecker.scanDOMForIssues();

// Get results
const results = devAccessibilityChecker.getValidationResults();
```

### Testing Utilities

#### `runComprehensiveAccessibilityTests()`

Runs all predefined test suites for the brutalist theme.

#### `generateAccessibilityReport()`

Generates a markdown report of all accessibility test results.

#### `AccessibilityTestRunner`

Class for creating and running custom test suites.

```typescript
const runner = new AccessibilityTestRunner();
runner.addTestSuite(customTestSuite);
const results = runner.runAllTests();
```

## Predefined Validations

### Brutalist Theme Colors

The system includes predefined validations for the brutalist color palette:

- **Safe Combinations:**

  - Black (#000000) on White (#ffffff) - 21:1 ratio
  - White (#ffffff) on Black (#000000) - 21:1 ratio
  - Black (#000000) on Yellow (#ffff00) - 19.56:1 ratio
  - Medium Gray (#666666) on White (#ffffff) - 5.74:1 ratio

- **Unsafe Combinations:**
  - White (#ffffff) on Yellow (#ffff00) - 1.07:1 ratio ❌
  - Yellow (#ffff00) on White (#ffffff) - 1.07:1 ratio ❌
  - Light Gray (#f5f5f5) on White (#ffffff) - 1.12:1 ratio ❌

### Component-Specific Validations

#### Button Components

```typescript
validateButtonAccessibility("primary", "light");
validateButtonAccessibility("accent", "dark");
```

#### Navigation Components

```typescript
validateNavigationAccessibility("light");
validateNavigationAccessibility("dark");
```

#### Hero Section

```typescript
validateHeroAccessibility();
```

## Development Workflow

### 1. Component Development

When creating new components, use the validation hooks:

```typescript
function NewComponent({ theme }) {
  useComponentAccessibility("NewComponent", [
    {
      foreground: getTextColor(theme),
      background: getBackgroundColor(theme),
      context: "Component text",
    },
  ]);

  useThemeAccessibility(theme);

  return <div>Component content</div>;
}
```

### 2. Testing

Run comprehensive tests during development:

```typescript
import { runComprehensiveAccessibilityTests } from "./utils/accessibility";

// In development
if (process.env.NODE_ENV === "development") {
  runComprehensiveAccessibilityTests();
}
```

### 3. Debugging

Use browser console helpers:

```javascript
// Available in browser console during development
window.accessibilityDemo.runAll();
window.accessibilityIntegration.scanPage();
window.checkAccessibility.validateColors("Component", combinations);
```

## Configuration

### Environment Variables

The system respects `NODE_ENV`:

- **Development**: Full validation and logging
- **Production**: Minimal overhead, no console output

### Customization

Create custom test suites:

```typescript
const customTestSuite = {
  name: "Custom Component Tests",
  tests: [
    {
      name: "Custom Button States",
      combinations: [
        {
          foreground: "#custom-color",
          background: "#another-color",
          context: "Custom button",
          shouldPass: true,
        },
      ],
    },
  ],
};
```

## Best Practices

### 1. Use Semantic Color Names

```typescript
const colors = {
  textOnLight: "#000000",
  textOnDark: "#ffffff",
  accent: "#ffff00",
  focusOutline: "#ffff00",
};
```

### 2. Validate Early and Often

- Add validation to component development
- Use hooks for automatic validation
- Run tests in CI/CD pipeline

### 3. Handle Edge Cases

- Test with different text sizes
- Validate focus indicators separately
- Consider non-text elements (icons, borders)

### 4. Document Color Decisions

```typescript
// Good: Documented color choice
const buttonColor = "#000000"; // Black text ensures 21:1 contrast on white/yellow backgrounds

// Bad: Undocumented color choice
const buttonColor = "#333333";
```

## Troubleshooting

### Common Issues

#### Low Contrast Warnings

```
❌ Component text: 2.1:1 (needs 4.5:1)
```

**Solution:** Use darker text colors or lighter backgrounds.

#### Focus Indicator Failures

```
❌ Focus outline: 2.5:1 (needs 3.0:1)
```

**Solution:** Ensure focus indicators have at least 3:1 contrast ratio.

#### Large Text Confusion

Large text (≥18pt or ≥14pt bold) only needs 3:1 contrast ratio instead of 4.5:1.

### Debugging Tips

1. **Use Browser Console:**

   ```javascript
   window.accessibilityDemo.portfolio(); // Quick portfolio validation
   ```

2. **Check Specific Combinations:**

   ```javascript
   window.accessibilityIntegration.quickCheck(
     "#color1",
     "#color2",
     "Description"
   );
   ```

3. **Scan Current Page:**
   ```javascript
   window.accessibilityIntegration.scanPage();
   ```

## Contributing

When adding new validation features:

1. Add tests to the appropriate test suite
2. Update documentation
3. Ensure TypeScript types are correct
4. Test in both development and production modes

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color Universal Design](https://jfly.uni-koeln.de/color/)

## License

This accessibility validation system is part of the brutalist portfolio project and follows the same license terms.
