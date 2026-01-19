"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "glass" | "ai";
    size?: "sm" | "md" | "lg";
    children: ReactNode;
}

export const Button = ({
    variant = "primary",
    size = "md",
    children,
    className,
    ...props
}: ButtonProps) => {
    const variants = {
        primary: "bg-primary text-background hover:opacity-90",
        secondary: "bg-surface text-text hover:bg-surface-hover",
        outline: "border border-border text-text hover:bg-surface",
        ghost: "text-text hover:bg-surface",
        glass: "glass text-text hover:bg-white/10",
        ai: "ai-gradient text-white ai-glow hover:opacity-90",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
};

interface CardProps extends HTMLMotionProps<"div"> {
    variant?: "default" | "glass" | "ai";
    children: ReactNode;
    tilt?: boolean;
}

export const Card = ({
    variant = "default",
    children,
    className,
    tilt = false,
    ...props
}: CardProps) => {
    const variants = {
        default: "bg-surface border border-border",
        glass: "glass",
        ai: "bg-surface border border-primary/20 ai-glow",
    };

    return (
        <motion.div
            whileHover={tilt ? { rotateX: 2, rotateY: 2, scale: 1.01 } : {}}
            className={cn(
                "rounded-2xl p-6 transition-all duration-300",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};
