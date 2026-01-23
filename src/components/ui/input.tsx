"use client";

import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showCharCount?: boolean;
  maxLength?: number;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      showCharCount,
      maxLength,
      className,
      value,
      ...props
    },
    ref
  ) => {
    const charCount = typeof value === "string" ? value.length : 0;
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold mb-2 text-text">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            value={value}
            maxLength={maxLength}
            className={cn(
              "w-full bg-surface border rounded-xl px-4 py-3 text-sm transition-all outline-none",
              "focus:border-primary focus:ring-2 focus:ring-primary/20",
              hasError
                ? "border-error focus:border-error focus:ring-error/20"
                : "border-border",
              leftIcon && "pl-11",
              rightIcon && "pr-11",
              props.disabled && "opacity-50 cursor-not-allowed",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText || (showCharCount && maxLength)) && (
          <div className="flex items-center justify-between mt-2">
            <div>
              {error && (
                <p className="text-xs font-medium text-error">{error}</p>
              )}
              {!error && helperText && (
                <p className="text-xs font-medium text-text-secondary">
                  {helperText}
                </p>
              )}
            </div>
            {showCharCount && maxLength && (
              <p
                className={cn(
                  "text-xs font-medium",
                  charCount > maxLength * 0.9
                    ? "text-warning"
                    : "text-text-secondary"
                )}
              >
                {charCount}/{maxLength}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
