"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useEnhancedForm } from "@/hooks/useEnhancedForm";
import FormRecoverySystem from "./FormRecoverySystem";
import FormAnalyticsDashboard from "./FormAnalyticsDashboard";
import { EnhancedInput, EnhancedTextarea } from "./EnhancedInput";
import BrutalistButton from "../ui/BrutalistButton";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MessageSquare,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VALIDATION_PATTERNS } from "@/utils/formValidation";

export interface EnhancedFormExampleProps {
  className?: string;
  showAnalytics?: boolean;
}

const EnhancedFormExample: React.FC<EnhancedFormExampleProps> = ({
  className,
  showAnalytics = false,
}) => {
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);

  // Define form steps and fields
  const formSteps = [
    {
      id: "personal",
      title: "Personal Information",
      description: "Tell us about yourself",
      fields: [
        {
          name: "firstName",
          label: "First Name",
          type: "text",
          validation: {
            required: true,
            minLength: 2,
            message: "First name must be at least 2 characters long",
          },
        },
        {
          name: "lastName",
          label: "Last Name",
          type: "text",
          validation: {
            required: true,
            minLength: 2,
            message: "Last name must be at least 2 characters long",
          },
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          validation: {
            required: true,
            pattern: VALIDATION_PATTERNS.email,
            message: "Please enter a valid email address",
          },
        },
      ],
    },
    {
      id: "contact",
      title: "Contact Details",
      description: "How can we reach you?",
      fields: [
        {
          name: "phone",
          label: "Phone Number",
          type: "tel",
          validation: {
            pattern: VALIDATION_PATTERNS.phone,
            message: "Please enter a valid phone number",
          },
        },
        {
          name: "company",
          label: "Company",
          type: "text",
          validation: { minLength: 2 },
        },
        {
          name: "position",
          label: "Position",
          type: "text",
          conditional: { field: "company", operator: "exists" },
        },
      ],
    },
    {
      id: "project",
      title: "Project Information",
      description: "Tell us about your project",
      fields: [
        {
          name: "projectType",
          label: "Project Type",
          type: "select",
          validation: { required: true },
          options: [
            { value: "website", label: "Website" },
            { value: "webapp", label: "Web Application" },
            { value: "ecommerce", label: "E-commerce" },
            { value: "other", label: "Other" },
          ],
        },
        {
          name: "budget",
          label: "Budget Range",
          type: "select",
          validation: { required: true },
          options: [
            { value: "5k-10k", label: "$5,000 - $10,000" },
            { value: "10k-25k", label: "$10,000 - $25,000" },
            { value: "25k+", label: "$25,000+" },
          ],
        },
        {
          name: "description",
          label: "Project Description",
          type: "textarea",
          validation: {
            required: true,
            minLength: 50,
            message:
              "Please provide at least 50 characters describing your project",
          },
        },
        {
          name: "timeline",
          label: "Desired Timeline",
          type: "text",
          conditional: {
            field: "projectType",
            operator: "not-equals",
            value: "",
          },
        },
      ],
    },
  ];

  // Form submission handler
  const handleSubmit = async (data: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSubmissionResult({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });

    console.log("Form submitted:", data);
  };

  // Analytics handler
  const handleAnalytics = (analytics: any) => {
    setAnalyticsData((prev) => [...prev, analytics]);
    console.log("Form analytics:", analytics);
  };

  // Initialize enhanced form
  const form = useEnhancedForm({
    formId: "enhanced-contact-form",
    steps: formSteps,
    autoSave: true,
    autoSaveInterval: 10000, // 10 seconds for demo
    analytics: true,
    persistData: true,
    onSubmit: handleSubmit,
    onAnalytics: handleAnalytics,
  });

  // Custom field renderer
  const renderField = (field: any) => {
    const value = form.formState.data[field.name] || "";
    const error = form.formState.errors[field.name];
    const isTouched = form.formState.touched[field.name];

    const commonProps = {
      value,
      onChange: (e: any) => form.updateField(field.name, e.target.value),
      error: isTouched ? error : "",
      disabled: form.formState.isSubmitting,
      fullWidth: true,
    };

    switch (field.type) {
      case "textarea":
        return (
          <EnhancedTextarea
            key={field.name}
            label={field.label}
            placeholder={`Enter your ${field.label.toLowerCase()}`}
            rows={4}
            {...commonProps}
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
              value={value}
              onChange={(e) => form.updateField(field.name, e.target.value)}
              disabled={form.formState.isSubmitting}
              className={cn(
                "w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300",
                isTouched && error && "border-red-500 bg-red-50"
              )}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {isTouched && error && (
              <p className="mt-2 text-sm text-red-500 font-mono">{error}</p>
            )}
          </div>
        );

      default:
        return (
          <EnhancedInput
            key={field.name}
            type={field.type}
            label={field.label}
            placeholder={`Enter your ${field.label.toLowerCase()}`}
            {...commonProps}
          />
        );
    }
  };

  if (submissionResult?.success) {
    return (
      <div className={cn("w-full max-w-4xl mx-auto", className)}>
        <motion.div
          className="bg-white border-3 border-black p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircle size={64} className="mx-auto text-green-600 mb-6" />
          <h2 className="text-3xl font-black uppercase tracking-wider font-mono mb-4">
            Form Submitted Successfully!
          </h2>
          <p className="text-lg font-mono opacity-80 mb-6">
            Thank you for your submission. We'll get back to you soon.
          </p>

          <div className="bg-gray-50 border-2 border-gray-300 p-4 mb-6 text-left">
            <h3 className="font-mono font-bold mb-2">Submitted Data:</h3>
            <pre className="text-sm font-mono overflow-auto">
              {JSON.stringify(submissionResult.data, null, 2)}
            </pre>
          </div>

          <BrutalistButton
            onClick={() => {
              setSubmissionResult(null);
              form.resetForm();
            }}
            className="mr-4"
          >
            Submit Another Form
          </BrutalistButton>

          {showAnalytics && analyticsData.length > 0 && (
            <BrutalistButton
              onClick={() => setShowAnalyticsDashboard(true)}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <BarChart3 size={16} />
              View Analytics
            </BrutalistButton>
          )}
        </motion.div>

        {/* Analytics Dashboard */}
        {showAnalyticsDashboard && (
          <div className="mt-8">
            <FormAnalyticsDashboard
              analytics={analyticsData}
              onExport={(data) => {
                const dataStr = JSON.stringify(data, null, 2);
                const dataBlob = new Blob([dataStr], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "form-analytics.json";
                link.click();
                URL.revokeObjectURL(url);
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* Form Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider font-mono mb-4">
          Enhanced Contact Form
        </h2>
        <p className="text-lg font-mono opacity-80">
          Experience our advanced form system with auto-save, validation, and
          analytics
        </p>
      </motion.div>

      {/* Form Recovery System */}
      <FormRecoverySystem
        formId="enhanced-contact-form"
        currentData={form.formState.data}
        currentStep={form.formState.currentStep}
        onRestore={(data, step) => {
          Object.entries(data).forEach(([key, value]) => {
            form.updateField(key, value);
          });
          if (step !== undefined) {
            form.goToStep(step);
          }
        }}
        onClear={() => form.resetForm()}
        className="mb-8"
      />

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono font-bold text-sm">
            Step {form.formState.currentStep + 1} of {form.totalSteps}
          </span>
          <span className="font-mono font-bold text-sm">
            {Math.round(form.getProgress())}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 border-3 border-black h-4">
          <motion.div
            className="h-full bg-brutalist-yellow border-r-3 border-black"
            initial={{ width: 0 }}
            animate={{ width: `${form.getProgress()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Form Content */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.submitForm();
        }}
      >
        <motion.div
          key={form.formState.currentStep}
          className="bg-white border-3 border-black p-8 mb-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {form.formState.currentStep === 0 && <User size={24} />}
              {form.formState.currentStep === 1 && <Phone size={24} />}
              {form.formState.currentStep === 2 && <Briefcase size={24} />}
              <h3 className="text-2xl font-black uppercase tracking-wider font-mono">
                {formSteps[form.formState.currentStep].title}
              </h3>
            </div>
            <p className="font-mono opacity-80">
              {formSteps[form.formState.currentStep].description}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {form.getVisibleFields().map(renderField)}
          </div>
        </motion.div>

        {/* Form Actions */}
        <div className="flex items-center justify-between bg-white border-3 border-black p-6">
          <div>
            {!form.isFirstStep && (
              <BrutalistButton
                type="button"
                onClick={form.prevStep}
                disabled={form.formState.isSubmitting}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Previous
              </BrutalistButton>
            )}
          </div>

          <div className="flex items-center gap-4">
            {!form.isLastStep ? (
              <BrutalistButton
                type="button"
                onClick={form.nextStep}
                disabled={form.formState.isSubmitting}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight size={16} />
              </BrutalistButton>
            ) : (
              <BrutalistButton
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex items-center gap-2"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <MessageSquare size={16} />
                    Submit Form
                  </>
                )}
              </BrutalistButton>
            )}
          </div>
        </div>
      </form>

      {/* Form State Debug (Development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-gray-100 border-2 border-gray-300 rounded">
          <h4 className="font-mono font-bold mb-2">Form State (Dev Mode)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
            <div>
              <strong>Data:</strong>
              <pre className="mt-1 overflow-auto">
                {JSON.stringify(form.formState.data, null, 2)}
              </pre>
            </div>
            <div>
              <strong>Errors:</strong>
              <pre className="mt-1 overflow-auto">
                {JSON.stringify(form.formState.errors, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedFormExample;
