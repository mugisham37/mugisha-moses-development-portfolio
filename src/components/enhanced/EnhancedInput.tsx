"use client";

import React, {
  forwardRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { clsx } from "clsx";

export type InputVariant = "default" | "filled" | "outlined";
export type InputSize = "sm" | "md" | "lg";

export interface EnhancedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export interface EnhancedTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  resize?: boolean;
}

const inputVariants: Record<InputVariant, string> = {
  default: "bg-white border-2 border-black focus:border-black focus:ring-0",
  filled:
    "bg-gray-100 border-2 border-gray-100 focus:border-black focus:bg-white focus:ring-0",
  outlined:
    "bg-transparent border-2 border-black focus:border-black focus:ring-0",
};

const inputSizes: Record<InputSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  (
    {
      variant = "default",
      size = "md",
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    const inputClasses = clsx(
      // Base styles
      "font-bold transition-all duration-200 ease-in-out",
      "focus:outline-none placeholder:text-gray-500",

      // Variant styles
      inputVariants[variant],

      // Size styles
      inputSizes[size],

      // Conditional styles
      {
        "w-full": fullWidth,
        "border-red-500 focus:border-red-500": hasError,
        "pl-10": leftIcon && size === "sm",
        "pl-12": leftIcon && size === "md",
        "pl-14": leftIcon && size === "lg",
        "pr-10": rightIcon && size === "sm",
        "pr-12": rightIcon && size === "md",
        "pr-14": rightIcon && size === "lg",
      },

      className
    );

    return (
      <div className={clsx("relative", { "w-full": fullWidth })}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-bold text-black mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div
              className={clsx(
                "absolute left-0 top-0 h-full flex items-center justify-center text-gray-500",
                {
                  "w-10": size === "sm",
                  "w-12": size === "md",
                  "w-14": size === "lg",
                }
              )}
            >
              {leftIcon}
            </div>
          )}

          <input ref={ref} id={inputId} className={inputClasses} {...props} />

          {rightIcon && (
            <div
              className={clsx(
                "absolute right-0 top-0 h-full flex items-center justify-center text-gray-500",
                {
                  "w-10": size === "sm",
                  "w-12": size === "md",
                  "w-14": size === "lg",
                }
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {(helperText || error) && (
          <p
            className={clsx("mt-2 text-sm", {
              "text-gray-600": !hasError,
              "text-red-500 font-bold": hasError,
            })}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = "EnhancedInput";

export const EnhancedTextarea = forwardRef<
  HTMLTextAreaElement,
  EnhancedTextareaProps
>(
  (
    {
      variant = "default",
      size = "md",
      label,
      helperText,
      error,
      fullWidth = false,
      resize = true,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    const textareaClasses = clsx(
      // Base styles
      "font-bold transition-all duration-200 ease-in-out",
      "focus:outline-none placeholder:text-gray-500",

      // Variant styles
      inputVariants[variant],

      // Size styles
      inputSizes[size],

      // Conditional styles
      {
        "w-full": fullWidth,
        "border-red-500 focus:border-red-500": hasError,
        "resize-none": !resize,
        "resize-y": resize,
      },

      className
    );

    return (
      <div className={clsx("relative", { "w-full": fullWidth })}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-bold text-black mb-2"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={textareaClasses}
          {...props}
        />

        {(helperText || error) && (
          <p
            className={clsx("mt-2 text-sm", {
              "text-gray-600": !hasError,
              "text-red-500 font-bold": hasError,
            })}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

EnhancedTextarea.displayName = "EnhancedTextarea";

export default EnhancedInput;
