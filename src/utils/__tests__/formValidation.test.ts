import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  validateField,
  validateForm,
  FormAutoSave,
  FormAnalyticsTracker,
  FormProgressTracker,
  FormDependencyResolver,
  evaluateConditionalRule,
  VALIDATION_PATTERNS,
  ERROR_MESSAGES,
} from "../formValidation";

describe("Form Validation Utilities", () => {
  describe("validateField", () => {
    it("should validate required fields correctly", () => {
      const rule = { required: true };

      expect(validateField("name", "", rule)).toEqual({
        isValid: false,
        error: "name is required",
      });

      expect(validateField("name", "John", rule)).toEqual({
        isValid: true,
      });
    });

    it("should validate minimum length correctly", () => {
      const rule = { minLength: 5 };

      expect(validateField("password", "123", rule)).toEqual({
        isValid: false,
        error: "password must be at least 5 characters long",
      });

      expect(validateField("password", "12345", rule)).toEqual({
        isValid: true,
      });
    });

    it("should validate maximum length correctly", () => {
      const rule = { maxLength: 10 };

      expect(validateField("username", "12345678901", rule)).toEqual({
        isValid: false,
        error: "username must be no more than 10 characters long",
      });

      expect(validateField("username", "1234567890", rule)).toEqual({
        isValid: true,
      });
    });

    it("should validate patterns correctly", () => {
      const rule = { pattern: VALIDATION_PATTERNS.email };

      expect(validateField("email", "invalid-email", rule)).toEqual({
        isValid: false,
        error: "Please enter a valid format for email",
      });

      expect(validateField("email", "test@example.com", rule)).toEqual({
        isValid: true,
      });
    });

    it("should validate custom rules correctly", () => {
      const rule = {
        custom: (value: string) =>
          value === "valid" ? true : "Custom error message",
      };

      expect(validateField("custom", "invalid", rule)).toEqual({
        isValid: false,
        error: "Custom error message",
      });

      expect(validateField("custom", "valid", rule)).toEqual({
        isValid: true,
      });
    });

    it("should skip validation for empty non-required fields", () => {
      const rule = { minLength: 5, pattern: VALIDATION_PATTERNS.email };

      expect(validateField("optional", "", rule)).toEqual({
        isValid: true,
      });
    });
  });

  describe("validateForm", () => {
    it("should validate entire form correctly", () => {
      const formData = {
        name: "John",
        email: "invalid-email",
        age: "25",
      };

      const rules = {
        name: { required: true, minLength: 2 },
        email: { required: true, pattern: VALIDATION_PATTERNS.email },
        age: { required: true, pattern: VALIDATION_PATTERNS.numeric },
      };

      const result = validateForm(formData, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty("email");
      expect(result.errors.email).toContain("valid format");
    });

    it("should return valid result for correct data", () => {
      const formData = {
        name: "John Doe",
        email: "john@example.com",
        age: "25",
      };

      const rules = {
        name: { required: true, minLength: 2 },
        email: { required: true, pattern: VALIDATION_PATTERNS.email },
        age: { required: true, pattern: VALIDATION_PATTERNS.numeric },
      };

      const result = validateForm(formData, rules);

      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });
  });

  describe("FormAutoSave", () => {
    let mockOnSave: ReturnType<typeof vi.fn>;
    let autoSave: FormAutoSave;

    beforeEach(() => {
      mockOnSave = vi.fn();
      autoSave = new FormAutoSave("test-form", mockOnSave, 1000);
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should call onSave after interval", () => {
      const formData = { name: "John" };
      autoSave.start(formData);

      expect(mockOnSave).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);

      expect(mockOnSave).toHaveBeenCalledWith(formData);
    });

    it("should stop auto-save when stop is called", () => {
      const formData = { name: "John" };
      autoSave.start(formData);
      autoSave.stop();

      vi.advanceTimersByTime(1000);

      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe("FormAnalyticsTracker", () => {
    let tracker: FormAnalyticsTracker;

    beforeEach(() => {
      tracker = new FormAnalyticsTracker("test-form");
    });

    it("should track field interactions", () => {
      tracker.trackFieldInteraction("name");
      tracker.trackFieldInteraction("name");
      tracker.trackFieldInteraction("email");

      const analytics = tracker.getAnalytics();

      expect(analytics.fieldInteractions.name).toBe(2);
      expect(analytics.fieldInteractions.email).toBe(1);
    });

    it("should track validation errors", () => {
      tracker.trackValidationError("email");
      tracker.trackValidationError("email");

      const analytics = tracker.getAnalytics();

      expect(analytics.validationErrors.email).toBe(2);
    });

    it("should track step changes", () => {
      tracker.trackStepChange("step1");
      tracker.trackStepChange("step2");

      const analytics = tracker.getAnalytics();

      expect(analytics.stepTimes).toHaveProperty("step1");
      expect(analytics.stepTimes).toHaveProperty("step2");
    });

    it("should track completion", () => {
      tracker.trackCompletion();

      const analytics = tracker.getAnalytics();

      expect(analytics.completed).toBe(true);
      expect(analytics.completionTime).toBeInstanceOf(Date);
    });
  });

  describe("FormProgressTracker", () => {
    let tracker: FormProgressTracker;

    beforeEach(() => {
      tracker = new FormProgressTracker(3);
    });

    it("should track current step", () => {
      expect(tracker.getCurrentStep()).toBe(0);

      tracker.setCurrentStep(1);
      expect(tracker.getCurrentStep()).toBe(1);
    });

    it("should track completed steps", () => {
      expect(tracker.isStepCompleted(0)).toBe(false);

      tracker.markStepCompleted(0);
      expect(tracker.isStepCompleted(0)).toBe(true);
    });

    it("should calculate progress correctly", () => {
      expect(tracker.getProgress()).toBe(0);

      tracker.markStepCompleted(0);
      expect(tracker.getProgress()).toBeCloseTo(33.33);

      tracker.markStepCompleted(1);
      expect(tracker.getProgress()).toBeCloseTo(66.67);

      tracker.markStepCompleted(2);
      expect(tracker.getProgress()).toBe(100);
    });

    it("should determine navigation permissions", () => {
      tracker.setCurrentStep(0);

      expect(tracker.canNavigateToStep(0)).toBe(true); // Current step
      expect(tracker.canNavigateToStep(1)).toBe(false); // Next step, current not completed

      tracker.markStepCompleted(0);
      expect(tracker.canNavigateToStep(1)).toBe(true); // Next step, current completed
    });
  });

  describe("FormDependencyResolver", () => {
    let resolver: FormDependencyResolver;

    beforeEach(() => {
      resolver = new FormDependencyResolver();
    });

    it("should add and retrieve dependencies", () => {
      resolver.addDependency("field2", ["field1"]);

      expect(resolver.getDependencies("field2")).toEqual(["field1"]);
      expect(resolver.getDependencies("field1")).toEqual([]);
    });

    it("should determine if field should be validated", () => {
      resolver.addDependency("field2", ["field1"]);

      const formData = { field1: "value1" };

      expect(resolver.shouldValidateField("field1", formData)).toBe(true);
      expect(resolver.shouldValidateField("field2", formData)).toBe(true);

      const emptyFormData = {};
      expect(resolver.shouldValidateField("field2", emptyFormData)).toBe(false);
    });

    it("should return validation order based on dependencies", () => {
      resolver.addDependency("field2", ["field1"]);
      resolver.addDependency("field3", ["field2"]);

      const fields = ["field3", "field2", "field1"];
      const order = resolver.getValidationOrder(fields);

      expect(order).toEqual(["field1", "field2", "field3"]);
    });
  });

  describe("evaluateConditionalRule", () => {
    const formData = {
      type: "premium",
      features: ["feature1", "feature2"],
      count: 5,
      name: "John",
    };

    it("should evaluate equals rule correctly", () => {
      expect(
        evaluateConditionalRule(
          { field: "type", operator: "equals", value: "premium" },
          formData
        )
      ).toBe(true);

      expect(
        evaluateConditionalRule(
          { field: "type", operator: "equals", value: "basic" },
          formData
        )
      ).toBe(false);
    });

    it("should evaluate not-equals rule correctly", () => {
      expect(
        evaluateConditionalRule(
          { field: "type", operator: "not-equals", value: "basic" },
          formData
        )
      ).toBe(true);

      expect(
        evaluateConditionalRule(
          { field: "type", operator: "not-equals", value: "premium" },
          formData
        )
      ).toBe(false);
    });

    it("should evaluate contains rule correctly", () => {
      expect(
        evaluateConditionalRule(
          { field: "features", operator: "contains", value: "feature1" },
          formData
        )
      ).toBe(true);

      expect(
        evaluateConditionalRule(
          { field: "features", operator: "contains", value: "feature3" },
          formData
        )
      ).toBe(false);
    });

    it("should evaluate greater/less rules correctly", () => {
      expect(
        evaluateConditionalRule(
          { field: "count", operator: "greater", value: 3 },
          formData
        )
      ).toBe(true);

      expect(
        evaluateConditionalRule(
          { field: "count", operator: "less", value: 10 },
          formData
        )
      ).toBe(true);

      expect(
        evaluateConditionalRule(
          { field: "count", operator: "greater", value: 10 },
          formData
        )
      ).toBe(false);
    });

    it("should evaluate exists/not-exists rules correctly", () => {
      expect(
        evaluateConditionalRule({ field: "name", operator: "exists" }, formData)
      ).toBe(true);

      expect(
        evaluateConditionalRule(
          { field: "missing", operator: "exists" },
          formData
        )
      ).toBe(false);

      expect(
        evaluateConditionalRule(
          { field: "missing", operator: "not-exists" },
          formData
        )
      ).toBe(true);
    });
  });
});
