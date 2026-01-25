"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Sparkles,
    AlertCircle,
    Circle,
    List,
    MoreVertical,
    Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskNode, NodeStatus, NodeType } from "@/types/task-node";
import { Card, Button } from "@/components/ui/core";
import { ThinkingIndicator } from "@/components/tasks/thinking-indicator";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface TaskItemProps {
    task: TaskNode;
    delay?: number;
    onToggleComplete: (id: string) => void;
    onDetailsClick: (task: TaskNode) => void;
    isSubtask?: boolean;
}

export function TaskItem({
    task,
    delay = 0,
    onToggleComplete,
    onDetailsClick,
    isSubtask = false
}: TaskItemProps) {
    const subtasks = task.children || [];

    // Spec: Progress is derived ONLY from actions
    const allActions = subtasks.flatMap(child => [
        ...(child.nodeType === NodeType.ACTION || child.nodeType === NodeType.DAILY ? [child] : []),
        ...(child.children || []).filter(c => c.nodeType === NodeType.ACTION || c.nodeType === NodeType.DAILY)
    ]);

    const completedActions = allActions.filter(s => s.status === NodeStatus.COMPLETED).length;
    const progress = allActions.length > 0 ? (completedActions / allActions.length) * 100 : 0;

    const isGenerating = task.aiGenerationStatus === "PROCESSING" || task.aiGenerationStatus === "PENDING";
    const phaseCount = subtasks.filter(s => s.nodeType === 'PHASE').length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full group"
        >
            <Card
                className={cn(
                    "relative overflow-hidden transition-all duration-500 cursor-pointer",
                    task.status === NodeStatus.COMPLETED
                        ? "bg-surface/30 opacity-60 grayscale-[0.5] border-transparent"
                        : "bg-surface shadow-sm hover:shadow-xl border-border/40 hover:border-primary/20"
                )}
                padding="none"
                onClick={() => onDetailsClick(task)}
            >
                {/* Real-time Progress Bar at the absolute top */}
                {allActions.length > 0 && (
                    <div className="absolute top-0 left-0 w-full h-[4px] bg-surface-hover/30">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", damping: 20, stiffness: 100 }}
                            className="h-full ai-gradient shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]"
                        />
                    </div>
                )}

                <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between gap-6">
                        <div className="space-y-4 flex-1 min-w-0">
                            {/* Category & Status Header */}
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-text-secondary/60 uppercase tracking-[0.2em] bg-surface-hover/50 px-2 py-0.5 rounded border border-border/20">
                                    {task.category || "General"}
                                </span>
                                {isGenerating && (
                                    <div className="flex items-center gap-2 text-primary animate-pulse">
                                        <ThinkingIndicator className="scale-50" />
                                        <span className="text-[9px] font-black tracking-widest uppercase">Genie is planning...</span>
                                    </div>
                                )}
                            </div>

                            {/* Goal Title */}
                            <h3 className={cn(
                                "text-2xl md:text-3xl font-display font-black tracking-tight leading-tight transition-all duration-300",
                                task.status === NodeStatus.COMPLETED ? "line-through text-text-secondary" : "text-text"
                            )}>
                                {task.title}
                            </h3>

                            {/* Meta Info */}
                            <div className="flex items-center gap-6 pt-2">
                                <div className="flex items-center gap-2 text-text-secondary/70">
                                    <Clock size={12} className="opacity-60" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'NO DEADLINE'}</span>
                                </div>
                                {allActions.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-1">
                                            {[...Array(Math.min(3, phaseCount))].map((_, i) => (
                                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/40 border border-background" />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.15em]">{allActions.length} Actions</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Corner */}
                        <div className="flex flex-col items-end gap-4 shrink-0">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleComplete(task.id);
                                    if (task.status !== NodeStatus.COMPLETED) {
                                        toast.success("Goal achieved!");
                                    }
                                }}
                                className={cn(
                                    "w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-300",
                                    task.status === NodeStatus.COMPLETED
                                        ? "bg-success border-success text-white shadow-lg shadow-success/20"
                                        : "border-border/40 hover:border-primary hover:bg-primary/5 active:scale-95"
                                )}
                            >
                                {task.status === NodeStatus.COMPLETED ? <CheckCircle2 size={24} /> : <Circle size={20} className="text-text-secondary/40" />}
                            </button>
                            <span className="text-[24px] font-display font-black text-text/10 group-hover:text-text/20 transition-colors">
                                {Math.round(progress)}%
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
