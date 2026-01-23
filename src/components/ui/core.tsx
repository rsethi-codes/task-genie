"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "glass" | "ai";
    size?: "sm" | "md" | "lg";
    children: ReactNode;
    loading?: boolean;
    iconOnly?: boolean;
}

export const Button = ({
    variant = "primary",
    size = "md",
    children,
    className,
    loading = false,
    iconOnly = false,
    disabled,
    ...props
}: ButtonProps) => {
    const isDisabled = disabled || loading;

    const variants = {
        primary: "bg-primary text-background hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        secondary: "bg-surface text-text hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        outline: "border border-border text-text hover:bg-surface focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        ghost: "text-text hover:bg-surface focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        glass: "glass text-text hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        ai: "ai-gradient text-white ai-glow hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    };

    const disabledStyles = isDisabled
        ? "opacity-50 cursor-not-allowed pointer-events-none"
        : "";

    const sizes = {
        sm: iconOnly ? "p-1.5" : "px-3 py-1.5 text-sm",
        md: iconOnly ? "p-2.5" : "px-6 py-3 text-base",
        lg: iconOnly ? "p-3.5" : "px-8 py-4 text-lg",
    };

    return (
        <motion.button
            whileHover={!isDisabled ? { scale: 1.02 } : {}}
            whileTap={!isDisabled ? { scale: 0.98 } : {}}
            disabled={isDisabled}
            className={cn(
                "rounded-xl font-bold transition-all flex items-center justify-center gap-2 outline-none",
                variants[variant],
                sizes[size],
                disabledStyles,
                className
            )}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {!iconOnly && <span>Loading...</span>}
                </>
            ) : (
                children
            )}
        </motion.button>
    );
};

interface CardProps extends HTMLMotionProps<"div"> {
    variant?: "default" | "glass" | "ai";
    children: ReactNode;
    tilt?: boolean;
    padding?: "sm" | "md" | "lg" | "none";
}

export const Card = ({
    variant = "default",
    children,
    className,
    tilt = false,
    padding = "md",
    ...props
}: CardProps) => {
    const variants = {
        default: "bg-surface border border-border",
        glass: "glass",
        ai: "bg-surface border border-primary/20 ai-glow",
    };

    const paddingClasses = {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        none: "",
    };

    return (
        <motion.div
            whileHover={tilt ? { rotateX: 2, rotateY: 2, scale: 1.01 } : {}}
            className={cn(
                "rounded-2xl transition-all duration-300",
                variants[variant],
                paddingClasses[padding],
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};
