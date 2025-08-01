# Enhanced Component Library

This directory contains the enhanced component library for the navigation pages enhancement project. These components are built with TypeScript, follow accessibility best practices, and maintain the brutalist design aesthetic.

## Components

### EnhancedButton

A versatile button component with multiple variants, sizes, and states.

**Features:**

- Multiple variants: primary, secondary, outline, ghost, destructive, success, warning
- Different sizes: sm, md, lg, xl
- Loading state with spinner
- Icon support (left and right)
- Full width option
- Shadow effects
- Accessibility compliant

**Usage:**

```tsx
import { EnhancedButton } from "@/components/enhanced";

<EnhancedButton variant="primary" size="lg" loading={false}>
  Click me
</EnhancedButton>;
```

### EnhancedCard

A flexible card component with sub-components for structured content.

**Features:**

- Multiple variants: default, elevated, outlined, filled
- Different sizes: sm, md, lg
- Interactive hover effects
- Shadow support
- Sub-components: CardHeader, CardTitle, CardContent, CardFooter

**Usage:**

```tsx
import { EnhancedCard, CardHeader, CardTitle, CardContent } from '@/components/enhanced';

<EnhancedCard variant="elevated" interactive></EnhancedCard>er>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</EnhancedCard>
```

### EnhancedInput & EnhancedTextarea

Form input components with validation and accessibility features.

**Features:**

- Multiple variants: default, filled, outlined
- Different sizes: sm, md, lg
- Icon support
- Error states and validation
- Helper text
- Full width option
- Accessibility labels

**Usage:**

```tsx
import { EnhancedInput, EnhancedTextarea } from '@/components/enhanced';

<EnhancedInput
  label="Email"
  type="email"
  placeholder="Enter your email"
  error={errors.email}
  leftIcon={<EmailIcon />}
/>

<EnhancedTextarea
  label="Message"
  placeholder="Enter your message"
  rows={4}
/>
```

### EnhancedModal

A modal component with focus management and accessibility features.

**Features:**

- Multiple sizes: sm, md, lg, xl, full
- Focus trap and management
- Escape key handling
- Overlay click to close
- Portal rendering
- Sub-components: ModalHeader, ModalBody, ModalFooter

**Usage:**

```tsx
import {
  EnhancedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/enhanced";

<EnhancedModal isOpen={isOpen} onClose={onClose} title="Modal Title" size="lg">
  <ModalBody>Modal content goes here</ModalBody>
  <ModalFooter>
    <EnhancedButton onClick={onClose}>Close</EnhancedButton>
  </ModalFooter>
</EnhancedModal>;
```

## Design Principles

### Brutalist Aesthetic

All components maintain the brutalist design system with:

- Bold, thick borders (2px minimum)
- High contrast colors (black/white/yellow)
- Sharp, geometric shapes (no rounded corners by default)
- Bold typography
- Shadow effects for depth

### Accessibility

All components are built with accessibility in mind:

- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Color contrast compliance
- Semantic HTML structure

### TypeScript Support

All components are fully typed with:

- Comprehensive prop interfaces
- Generic type support where applicable
- Proper ref forwarding
- Strict type checking

### Performance

Components are optimized for performance:

- Minimal re-renders
- Efficient event handling
- Lazy loading support
- Bundle size optimization

## Testing

All components include comprehensive test suites covering:

- Rendering with different props
- User interactions
- Accessibility compliance
- Error states
- Edge cases

Run tests with:

```bash
npm run test
npm run test:watch
npm run test:coverage
```

## Development Guidelines

### Adding New Components

1. Create the component file in this directory
2. Follow the existing naming convention (Enhanced[ComponentName])
3. Include comprehensive TypeScript interfaces
4. Add accessibility features
5. Create comprehensive tests
6. Update the index.ts export file
7. Add documentation to this README

### Component Structure

```tsx
"use client";

import React, { forwardRef } from "react";
import { clsx } from "clsx";

export interface EnhancedComponentProps {
  // Props interface
}

export const EnhancedComponent = forwardRef<
  HTMLElement,
  EnhancedComponentProps
>(({ ...props }, ref) => {
  // Component implementation

  return (
    <element ref={ref} className={clsx(/* classes */)} {...props}>
      {/* Component content */}
    </element>
  );
});

EnhancedComponent.displayName = "EnhancedComponent";
```

### Styling Guidelines

- Use Tailwind CSS classes
- Follow the brutalist design tokens
- Use clsx for conditional classes
- Maintain consistent spacing and sizing
- Support dark mode where applicable

### Testing Guidelines

- Test all prop variations
- Test user interactions
- Test accessibility features
- Test error states
- Use the custom render function from test-utils
- Mock external dependencies

## Integration

These components are designed to work with:

- Next.js 15+
- React 19+
- TypeScript 5+
- Tailwind CSS 3+
- The EnhancedAppContext for state management

## Future Enhancements

Planned additions to the component library:

- EnhancedSelect dropdown component
- EnhancedCheckbox and EnhancedRadio components
- EnhancedTooltip component
- EnhancedTabs component
- EnhancedAccordion component
- EnhancedTable component
- EnhancedPagination component
- EnhancedBreadcrumb component
