"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/core";
import { Clock, Sparkles, CheckCircle2, Circle, CheckCircle, X, Loader2, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { ThinkingIndicator } from "./thinking-indicator";

interface Subtask {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed";
  estimatedDuration?: number;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "DRAFT" | "ACTIVE" | "BLOCKED" | "COMPLETED" | "ARCHIVED";
  group?: string;
  subtasks?: Subtask[] | number;
  time?: string;
  aiSuggested?: boolean;
  aiMetadata?: {
    reasoning?: string;
  };
}

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onToggleComplete?: (taskId: string) => void;
}

export function TaskDetailModal({
  isOpen,
  onClose,
  task: initialTask,
  onToggleComplete,
}: TaskDetailModalProps) {
  const { getToken } = useAuth();
  const [task, setTask] = useState<Task | null>(initialTask);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [isLoadingSubtasks, setIsLoadingSubtasks] = useState(false);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    setTask(initialTask);
    if (isOpen && initialTask) {
      fetchTaskDetails(initialTask.id);
    }
  }, [isOpen, initialTask]);

  const fetchTaskDetails = async (id: string, silent = false) => {
    if (!silent) setIsLoadingSubtasks(true);
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTask(data);
        setSubtasks(data.subtasks || []);

        // Polling logic for subtasks
        if ((!data.subtasks || data.subtasks.length === 0) && pollCount < 5 && data.status !== 'COMPLETED') {
          setTimeout(() => setPollCount(p => p + 1), 2000);
        }
      }
    } catch (err) {
      console.error("Failed to fetch task details", err);
    } finally {
      if (!silent) setIsLoadingSubtasks(false);
    }
  };

  const handleRefine = async (newSubtasks: Subtask[]) => {
    try {
      const token = await getToken();
      if (!token || !task) return;

      await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks/${task.id}/refine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ subtasks: newSubtasks })
      });
    } catch (err) {
      console.error("Refinement failed", err);
    }
  };

  useEffect(() => {
    if (pollCount > 0 && pollCount <= 5 && isOpen && task) {
      fetchTaskDetails(task.id, true);
    }
  }, [pollCount, isOpen]);

  const handleDeleteSubtask = async (subtaskId: string) => {
    const updated = subtasks.filter(s => s.id !== subtaskId);
    setSubtasks(updated);
    toast.success("Step removed from trajectory");
    handleRefine(updated);
  };

  const handleToggleSubtask = async (subtaskId: string) => {
    const updated = subtasks.map(s =>
      s.id === subtaskId ? { ...s, status: s.status === 'completed' ? 'pending' : 'completed' } : s
    );
    setSubtasks(updated as any);
    handleRefine(updated as any);
  };

  if (!task) return null;

  const priorityColors = {
    HIGH: "bg-warning shadow-warning/40",
    MEDIUM: "bg-primary shadow-primary/40",
    LOW: "bg-info shadow-info/40",
    URGENT: "bg-error shadow-error/40",
    high: "bg-warning shadow-warning/40",
    medium: "bg-primary shadow-primary/40",
    low: "bg-info shadow-info/40",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="lg"
      className="bg-background/40 backdrop-blur-3xl border border-white/10 shadow-3xl"
      backdropBlur="xl"
      showCloseButton={false}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={cn("w-3 h-3 rounded-full shadow-lg shrink-0", priorityColors[task.priority])} />
              <div className="flex bg-surface/40 backdrop-blur-sm border border-border/40 rounded-full px-3 py-1 items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">
                  {task.category}
                </span>
                {task.group && (
                  <>
                    <div className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                      {task.group}
                    </span>
                  </>
                )}
              </div>
            </div>
            <h3 className="text-3xl font-display font-black tracking-tight leading-tight">
              {task.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface/50 rounded-full transition-colors"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* AI Insight/Description - Now higher up for immediate context */}
        {(task.description || task.aiMetadata?.reasoning) && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-primary/5 border border-primary/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
              <Sparkles size={64} className="text-primary" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                  Genie Context
                </p>
              </div>
              <div className="space-y-3">
                {task.description && (
                  <p className="text-base text-text leading-relaxed font-medium">
                    {task.description}
                  </p>
                )}
                {task.aiMetadata?.reasoning && (
                  <p className="text-[13px] text-text-secondary/80 italic leading-relaxed border-l-2 border-primary/30 pl-4 py-1">
                    &ldquo;{task.aiMetadata.reasoning}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Subtasks Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="text-xs font-black text-text-secondary uppercase tracking-[0.2em]">
                Trajectory Plan
              </p>
              {(isLoadingSubtasks || (subtasks.length === 0 && pollCount < 5)) && (
                <ThinkingIndicator />
              )}
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {subtasks.length === 0 && !isLoadingSubtasks && pollCount >= 5 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 bg-surface/20 rounded-3xl border border-dashed border-border/50 flex flex-col items-center justify-center text-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-surface/40 flex items-center justify-center">
                    <Sparkles size={28} className="text-primary/20" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold">Plan is still cooking...</p>
                    <p className="text-xs text-text-secondary max-w-[240px]">Genie is taking a bit longer to refine your trajectory. It will appear here shortly.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => { setPollCount(0); fetchTaskDetails(task.id); }} className="mt-2">
                    Nudge Genie
                  </Button>
                </motion.div>
              ) : (
                subtasks.map((sub, i) => (
                  <motion.div
                    key={sub.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
                      sub.status === 'completed'
                        ? "bg-surface/20 border-transparent opacity-50"
                        : "bg-surface/40 border-border/40 hover:border-primary/40 hover:bg-surface/60"
                    )}
                  >
                    <button
                      onClick={() => handleToggleSubtask(sub.id)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                        sub.status === 'completed'
                          ? "bg-success border-success text-white"
                          : "border-border/60 hover:border-primary group-hover:scale-110"
                      )}
                    >
                      {sub.status === 'completed' && <Check size={14} />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-sm font-bold tracking-tight", sub.status === 'completed' && "line-through text-text-secondary")}>
                        {sub.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {sub.estimatedDuration && (
                        <span className="text-[10px] font-black text-text-secondary/60 uppercase tracking-widest bg-surface/60 px-2 py-1 rounded-lg">
                          {sub.estimatedDuration}m
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteSubtask(sub.id)}
                        className="p-1.5 opacity-0 group-hover:opacity-100 hover:text-error transition-all rounded-lg hover:bg-error/10"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex gap-4 pt-6 border-t border-border/20">
          {onToggleComplete && (
            <Button
              variant={task.status === "COMPLETED" ? "outline" : "ai"}
              onClick={() => {
                onToggleComplete?.(task.id);
              }}
              className="flex-[2] h-12 rounded-2xl shadow-xl shadow-primary/10"
            >
              {task.status === "COMPLETED" ? (
                <div className="flex items-center gap-2">
                  <Circle size={18} />
                  <span>Resume Focus</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>Mark as Achievement</span>
                </div>
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 h-12 rounded-2xl bg-surface/30 hover:bg-surface/50"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
