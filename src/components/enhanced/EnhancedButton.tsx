"use client";

import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

// Enhanced button variants and sizes
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "success"
  | "warning";

export type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface EnhancedButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: boolean;
  shadow?: boolean;
  children: React.ReactNode;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-black text-white border-2 border-black hover:bg-white hover:text-black focus:bg-white focus:text-black",
  secondary:
    "bg-white text-black border-2 border-black hover:bg-black hover:text-white focus:bg-black focus:text-white",
  outline:
    "bg-transparent text-black border-2 border-black hover:bg-black hover:text-white focus:bg-black focus:text-white",
  ghost:
    "bg-transparent text-black border-2 border-transparent hover:border-black hover:bg-black hover:text-white focus:border-black focus:bg-black focus:text-white",
  destructive:
    "bg-red-600 text-white border-2 border-red-600 hover:bg-white hover:text-red-600 focus:bg-white focus:text-red-600",
  success:
    "bg-green-600 text-white border-2 border-green-600 hover:bg-white hover:text-green-600 focus:bg-white focus:text-green-600",
  warning:
    "bg-yellow-500 text-black border-2 border-yellow-500 hover:bg-white hover:text-yellow-600 focus:bg-white focus:text-yellow-600",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm font-bold",
  md: "px-4 py-2 text-base font-bold",
  lg: "px-6 py-3 text-lg font-bold",
  xl: "px-8 py-4 text-xl font-bold",
};

export const EnhancedButton = forwardRef<
  HTMLButtonElement,
  EnhancedButtonProps
>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      rounded = false,
      shadow = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const buttonClasses = clsx(
      // Base styles
      "inline-flex items-center justify-center font-bold transition-all duration-200 ease-in-out",
      "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black",
      "active:transform active:scale-95",

      // Variant styles
      buttonVariants[variant],

      // Size styles
      buttonSizes[size],

      // Conditional styles
      {
        "w-full": fullWidth,
        "rounded-none": !rounded,
        "rounded-md": rounded,
        "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]": shadow,
        "opacity-50 cursor-not-allowed": isDisabled,
        "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]": shadow && !isDisabled,
        "active:shadow-none": shadow && !isDisabled,
      },

      className
    );

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        className={buttonClasses}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {leftIcon && !loading && (
          <span className="mr-2 flex-shrink-0">{leftIcon}</span>
        )}

        <span className="flex-1">{children}</span>

        {rightIcon && <span className="ml-2 flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";

export default EnhancedButton;
