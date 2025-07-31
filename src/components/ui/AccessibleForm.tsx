"use client";

import { useState, useId, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/components/providers/AccessibilityProvider";

interface FormFieldProps {
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  className?: string;
  helpText?: string;
}

export function FormField({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  error,
  placeholder,
  options,
  rows = 4,
  className,
  helpText,
}: FormFieldProps) {
  const fieldId = useId();
  const errorId = useId();
  const helpId = useId();
  const { announceToScreenReader } = useAccessibility();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    onChange(e.target.value);

    // Announce validation errors
    if (error) {
      announceToScreenReader(`Error in ${label}: ${error}`, "assertive");
    }
  };

  const baseInputClasses = cn(
    "w-full p-3 border-3 border-black font-mono bg-white text-black",
    "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    error ? "border-red-500 bg-red-50" : "",
    className
  );

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            id={fieldId}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            rows={rows}
            required={required}
            className={baseInputClasses}
            aria-describedby={
              cn(error ? errorId : "", helpText ? helpId : "").trim() ||
              undefined
            }
            aria-invalid={error ? "true" : "false"}
          />
        );

      case "select":
        return (
          <select
            id={fieldId}
            name={name}
            value={value}
            onChange={handleChange}
            required={required}
            className={baseInputClasses}
            aria-describedby={
              cn(error ? errorId : "", helpText ? helpId : "").trim() ||
              undefined
            }
            aria-invalid={error ? "true" : "false"}
          >
            <option value="">Select an option</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type={type}
            id={fieldId}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            className={baseInputClasses}
            aria-describedby={
              cn(error ? errorId : "", helpText ? helpId : "").trim() ||
              undefined
            }
            aria-invalid={error ? "true" : "false"}
          />
        );
    }
  };

  return (
    <div className="mb-6">
      <label
        htmlFor={fieldId}
        className="block text-sm font-bold font-mono uppercase tracking-wider mb-2"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {helpText && (
        <p id={helpId} className="text-sm font-mono text-gray-600 mb-2">
          {helpText}
        </p>
      )}

      {renderInput()}

      {error && (
        <p
          id={errorId}
          className="error-message text-red-500 text-sm font-mono mt-2"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}

interface AccessibleFormProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
  title?: string;
  description?: string;
}

export default function AccessibleForm({
  children,
  onSubmit,
  className,
  title,
  description,
}: AccessibleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { announceToScreenReader } = useAccessibility();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(e);
      announceToScreenReader("Form submitted successfully", "polite");
    } catch {
      announceToScreenReader(
        "Form submission failed. Please try again.",
        "assertive"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-6", className)}
      noValidate
      aria-label={title}
    >
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-black font-mono uppercase tracking-wider mb-2">
            {title}
          </h2>
          {description && (
            <p className="font-mono text-gray-700">{description}</p>
          )}
        </div>
      )}

      <fieldset disabled={isSubmitting} className="space-y-6">
        <legend className="sr-only">{title || "Form fields"}</legend>
        {children}
      </fieldset>

      {isSubmitting && (
        <div className="text-center py-4" role="status" aria-live="polite">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <span className="sr-only">Submitting form...</span>
        </div>
      )}
    </form>
  );
}
