"use client";

import React, { forwardRef, HTMLAttributes } from "react";
import { clsx } from "clsx";

export type CardVariant = "default" | "elevated" | "outlined" | "filled";
export type CardSize = "sm" | "md" | "lg";

export interface EnhancedCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
  interactive?: boolean;
  shadow?: boolean;
  rounded?: boolean;
  children: React.ReactNode;
}

const cardVariants: Record<CardVariant, string> = {
  default: "bg-white border-2 border-black",
  elevated:
    "bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
  outlined: "bg-transparent border-2 border-black",
  filled: "bg-black text-white border-2 border-black",
};

const cardSizes: Record<CardSize, string> = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export const EnhancedCard = forwardRef<HTMLDivElement, EnhancedCardProps>(
  (
    {
      variant = "default",
      size = "md",
      interactive = false,
      shadow = false,
      rounded = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const cardClasses = clsx(
      // Base styles
      "transition-all duration-200 ease-in-out",

      // Variant styles
      cardVariants[variant],

      // Size styles
      cardSizes[size],

      // Conditional styles
      {
        "rounded-none": !rounded,
        "rounded-lg": rounded,
        "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]":
          shadow && variant !== "elevated",
        "cursor-pointer": interactive,
        "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]":
          interactive && (shadow || variant === "elevated"),
        "hover:transform hover:translate-x-[2px] hover:translate-y-[2px]":
          interactive && (shadow || variant === "elevated"),
        "active:shadow-none": interactive && (shadow || variant === "elevated"),
        "active:transform active:translate-x-[4px] active:translate-y-[4px]":
          interactive && (shadow || variant === "elevated"),
        "hover:bg-gray-50": interactive && variant === "default",
        "hover:bg-gray-100": interactive && variant === "outlined",
        "hover:bg-gray-800": interactive && variant === "filled",
      },

      className
    );

    return (
      <div ref={ref} className={cardClasses} {...props}>
        {children}
      </div>
    );
  }
);

EnhancedCard.displayName = "EnhancedCard";

// Card sub-components
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx("mb-4", className)} {...props}>
      {children}
    </div>
  )
);

CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Component = "h3", className, children, ...props }, ref) => (
    <Component
      ref={ref}
      className={clsx("text-xl font-bold mb-2", className)}
      {...props}
    >
      {children}
    </Component>
  )
);

CardTitle.displayName = "CardTitle";

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx("mb-4", className)} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = "CardContent";

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx("mt-auto", className)} {...props}>
      {children}
    </div>
  )
);

CardFooter.displayName = "CardFooter";

export default EnhancedCard;
