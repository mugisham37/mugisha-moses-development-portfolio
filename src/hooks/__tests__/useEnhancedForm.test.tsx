import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEnhancedForm } from "../useEnhancedForm";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
});

describe("useEnhancedForm", () => {
  const mockOnSubmit = vi.fn();
  const mockOnStepChange = vi.fn();
  const mockOnAutoSave = vi.fn();
  const mockOnAnalytics = vi.fn();

  const defaultOptions = {
    formId: "test-form",
    onSubmit: mockOnSubmit,
  };

  const sampleFields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      validation: { required: true, minLength: 2 },
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      validation: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    },
  ];

  const sampleSteps = [
    {
      id: "personal",
      title: "Personal Information",
      fields: [sampleFields[0]],
    },
    {
      id: "contact",
      title: "Contact Information",
      fields: [sampleFields[1]],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Basic Form Functionality", () => {
    it("should initialize with default state", () => {
      const { result } = renderHook(() =>
        useEnhancedForm({ ...defaultOptions, fields: sampleFields })
      );

      expect(result.current.formState.data).toEqual({});
      expect(result.current.formState.errors).toEqual({});
      expect(result.current.formState.touched).toEqual({});
      expect(result.current.formState.isSubmitting).toBe(false);
      expect(result.current.formState.isDirty).toBe(false);
      expect(result.current.formState.isValid).toBe(false);
      expect(result.current.formState.currentStep).toBe(0);
    });

    it("should initialize with initial data", () => {
      const initialData = { name: "John", email: "john@example.com" };
      const { result } = renderHook(() =>
        useEnhancedForm({
          ...defaultOptions,
          fields: sampleFields,
          initialData,
        })
      );

      expect(result.current.formState.data).toEqual(initialData);
    });

    it("should update field values correctly", () => {
      const { result } = renderHook(() =>
        useEnhancedForm({ ...defaultOptions, fields: sampleFields })
      );

      act(() => {
        result.current.updateField("name", "John Doe");
      });

      expect(result.current.formState.data.name).toBe("John Doe");
      expect(result.current.formState.touched.name).toBe(true);
      expect(result.current.formState.isDirty).toBe(true);
    });
  });

  describe("Multi-step Form Functionality", () => {
    it("should handle multi-step navigation", () => {
      const { result } = renderHook(() =>
        useEnhancedForm({
          ...defaultOptions,
          steps: sampleSteps,
          onStepChange: mockOnStepChange,
        })
      );

      expect(result.current.formState.currentStep).toBe(0);
      expect(result.current.isFirstStep).toBe(true);
      expect(result.current.isLastStep).toBe(false);
      expect(result.current.totalSteps).toBe(2);

      // Fill required field for current step
      act(() => {
        result.current.updateField("name", "John Doe");
      });

      // Move to next step
      act(() => {
        result.current.nextStep();
      });

      expect(result.current.formState.currentStep).toBe(1);
      expect(result.current.isFirstStep).toBe(false);
      expect(result.current.isLastStep).toBe(true);
      expect(mockOnStepChange).toHaveBeenCalledWith(1, { name: "John Doe" });
    });

    it("should prevent navigation to next step with validation errors", () => {
      const { result } = renderHook(() =>
        useEnhancedForm({ ...defaultOptions, steps: sampleSteps })
      );

      // Try to move to next step without filling required field
      act(() => {
        const success = result.current.nextStep();
        expect(success).toBe(false);
      });

      expect(result.current.formState.currentStep).toBe(0);
      expect(result.current.formState.errors).toHaveProperty("name");
    });

    it("should allow navigation to previous step", () => {
      const { result } = renderHook(() =>
        useEnhancedForm({ ...defaultOptions, steps: sampleSteps })
      );

      // Move to step 1 first
      act(() => {
        result.current.updateField("name", "John Doe");
        result.current.nextStep();
      });

      expect(result.current.formState.currentStep).toBe(1);

      // Move back to step 0
      act(() => {
        const success = result.current.prevStep();
        expect(success).toBe(true);
      });

      expect(result.current.formState.currentStep).toBe(0);
    });

    it("should calculate progress correctly", () => {
      const { result } = renderHook(() =>
        useEnhancedForm({ ...defaultOptions, steps: sampleSteps })
      );

      expect(result.current.getProgress()).toBe(50); // Step 1 of 2

      act(() => {
        result.current.updateField("name", "John Doe");
        result.current.nextStep();
      });

      expect(result.current.getProgress()).toBe(100); // Step 2 of 2
    });
  });

  describe("Form Validation", () => {
    it("should validate current step correctly", () => {
      const { result } = renderHook(() =>
        useEnhancedForm({ ...defaultOptions, fields: sampleFields })
      );

      // Initially invalid (required fields empty)
      act(() => {
        const isValid = result.current.validateCurrentStep();
        expect(isValid).toBe(false);
      });

      expect(result.current.formState.errors).toHaveProperty("name");
      expect(result.current.formState.errors).toHaveProperty("email");

      // Fill valid data
      act(() => {
        result.current.updateField("name", "John Doe");
        result.current.updateField("email", "john@example.com");
      });

      act(() => {
        const isValid = result.current.validateCurrentStep();
        expect(isValid).toBe(true);
      });

      expect(Object.keys(result.current.formState.errors)).toHaveLength(0);
    });

    it("should clear errors when field is updated", () => {
      const { result } = renderHook(() =>
        useEnhancedForm({ ...defaultOptions, fields: sampleFields })
      );

      // Trigger validation to create errors
      act(() => {
        result.current.validateCurrentStep();
      });

      expect(result.current.formState.errors).toHaveProperty("name");

      // Update field should clear its error
      act(() => {
        result.current.updateField("name", "John Doe");
      });

      expect(result.current.formState.errors).not.toHaveProperty("name");
    });
  });

  describe("Form Submission", () => {
    it("should submit form successfully", async () => {
      mockOnSubmit.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useEnhancedForm({ ...defaultOptions, fields: sampleFields })
      );

      // Fill valid data
      act(() => {
        result.current.updateField("name", "John Doe");
        result.current.updateField("email", "john@example.com");
      });

      // Submit form
      await act(async () => {
        const success = await result.current.submitForm();
        expect(success).toBe(true);
      });

      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
      });
      expect(result.current.formState.isSubmitting).toBe(false);
      expect(result.current.formState.isDirty).toBe(false);
    });

    it("should handle submission errors", async () => {
      mockOnSubmit.mockRejectedValue(new Error("Submission failed"));

      const { result } = renderHook(() =>
        useEnhancedForm({ ...defaultOptions, fields: sampleFields })
      );

      // Fill valid data
      act(() => {
        result.current.updateField("name", "John Doe");
        result.current.updateField("email", "john@example.com");
      });

      // Submit form
      await act(async () => {
        const success = await result.current.submitForm();
        expect(success).toBe(false);
      });

      expect(result.current.formState.isSubmitting).toBe(false);
    });

    it("should prevent submission with validation errors", async () => {
      const { result } = renderHook(() =>
        useEnhancedForm({ ...defaultOptions, fields: sampleFields })
      );

      // Try to submit without filling required fields
      await act(async () => {
        const success = await result.current.submitForm();
        expect(success).toBe(false);
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
      expect(result.current.formState.errors).toHaveProperty("name");
      expect(result.current.formState.errors).toHaveProperty("email");
    });
  });

  describe("Auto-save Functionality", () => {
    it("should trigger auto-save when enabled", () => {
      const { result } = renderHook(() =>
        useEnhancedForm({
          ...defaultOptions,
          fields: sampleFields,
          autoSave: true,
          autoSaveInterval: 1000,
          onAutoSave: mockOnAutoSave,
        })
      );

      act(() => {
        result.current.updateField("name", "John Doe");
      });

      expect(result.current.formState.autoSaveStatus).toBe("saving");

      // Fast-forward time to trigger auto-save
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockOnAutoSave).toHaveBeenCalledWith({ name: "John Doe" });
    });
  });

  describe("Form Reset", () => {
    it("should reset form to initial state", () => {
      const initialData = { name: "Initial" };
      const { result } = renderHook(() =>
        useEnhancedForm({
          ...defaultOptions,
          fields: sampleFields,
          initialData,
        })
      );

      // Make changes
      act(() => {
        result.current.updateField("name", "Changed");
        result.current.updateField("email", "test@example.com");
      });

      expect(result.current.formState.data.name).toBe("Changed");
      expect(result.current.formState.isDirty).toBe(true);

      // Reset form
      act(() => {
        result.current.resetForm();
      });

      expect(result.current.formState.data).toEqual(initialData);
      expect(result.current.formState.isDirty).toBe(false);
      expect(result.current.formState.touched).toEqual({});
      expect(result.current.formState.errors).toEqual({});
    });
  });

  describe("Conditional Fields", () => {
    const conditionalFields = [
      {
        name: "type",
        label: "Type",
        type: "select",
        validation: { required: true },
      },
      {
        name: "premium_feature",
        label: "Premium Feature",
        type: "text",
        conditional: {
          field: "type",
          operator: "equals" as const,
          value: "premium",
        },
        validation: { required: true },
      },
    ];

    it("should show/hide fields based on conditions", () => {
      const { result } = renderHook(() =>
        useEnhancedForm({ ...defaultOptions, fields: conditionalFields })
      );

      // Initially, premium_feature should be hidden
      let visibleFields = result.current.getVisibleFields();
      expect(visibleFields).toHaveLength(1);
      expect(visibleFields[0].name).toBe("type");

      // Set type to premium
      act(() => {
        result.current.updateField("type", "premium");
      });

      // Now premium_feature should be visible
      visibleFields = result.current.getVisibleFields();
      expect(visibleFields).toHaveLength(2);
      expect(visibleFields.map((f) => f.name)).toContain("premium_feature");
    });
  });

  describe("Analytics Integration", () => {
    it("should track analytics when enabled", () => {
      const { result } = renderHook(() =>
        useEnhancedForm({
          ...defaultOptions,
          fields: sampleFields,
          analytics: true,
          onAnalytics: mockOnAnalytics,
        })
      );

      // Fill and submit form
      act(() => {
        result.current.updateField("name", "John Doe");
        result.current.updateField("email", "john@example.com");
      });

      mockOnSubmit.mockResolvedValue(undefined);

      act(async () => {
        await result.current.submitForm();
      });

      expect(mockOnAnalytics).toHaveBeenCalled();
    });
  });
});
