"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Save,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Info,
  Loader2,
  RotateCcw,
  Download,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EnhancedInput, EnhancedTextarea } from "./EnhancedInput";
import BrutalistButton from "../ui/BrutalistButton";

// Form validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any, formData?: any) => boolean | string;
  message?: string;
}

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "password"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "file"
    | "date"
    | "number"
    | "url";
  placeholder?: string;
  options?: { value: string; label: string; disabled?: boolean }[];
  validation?: ValidationRule;
  conditional?: {
    field: string;
    value: any;
    operator?: "equals" | "not-equals" | "contains" | "greater" | "less";
  };
  helpText?: string;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string; // for file inputs
  min?: number;
  max?: number;
  step?: number;
  rows?: number; // for textarea
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  validation?: (data: any) => boolean;
  onStepComplete?: (data: any) => void;
}

export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  steps?: FormStep[];
  fields?: FormField[];
  submitText?: string;
  multiStep?: boolean;
  autoSave?: boolean;
  autoSaveInterval?: number; // in milliseconds
  analytics?: boolean;
  showProgress?: boolean;
  allowStepNavigation?: boolean;
  persistData?: boolean;
  onSubmit: (data: any) => Promise<void> | void;
  onStepChange?: (step: number, data: any) => void;
  onValidationError?: (errors: Record<string, string>) => void;
  onAutoSave?: (data: any) => void;
}

export interface FormAnalytics {
  formId: string;
  startTime: Date;
  completionTime?: Date;
  stepTimes: Record<string, number>;
  fieldInteractions: Record<string, number>;
  validationErrors: Record<string, number>;
  abandonmentStep?: number;
  completed: boolean;
}

interface EnhancedFormSystemProps {
  config: FormConfig;
  initialData?: any;
  className?: string;
  onAnalytics?: (analytics: FormAnalytics) => void;
}

const EnhancedFormSystem: React.FC<EnhancedFormSystemProps> = ({
  config,
  initialData = {},
  className,
  onAnalytics,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [analytics, setAnalytics] = useState<FormAnalytics>({
    formId: config.id,
    startTime: new Date(),
    stepTimes: {},
    fieldInteractions: {},
    validationErrors: {},
    completed: false,
  });

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const stepStartTimeRef = useRef<Date>(new Date());

  // Get current fields based on single or multi-step configuration
  const getCurrentFields = useCallback(() => {
    if (config.multiStep && config.steps) {
      return config.steps[currentStep]?.fields || [];
    }
    return config.fields || [];
  }, [config, currentStep]);

  // Auto-save functionality
  const performAutoSave = useCallback(async () => {
    if (!config.autoSave) return;

    setAutoSaveStatus("saving");
    try {
      // Save to localStorage
      if (config.persistData) {
        localStorage.setItem(
          `form-${config.id}`,
          JSON.stringify({
            data: formData,
            timestamp: new Date().toISOString(),
            step: currentStep,
          })
        );
      }

      // Call custom auto-save handler
      if (config.onAutoSave) {
        await config.onAutoSave(formData);
      }

      setAutoSaveStatus("saved");
      setTimeout(() => setAutoSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Auto-save failed:", error);
      setAutoSaveStatus("error");
      setTimeout(() => setAutoSaveStatus("idle"), 3000);
    }
  }, [config, formData, currentStep]);

  // Set up auto-save interval
  useEffect(() => {
    if (!config.autoSave) return;

    const interval = config.autoSaveInterval || 30000; // Default 30 seconds
    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave();
    }, interval);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData, performAutoSave, config.autoSave, config.autoSaveInterval]);

  // Load persisted data on mount
  useEffect(() => {
    if (config.persistData) {
      const saved = localStorage.getItem(`form-${config.id}`);
      if (saved) {
        try {
          const { data, step } = JSON.parse(saved);
          setFormData({ ...initialData, ...data });
          if (config.multiStep && step !== undefined) {
            setCurrentStep(step);
          }
        } catch (error) {
          console.error("Failed to load persisted form data:", error);
        }
      }
    }
  }, [config.id, config.persistData, initialData, config.multiStep]);

  // Validation logic
  const validateField = useCallback(
    (field: FormField, value: any): string => {
      const rules = field.validation;
      if (!rules) return "";

      // Required validation
      if (rules.required && (!value || value.toString().trim() === "")) {
        return rules.message || `${field.label} is required`;
      }

      // Skip other validations if field is empty and not required
      if (!value || value.toString().trim() === "") return "";

      // Length validations
      if (rules.minLength && value.toString().length < rules.minLength) {
        return (
          rules.message ||
          `${field.label} must be at least ${rules.minLength} characters`
        );
      }

      if (rules.maxLength && value.toString().length > rules.maxLength) {
        return (
          rules.message ||
          `${field.label} must be no more than ${rules.maxLength} characters`
        );
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(value.toString())) {
        return rules.message || `${field.label} format is invalid`;
      }

      // Custom validation
      if (rules.custom) {
        const result = rules.custom(value, formData);
        if (typeof result === "string") return result;
        if (!result) return rules.message || `${field.label} is invalid`;
      }

      return "";
    },
    [formData]
  );

  // Check if field should be shown based on conditional logic
  const shouldShowField = useCallback(
    (field: FormField): boolean => {
      if (!field.conditional) return true;

      const {
        field: conditionField,
        value: conditionValue,
        operator = "equals",
      } = field.conditional;
      const fieldValue = formData[conditionField];

      switch (operator) {
        case "equals":
          return fieldValue === conditionValue;
        case "not-equals":
          return fieldValue !== conditionValue;
        case "contains":
          return (
            Array.isArray(fieldValue) && fieldValue.includes(conditionValue)
          );
        case "greater":
          return Number(fieldValue) > Number(conditionValue);
        case "less":
          return Number(fieldValue) < Number(conditionValue);
        default:
          return fieldValue === conditionValue;
      }
    },
    [formData]
  );

  // Handle field value changes
  const handleFieldChange = useCallback(
    (fieldName: string, value: any) => {
      setFormData((prev: any) => ({ ...prev, [fieldName]: value }));
      setTouched((prev) => ({ ...prev, [fieldName]: true }));

      // Track field interaction for analytics
      if (config.analytics) {
        setAnalytics((prev) => ({
          ...prev,
          fieldInteractions: {
            ...prev.fieldInteractions,
            [fieldName]: (prev.fieldInteractions[fieldName] || 0) + 1,
          },
        }));
      }

      // Clear error for this field
      if (errors[fieldName]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    },
    [errors, config.analytics]
  );

  // Validate current step or entire form
  const validateCurrentStep = useCallback(() => {
    const fields = getCurrentFields();
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (!shouldShowField(field)) return;

      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);

    // Track validation errors for analytics
    if (config.analytics && Object.keys(newErrors).length > 0) {
      setAnalytics((prev) => ({
        ...prev,
        validationErrors: {
          ...prev.validationErrors,
          ...Object.keys(newErrors).reduce((acc, key) => {
            acc[key] = (prev.validationErrors[key] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        },
      }));
    }

    if (config.onValidationError && Object.keys(newErrors).length > 0) {
      config.onValidationError(newErrors);
    }

    return Object.keys(newErrors).length === 0;
  }, [getCurrentFields, shouldShowField, validateField, formData, config]);

  // Handle step navigation
  const goToStep = useCallback(
    (stepIndex: number) => {
      if (!config.multiStep || !config.steps) return;

      // Record time spent on current step
      const timeSpent = Date.now() - stepStartTimeRef.current.getTime();
      const currentStepId = config.steps[currentStep]?.id;
      if (currentStepId) {
        setAnalytics((prev) => ({
          ...prev,
          stepTimes: {
            ...prev.stepTimes,
            [currentStepId]: timeSpent,
          },
        }));
      }

      setCurrentStep(stepIndex);
      stepStartTimeRef.current = new Date();

      if (config.onStepChange) {
        config.onStepChange(stepIndex, formData);
      }
    },
    [config, currentStep, formData]
  );

  // Handle next step
  const nextStep = useCallback(() => {
    if (!validateCurrentStep()) return;

    if (config.multiStep && config.steps) {
      const currentStepConfig = config.steps[currentStep];
      if (currentStepConfig.onStepComplete) {
        currentStepConfig.onStepComplete(formData);
      }

      if (currentStep < config.steps.length - 1) {
        goToStep(currentStep + 1);
      }
    }
  }, [validateCurrentStep, config, currentStep, formData, goToStep]);

  // Handle previous step
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateCurrentStep()) return;

      setIsSubmitting(true);
      try {
        await config.onSubmit(formData);

        // Record completion analytics
        if (config.analytics) {
          const completedAnalytics = {
            ...analytics,
            completionTime: new Date(),
            completed: true,
          };
          setAnalytics(completedAnalytics);
          if (onAnalytics) {
            onAnalytics(completedAnalytics);
          }
        }

        // Clear persisted data on successful submission
        if (config.persistData) {
          localStorage.removeItem(`form-${config.id}`);
        }
      } catch (error) {
        console.error("Form submission failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateCurrentStep, config, formData, analytics, onAnalytics]
  );

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
    setCurrentStep(0);
    if (config.persistData) {
      localStorage.removeItem(`form-${config.id}`);
    }
  }, [initialData, config.id, config.persistData]);

  // Export form data
  const exportFormData = useCallback(() => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${config.id}-data.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [formData, config.id]);

  // Render field based on type
  const renderField = useCallback(
    (field: FormField) => {
      if (!shouldShowField(field)) return null;

      const value = formData[field.name] || "";
      const error = errors[field.name];
      const isTouched = touched[field.name];

      const commonProps = {
        id: field.name,
        name: field.name,
        disabled: field.disabled || isSubmitting,
        className: "w-full",
      };

      switch (field.type) {
        case "text":
        case "email":
        case "tel":
        case "url":
        case "number":
        case "date":
          return (
            <EnhancedInput
              key={field.name}
              {...commonProps}
              type={field.type}
              label={field.label}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              error={isTouched ? error : ""}
              helperText={field.helpText}
              min={field.min}
              max={field.max}
              step={field.step}
              fullWidth
            />
          );

        case "password":
          return (
            <EnhancedInput
              key={field.name}
              {...commonProps}
              type={showPassword[field.name] ? "text" : "password"}
              label={field.label}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              error={isTouched ? error : ""}
              helperText={field.helpText}
              rightIcon={
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      [field.name]: !prev[field.name],
                    }))
                  }
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {showPassword[field.name] ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              }
              fullWidth
            />
          );

        case "textarea":
          return (
            <EnhancedTextarea
              key={field.name}
              {...commonProps}
              label={field.label}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              error={isTouched ? error : ""}
              helperText={field.helpText}
              rows={field.rows || 4}
              fullWidth
            />
          );

        case "select":
          return (
            <div key={field.name} className="w-full">
              <label className="block text-sm font-bold text-black mb-2">
                {field.label}
                {field.validation?.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <select
                {...commonProps}
                value={value}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                className={cn(
                  "w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300",
                  isTouched && error && "border-red-500 bg-red-50"
                )}
                multiple={field.multiple}
              >
                <option value="">
                  {field.placeholder || `Select ${field.label}`}
                </option>
                {field.options?.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              {field.helpText && (
                <p className="mt-2 text-sm text-gray-600 font-mono">
                  {field.helpText}
                </p>
              )}
              {isTouched && error && (
                <p className="mt-2 text-sm text-red-500 font-mono flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </p>
              )}
            </div>
          );

        case "checkbox":
          return (
            <div key={field.name} className="w-full">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  {...commonProps}
                  type="checkbox"
                  checked={value || false}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.target.checked)
                  }
                  className="mt-1 w-4 h-4 border-2 border-black focus:ring-0 focus:ring-offset-0"
                />
                <div>
                  <span className="text-sm font-bold text-black">
                    {field.label}
                    {field.validation?.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </span>
                  {field.helpText && (
                    <p className="mt-1 text-sm text-gray-600 font-mono">
                      {field.helpText}
                    </p>
                  )}
                </div>
              </label>
              {isTouched && error && (
                <p className="mt-2 text-sm text-red-500 font-mono flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </p>
              )}
            </div>
          );

        case "radio":
          return (
            <div key={field.name} className="w-full">
              <label className="block text-sm font-bold text-black mb-3">
                {field.label}
                {field.validation?.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={field.name}
                      value={option.value}
                      checked={value === option.value}
                      onChange={(e) =>
                        handleFieldChange(field.name, e.target.value)
                      }
                      disabled={
                        option.disabled || field.disabled || isSubmitting
                      }
                      className="w-4 h-4 border-2 border-black focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-sm font-mono">{option.label}</span>
                  </label>
                ))}
              </div>
              {field.helpText && (
                <p className="mt-2 text-sm text-gray-600 font-mono">
                  {field.helpText}
                </p>
              )}
              {isTouched && error && (
                <p className="mt-2 text-sm text-red-500 font-mono flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </p>
              )}
            </div>
          );

        case "file":
          return (
            <div key={field.name} className="w-full">
              <label className="block text-sm font-bold text-black mb-2">
                {field.label}
                {field.validation?.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <div className="border-3 border-black border-dashed p-6 text-center">
                <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                <input
                  {...commonProps}
                  type="file"
                  onChange={(e) =>
                    handleFieldChange(
                      field.name,
                      field.multiple
                        ? Array.from(e.target.files || [])
                        : e.target.files?.[0]
                    )
                  }
                  accept={field.accept}
                  multiple={field.multiple}
                  className="hidden"
                />
                <label
                  htmlFor={field.name}
                  className="cursor-pointer text-sm font-mono text-blue-600 hover:text-blue-800"
                >
                  Click to upload or drag and drop
                </label>
                {field.accept && (
                  <p className="mt-1 text-xs text-gray-500 font-mono">
                    Accepted formats: {field.accept}
                  </p>
                )}
              </div>
              {field.helpText && (
                <p className="mt-2 text-sm text-gray-600 font-mono">
                  {field.helpText}
                </p>
              )}
              {isTouched && error && (
                <p className="mt-2 text-sm text-red-500 font-mono flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </p>
              )}
            </div>
          );

        default:
          return null;
      }
    },
    [
      shouldShowField,
      formData,
      errors,
      touched,
      isSubmitting,
      handleFieldChange,
      showPassword,
    ]
  );

  const currentFields = getCurrentFields();
  const isLastStep =
    !config.multiStep ||
    !config.steps ||
    currentStep === config.steps.length - 1;
  const progress =
    config.multiStep && config.steps
      ? ((currentStep + 1) / config.steps.length) * 100
      : 100;

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* Form Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider font-mono mb-2">
          {config.title}
        </h2>
        {config.description && (
          <p className="text-lg font-mono opacity-80">{config.description}</p>
        )}
      </div>

      {/* Progress Bar (Multi-step forms) */}
      {config.multiStep && config.showProgress && config.steps && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono font-bold text-sm">
              Step {currentStep + 1} of {config.steps.length}
            </span>
            <span className="font-mono font-bold text-sm">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 border-3 border-black h-4">
            <motion.div
              className="h-full bg-brutalist-yellow border-r-3 border-black"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Step Navigation */}
          {config.allowStepNavigation && (
            <div className="flex justify-center mt-4 space-x-2">
              {config.steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 border-black font-mono font-bold text-sm transition-colors duration-300",
                    index === currentStep
                      ? "bg-brutalist-yellow"
                      : index < currentStep
                      ? "bg-green-200"
                      : "bg-white hover:bg-gray-100"
                  )}
                  disabled={isSubmitting}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Auto-save Status */}
      {config.autoSave && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-mono">
            {autoSaveStatus === "saving" && (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            )}
            {autoSaveStatus === "saved" && (
              <>
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-green-600">Auto-saved</span>
              </>
            )}
            {autoSaveStatus === "error" && (
              <>
                <AlertCircle size={16} className="text-red-600" />
                <span className="text-red-600">Save failed</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportFormData}
              className="p-2 border-2 border-black hover:bg-gray-100 transition-colors duration-300"
              title="Export form data"
            >
              <Download size={16} />
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="p-2 border-2 border-black hover:bg-gray-100 transition-colors duration-300"
              title="Reset form"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-3 border-black p-8"
          >
            {/* Step Title (Multi-step forms) */}
            {config.multiStep && config.steps && (
              <div className="mb-8">
                <h3 className="text-xl font-black uppercase tracking-wider font-mono mb-2">
                  {config.steps[currentStep].title}
                </h3>
                {config.steps[currentStep].description && (
                  <p className="font-mono opacity-80">
                    {config.steps[currentStep].description}
                  </p>
                )}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-6">{currentFields.map(renderField)}</div>
          </motion.div>
        </AnimatePresence>

        {/* Form Actions */}
        <div className="flex items-center justify-between bg-white border-3 border-black p-6">
          <div className="flex items-center gap-4">
            {config.multiStep && currentStep > 0 && (
              <BrutalistButton
                type="button"
                onClick={prevStep}
                disabled={isSubmitting}
                variant="secondary"
                size="md"
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Previous
              </BrutalistButton>
            )}
          </div>

          <div className="flex items-center gap-4">
            {config.multiStep && !isLastStep ? (
              <BrutalistButton
                type="button"
                onClick={nextStep}
                disabled={isSubmitting}
                variant="primary"
                size="md"
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight size={16} />
              </BrutalistButton>
            ) : (
              <BrutalistButton
                type="submit"
                disabled={isSubmitting}
                variant="primary"
                size="md"
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {config.submitText || "Submit"}
                  </>
                )}
              </BrutalistButton>
            )}
          </div>
        </div>
      </form>

      {/* Form Analytics Display (Development mode) */}
      {config.analytics && process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-gray-100 border-2 border-gray-300 rounded">
          <h4 className="font-mono font-bold mb-2">
            Form Analytics (Dev Mode)
          </h4>
          <pre className="text-xs font-mono overflow-auto">
            {JSON.stringify(analytics, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default EnhancedFormSystem;
