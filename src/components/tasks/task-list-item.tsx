"use client";

import { motion } from "framer-motion";
import { Card, Button } from "@/components/ui/core";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface TaskListItemProps {
  id: string;
  title: string;
  category: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "done";
  time?: string;
  subtasks?: number;
  aiSuggested?: boolean;
  delay?: number;
  onToggleComplete?: (id: string) => void;
  onDetailsClick?: () => void;
  view?: "list" | "grid";
  expanded?: boolean;
  onExpand?: () => void;
}

const priorityColors = {
  high: "bg-warning",
  medium: "bg-warning",
  low: "bg-info",
};

export function TaskListItem({
  id,
  title,
  category,
  priority,
  status,
  time,
  subtasks,
  aiSuggested,
  delay = 0,
  onToggleComplete,
  onDetailsClick,
  view = "list",
  expanded = false,
  onExpand,
}: TaskListItemProps) {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete?.(id);
    toast.success(
      status === "done" ? "Task marked as incomplete" : "Task completed!"
    );
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDetailsClick?.();
  };

  if (view === "grid") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.3 }}
        onClick={onExpand}
      >
        <Card className="h-full flex flex-col justify-between hover:border-primary/30 transition-all group cursor-pointer">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60">
                {category}
              </span>
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  priorityColors[priority]
                )}
              />
            </div>
            <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
          <div className="mt-8 pt-4 border-t border-border flex justify-between items-center text-xs font-bold text-text-secondary">
            {subtasks !== undefined && (
              <div className="flex items-center gap-1">
                <Clock size={12} />
                {subtasks} Subtasks
              </div>
            )}
            <span className="uppercase tracking-widest">{status}</span>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ x: 4 }}
      className={cn(
        "group flex items-center justify-between p-5 rounded-xl border transition-all duration-200",
        status === "done"
          ? "bg-surface/40 border-border/60 opacity-70"
          : "bg-surface border-border/60 hover:border-primary/40 hover:shadow-sm"
      )}
      onClick={onExpand}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <button
          onClick={handleToggle}
          className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
            status === "done"
              ? "bg-success border-success text-white"
              : "border-border hover:border-primary group-hover:scale-105"
          )}
          aria-label={
            status === "done"
              ? `Mark "${title}" as incomplete`
              : `Mark "${title}" as complete`
          }
        >
          {status === "done" && <CheckCircle2 size={12} />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <h4
              className={cn(
                "font-semibold text-base leading-tight truncate",
                status === "done" && "line-through text-text-secondary"
              )}
            >
              {title}
            </h4>
            {aiSuggested && (
              <Sparkles
                size={12}
                className="text-primary shrink-0"
                aria-label="AI suggested"
              />
            )}
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] font-bold text-text-secondary/70 uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-hover/60">
              {category}
            </span>
            {time && (
              <div className="flex items-center gap-1.5 text-xs text-text-secondary/70">
                <Clock size={11} />
                <span>{time}</span>
              </div>
            )}
            {subtasks !== undefined && (
              <div className="flex items-center gap-1.5 text-xs text-text-secondary/70">
                <Sparkles size={11} className="text-primary" />
                <span>{subtasks} subtasks</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4 shrink-0">
        <div
          className={cn("w-1.5 h-1.5 rounded-full", priorityColors[priority])}
          aria-label={`Priority: ${priority}`}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDetailsClick}
          className="opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity text-xs px-2"
        >
          Details
        </Button>
      </div>
    </motion.div>
  );
}
