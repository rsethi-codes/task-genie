"use client";

import { ReactNode } from "react";
import { Card, Button } from "./core";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "glass" | "ai";
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card
      className={cn(
        "border-dashed border-2 border-border/50 bg-surface/30",
        className
      )}
      padding="lg"
    >
      <div className="flex flex-col items-center justify-center text-center">
        {icon && (
          <div className="w-16 h-16 rounded-2xl bg-surface-hover flex items-center justify-center mb-4">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-text-secondary mb-6 max-w-sm">
            {description}
          </p>
        )}
        {action && (
          <Button
            variant={action.variant || "outline"}
            size="sm"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </div>
    </Card>
  );
}
