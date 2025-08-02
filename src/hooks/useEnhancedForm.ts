"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ValidationRule,
  ValidationResult,
  FormAutoSave,
  FormAnalyticsTracker,
  FormProgressTracker,
  FormDependencyResolver,
  validateForm,
  evaluateConditionalRule,
  ConditionalRule,
} from "@/utils/formValidation";

export interface FormField {
  name: string;
  label: string;
  type: string;
  validation?: ValidationRule;
  conditional?: ConditionalRule;
  dependencies?: string[];
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  validation?: (data: any) => boolean;
}

export interface UseEnhancedFormOptions {
  formId: string;
  initialData?: any;
  steps?: FormStep[];
  fields?: FormField[];
  autoSave?: boolean;
  autoSaveInterval?: number;
  analytics?: boolean;
  persistData?: boolean;
  onSubmit: (data: any) => Promise<void> | void;
  onStepChange?: (step: number, data: any) => void;
  onAutoSave?: (data: any) => Promise<void> | void;
  onAnalytics?: (analytics: any) => void;
}

export interface FormState {
  data: any;
  errors: Record<string, string>;
  warnings: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  currentStep: number;
  autoSaveStatus: "idle" | "saving" | "saved" | "error";
}

export function useEnhancedForm(options: UseEnhancedFormOptions) {
  const {
    formId,
    initialData = {},
    steps,
    fields,
    autoSave = false,
    autoSaveInterval = 30000,
    analytics = false,
    persistData = false,
    onSubmit,
    onStepChange,
    onAutoSave,
    onAnalytics,
  } = options;

  // Form state
  const [formState, setFormState] = useState<FormState>({
    data: initialData,
    errors: {},
    warnings: {},
    touched: {},
    isSubmitting: false,
    isDirty: false,
    isValid: false,
    currentStep: 0,
    autoSaveStatus: "idle",
  });

  // Refs for utilities
  const autoSaveRef = useRef<FormAutoSave | null>(null);
  const analyticsRef = useRef<FormAnalyticsTracker | null>(null);
  const progressRef = useRef<FormProgressTracker | null>(null);
  const dependencyRef = useRef<FormDependencyResolver | null>(null);

  // Initialize utilities
  useEffect(() => {
    if (autoSave && onAutoSave) {
      autoSaveRef.current = new FormAutoSave(
        formId,
        onAutoSave,
        autoSaveInterval
      );
    }

    if (analytics) {
      analyticsRef.current = new FormAnalyticsTracker(formId);
    }

    if (steps) {
      progressRef.current = new FormProgressTracker(steps.length);
    }

    dependencyRef.current = new FormDependencyResolver();

    // Set up field dependencies
    const allFields = steps
      ? steps.flatMap((step) => step.fields)
      : fields || [];
    allFields.forEach((field) => {
      if (field.dependencies) {
        dependencyRef.current?.addDependency(field.name, field.dependencies);
      }
    });

    // Load persisted data
    if (persistData) {
      const saved = autoSaveRef.current?.loadFromLocalStorage();
      if (saved) {
        setFormState((prev) => ({
          ...prev,
          data: { ...initialData, ...saved },
          isDirty: true,
        }));
      }
    }

    return () => {
      autoSaveRef.current?.stop();
    };
  }, [
    formId,
    autoSave,
    analytics,
    steps,
    fields,
    autoSaveInterval,
    onAutoSave,
    persistData,
    initialData,
  ]);

  // Get current fields based on step or all fields
  const getCurrentFields = useCallback(() => {
    if (steps) {
      return steps[formState.currentStep]?.fields || [];
    }
    return fields || [];
  }, [steps, fields, formState.currentStep]);

  // Get visible fields based on conditional logic
  const getVisibleFields = useCallback(() => {
    const currentFields = getCurrentFields();
    return currentFields.filter((field) => {
      if (!field.conditional) return true;
      return evaluateConditionalRule(field.conditional, formState.data);
    });
  }, [getCurrentFields, formState.data]);

  // Validate current step or form
  const validateCurrentStep = useCallback(() => {
    const visibleFields = getVisibleFields();
    const validationRules: Record<string, ValidationRule> = {};

    visibleFields.forEach((field) => {
      if (
        field.validation &&
        dependencyRef.current?.shouldValidateField(field.name, formState.data)
      ) {
        validationRules[field.name] = field.validation;
      }
    });

    const result = validateForm(formState.data, validationRules);

    setFormState((prev) => ({
      ...prev,
      errors: result.errors,
      warnings: result.warnings,
      isValid: result.isValid,
    }));

    // Track validation errors
    if (analyticsRef.current && Object.keys(result.errors).length > 0) {
      Object.keys(result.errors).forEach((field) => {
        analyticsRef.current?.trackValidationError(field);
      });
    }

    return result.isValid;
  }, [getVisibleFields, formState.data]);

  // Update field value
  const updateField = useCallback((fieldName: string, value: any) => {
    setFormState((prev) => {
      const newData = { ...prev.data, [fieldName]: value };
      const newTouched = { ...prev.touched, [fieldName]: true };

      // Clear error for this field
      const newErrors = { ...prev.errors };
      delete newErrors[fieldName];

      // Track field interaction
      if (analyticsRef.current) {
        analyticsRef.current.trackFieldInteraction(fieldName);
      }

      // Start auto-save
      if (autoSaveRef.current) {
        setFormState((current) => ({ ...current, autoSaveStatus: "saving" }));
        autoSaveRef.current.start(newData);
      }

      return {
        ...prev,
        data: newData,
        touched: newTouched,
        errors: newErrors,
        isDirty: true,
      };
    });
  }, []);

  // Navigate to step
  const goToStep = useCallback(
    (stepIndex: number) => {
      if (!steps || stepIndex < 0 || stepIndex >= steps.length) return;

      // Track step change
      if (analyticsRef.current) {
        analyticsRef.current.trackStepChange(steps[formState.currentStep].id);
      }

      setFormState((prev) => ({ ...prev, currentStep: stepIndex }));

      if (onStepChange) {
        onStepChange(stepIndex, formState.data);
      }
    },
    [steps, formState.currentStep, formState.data, onStepChange]
  );

  // Go to next step
  const nextStep = useCallback(() => {
    if (!validateCurrentStep()) return false;

    if (steps && formState.currentStep < steps.length - 1) {
      // Mark current step as completed
      progressRef.current?.markStepCompleted(formState.currentStep);
      goToStep(formState.currentStep + 1);
      return true;
    }
    return false;
  }, [validateCurrentStep, steps, formState.currentStep, goToStep]);

  // Go to previous step
  const prevStep = useCallback(() => {
    if (formState.currentStep > 0) {
      goToStep(formState.currentStep - 1);
      return true;
    }
    return false;
  }, [formState.currentStep, goToStep]);

  // Submit form
  const submitForm = useCallback(async () => {
    if (!validateCurrentStep()) return false;

    setFormState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      await onSubmit(formState.data);

      // Track completion
      if (analyticsRef.current) {
        analyticsRef.current.trackCompletion();
        if (onAnalytics) {
          onAnalytics(analyticsRef.current.getAnalytics());
        }
      }

      // Clear persisted data
      if (persistData) {
        autoSaveRef.current?.clearLocalStorage();
      }

      // Reset form state
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        isDirty: false,
        touched: {},
        errors: {},
        warnings: {},
      }));

      return true;
    } catch (error) {
      console.error("Form submission failed:", error);
      setFormState((prev) => ({ ...prev, isSubmitting: false }));
      return false;
    }
  }, [validateCurrentStep, onSubmit, formState.data, onAnalytics, persistData]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormState({
      data: initialData,
      errors: {},
      warnings: {},
      touched: {},
      isSubmitting: false,
      isDirty: false,
      isValid: false,
      currentStep: 0,
      autoSaveStatus: "idle",
    });

    // Clear auto-save data
    if (persistData) {
      autoSaveRef.current?.clearLocalStorage();
    }

    // Reset progress tracker
    if (progressRef.current) {
      progressRef.current = new FormProgressTracker(steps?.length || 1);
    }
  }, [initialData, persistData, steps]);

  // Export form data
  const exportFormData = useCallback(() => {
    const dataStr = JSON.stringify(formState.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formId}-data.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [formState.data, formId]);

  // Get form progress
  const getProgress = useCallback(() => {
    if (progressRef.current) {
      return progressRef.current.getProgress();
    }
    return steps ? ((formState.currentStep + 1) / steps.length) * 100 : 100;
  }, [steps, formState.currentStep]);

  // Check if step can be navigated to
  const canNavigateToStep = useCallback((stepIndex: number) => {
    if (progressRef.current) {
      return progressRef.current.canNavigateToStep(stepIndex);
    }
    return true;
  }, []);

  // Handle auto-save status updates
  useEffect(() => {
    if (autoSaveRef.current && formState.autoSaveStatus === "saving") {
      const timer = setTimeout(() => {
        setFormState((prev) => ({ ...prev, autoSaveStatus: "saved" }));
        setTimeout(() => {
          setFormState((prev) => ({ ...prev, autoSaveStatus: "idle" }));
        }, 2000);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [formState.autoSaveStatus]);

  return {
    // State
    formState,

    // Field management
    updateField,
    getCurrentFields,
    getVisibleFields,

    // Validation
    validateCurrentStep,

    // Navigation
    goToStep,
    nextStep,
    prevStep,
    canNavigateToStep,

    // Form actions
    submitForm,
    resetForm,
    exportFormData,

    // Progress
    getProgress,

    // Utilities
    isFirstStep: formState.currentStep === 0,
    isLastStep: !steps || formState.currentStep === steps.length - 1,
    totalSteps: steps?.length || 1,
  };
}

export default useEnhancedForm;
