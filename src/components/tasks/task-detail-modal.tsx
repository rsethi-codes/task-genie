"use client";

import { useState, useEffect, useMemo } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/core";
import {
  Sparkles,
  X,
  Check,
  PencilLine,
  Lightbulb,
  ArrowRight,
  Clock,
  Trash2,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { ThinkingIndicator } from "./thinking-indicator";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";
import { useTask } from "@/hooks/use-task";

import { TaskNode, NodeStatus, Priority, NodeType } from "@/types/task-node";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | null;
}

export function TaskDetailModal({
  isOpen,
  onClose,
  taskId,
}: TaskDetailModalProps) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const { data: task, isLoading: isTaskLoading } = useTask(taskId);

  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDuration, setEditedDuration] = useState<number | "">("");

  // Derived Data
  const phases = useMemo(() =>
    (task?.children || []).filter(c => c.nodeType === NodeType.PHASE),
    [task]);

  const guidance = useMemo(() =>
    (task?.children || []).filter(c => c.nodeType === NodeType.GUIDANCE),
    [task]);

  const activePhase = useMemo(() =>
    phases.find(p => p.id === activePhaseId),
    [activePhaseId, phases]);

  const activePhaseActions = useMemo(() => {
    if (!activePhase) return [];
    return (activePhase.children || []).filter(c => c.nodeType === NodeType.ACTION || c.nodeType === NodeType.DAILY);
  }, [activePhase]);

  const activePhaseGuidance = useMemo(() => {
    if (!activePhase) return [];
    return (activePhase.children || []).filter(c => c.nodeType === NodeType.GUIDANCE);
  }, [activePhase]);

  const goalProgress = useMemo(() => {
    const allActions = [
      ...(task?.children || []).filter(c => c.nodeType === NodeType.ACTION || c.nodeType === NodeType.DAILY),
      ...phases.flatMap(p => (p.children || []).filter(c => c.nodeType === NodeType.ACTION || c.nodeType === NodeType.DAILY))
    ];
    if (allActions.length === 0) return 0;
    const completed = allActions.filter(a => a.status === NodeStatus.COMPLETED).length;
    return (completed / allActions.length) * 100;
  }, [task, phases]);

  // Set initial active phase
  useEffect(() => {
    if (phases.length > 0 && !activePhaseId) {
      const firstIncomplete = phases.find(p => p.status !== NodeStatus.COMPLETED) || phases[0];
      setActivePhaseId(firstIncomplete.id);
    }
  }, [phases, activePhaseId]);

  // Sync edited fields when task changes
  useEffect(() => {
    if (task) {
      setEditedTitle(task.title);
      setEditedDuration(task.estimatedDuration || "");
    }
  }, [task]);

  // Mutations
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TaskNode> }) => {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error("Failed to update task");
      return response.json();
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["task", id] });
      const previousTask = queryClient.getQueryData<TaskNode>(["task", id]);

      if (previousTask) {
        queryClient.setQueryData(["task", id], {
          ...previousTask,
          ...updates
        });
      }

      return { previousTask };
    },
    onError: (err, { id }, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(["task", id], context.previousTask);
      }
      toast.error("Failed to update task");
    },
    onSettled: (data, err, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["task", id] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to delete task");
    },
    onSuccess: () => {
      toast.success("Task deleted");
      onClose();
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Failed to delete task");
    }
  });

  const regenerateMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks/${id}/generate-nodes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ force: true })
      });
      if (!response.ok) throw new Error("Failed to regenerate plan");
    },
    onSuccess: () => {
      toast.success("Regeneration started");
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
    onError: () => {
      toast.error("Failed to regenerate");
    }
  });

  const handleToggleAction = (actionId: string, currentStatus: NodeStatus) => {
    const newStatus = currentStatus === NodeStatus.COMPLETED ? NodeStatus.ACTIVE : NodeStatus.COMPLETED;
    updateTaskMutation.mutate({ id: actionId, updates: { status: newStatus } });
  };

  const handleUpdateGoal = () => {
    if (!taskId) return;
    updateTaskMutation.mutate({
      id: taskId,
      updates: {
        title: editedTitle,
        estimatedDuration: editedDuration === "" ? undefined : Number(editedDuration)
      }
    });
    setIsEditingGoal(false);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="xl"
      className="bg-background border border-white/10 shadow-3xl p-0 overflow-hidden"
      backdropBlur="xl"
      showCloseButton={false}
    >
      {isTaskLoading || !task ? (
        <div className="h-[85vh] flex items-center justify-center">
          <ThinkingIndicator />
        </div>
      ) : (
        <div className="flex h-[85vh] flex-col md:flex-row">
          {/* Sidebar: Phase Timeline */}
          <div className="w-full md:w-80 bg-surface/50 border-b md:border-b-0 md:border-r border-border/40 p-8 flex flex-col gap-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Trajectory</span>
                {(task.aiGenerationStatus === "PENDING" || task.aiGenerationStatus === "PROCESSING") && <ThinkingIndicator className="scale-75" />}
              </div>

              <div className="space-y-4 relative">
                {phases.length > 1 && (
                  <div className="absolute left-[7px] top-[10px] bottom-[10px] w-0.5 bg-border/30" />
                )}

                {phases.map((phase) => (
                  <button
                    key={phase.id}
                    onClick={() => setActivePhaseId(phase.id)}
                    className={cn(
                      "flex items-start gap-4 text-left group w-full relative z-10 transition-all duration-300",
                      activePhaseId === phase.id ? "opacity-100" : "opacity-40 hover:opacity-100"
                    )}
                  >
                    <div className={cn(
                      "w-3.5 h-3.5 rounded-full border-2 mt-1 transition-all shrink-0",
                      phase.status === NodeStatus.COMPLETED
                        ? "bg-success border-success"
                        : activePhaseId === phase.id
                          ? "bg-primary border-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                          : "bg-background border-border group-hover:border-primary"
                    )} />
                    <div className="space-y-1">
                      <span className={cn(
                        "text-xs font-black uppercase tracking-wider block",
                        activePhaseId === phase.id ? "text-primary" : "text-text-secondary"
                      )}>
                        {phase.title}
                      </span>
                      {activePhaseId === phase.id && (
                        <span className="text-[10px] font-bold text-text-secondary/60">
                          {phase.children?.length || 0} Actions
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-3 pt-6 border-t border-border/20">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-[10px] h-9"
                onClick={() => {
                  if (confirm("Regenerate entire plan? This will replace your current trajectory.")) {
                    regenerateMutation.mutate(task.id);
                  }
                }}
                disabled={regenerateMutation.isPending}
              >
                <RefreshCw size={12} className={cn("mr-2", regenerateMutation.isPending && "animate-spin")} />
                Regenerate Plan
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-[10px] h-9 text-error hover:text-error hover:bg-error/10 border-error/20"
                onClick={() => {
                  if (confirm("Delete this goal? This action cannot be undone.")) {
                    deleteTaskMutation.mutate(task.id);
                  }
                }}
              >
                <Trash2 size={12} className="mr-2" />
                Delete Goal
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-[10px] h-9 text-text-secondary"
                onClick={() => {
                  const newStatus = task.status === NodeStatus.BLOCKED ? NodeStatus.ACTIVE : NodeStatus.BLOCKED;
                  updateTaskMutation.mutate({ id: task.id, updates: { status: newStatus } });
                }}
              >
                {task.status === NodeStatus.BLOCKED ? "Resume Goal" : "Pause Goal"}
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-background/50">
            <div className="p-8 border-b border-border/20 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="bg-primary/10 text-primary text-[9px] font-black px-2 py-0.5 rounded tracking-widest uppercase font-display">Goal</span>
                  <div className="flex items-center gap-2 text-text-secondary/50">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold tracking-tight uppercase">
                      {task.dueDate ? new Date(task.dueDate).toDateString() : "No deadline"}
                    </span>
                  </div>
                  {task.estimatedDuration && (
                    <div className="flex items-center gap-2 text-text-secondary/50 border-l border-border/40 pl-4">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold tracking-tight uppercase">
                        Expected: {task.estimatedDuration}m
                      </span>
                    </div>
                  )}
                  {(task.actualDuration || 0) > 0 && (
                    <div className="flex items-center gap-2 text-primary/70 border-l border-border/40 pl-4">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold tracking-tight uppercase">
                        Actual: {task.actualDuration}m
                      </span>
                    </div>
                  )}
                </div>
                <button onClick={onClose} className="p-2 hover:bg-surface rounded-full transition-colors">
                  <X size={20} className="text-text-secondary" />
                </button>
              </div>

              <div className="space-y-4">
                {isEditingGoal ? (
                  <div className="space-y-4 bg-surface/30 p-4 rounded-xl border border-border/40">
                    <input
                      value={editedTitle}
                      onChange={e => setEditedTitle(e.target.value)}
                      className="text-3xl font-display font-black tracking-tight bg-transparent border-b border-primary/40 focus:outline-none w-full"
                      autoFocus
                      placeholder="Goal Title"
                    />
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1 block">Expected Duration (mins)</label>
                        <input
                          type="number"
                          value={editedDuration}
                          onChange={e => setEditedDuration(e.target.value === "" ? "" : Number(e.target.value))}
                          className="w-full bg-background border border-border/40 rounded-lg px-3 py-1.5 text-sm focus:border-primary/40 focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-2 self-end">
                        <Button variant="outline" size="sm" onClick={() => setIsEditingGoal(false)}>Cancel</Button>
                        <Button onClick={handleUpdateGoal} size="sm">Save Changes</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4 group">
                    <h2 className="text-4xl font-display font-black tracking-tight leading-tight">
                      {task.title}
                    </h2>
                    <button onClick={() => setIsEditingGoal(true)} className="p-2 opacity-0 group-hover:opacity-100 hover:bg-surface rounded-lg transition-all pt-3">
                      <PencilLine size={18} className="text-text-secondary" />
                    </button>
                  </div>
                )}

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] font-black text-text-secondary tracking-[0.2em] uppercase">Target Achievement</span>
                    <span className="text-sm font-black text-primary">{Math.round(goalProgress)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden border border-border/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goalProgress}%` }}
                      className="h-full ai-gradient"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action List */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhaseId || "no-phase"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-10"
                >
                  {(activePhaseGuidance.length > 0 || guidance.length > 0) && (
                    <div className="space-y-4">
                      {[...guidance, ...activePhaseGuidance].map((g) => (
                        <div key={g.id} className="bg-primary/5 border border-primary/10 rounded-2xl p-5 flex gap-4 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                            <Lightbulb size={48} className="text-primary" />
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                            <Lightbulb className="text-primary" size={20} />
                          </div>
                          <div className="space-y-1 relative z-10">
                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Genie Insight</span>
                            <p className="text-sm font-medium leading-relaxed text-text">
                              {g.title}
                            </p>
                            {g.description && <p className="text-xs text-text-secondary/80 leading-relaxed">{g.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary">Execution Checklist</h3>
                      <span className="text-[10px] font-bold text-text-secondary/40">{activePhaseActions.length} Actions</span>
                    </div>

                    <div className="space-y-1">
                      {activePhaseActions.map((action) => (
                        <div
                          key={action.id}
                          className={cn(
                            "group flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 border border-transparent",
                            action.status === NodeStatus.COMPLETED
                              ? "opacity-50 grayscale"
                              : "hover:bg-surface-hover hover:border-border/30"
                          )}
                        >
                          <button
                            onClick={() => handleToggleAction(action.id, action.status)}
                            className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                              action.status === NodeStatus.COMPLETED
                                ? "bg-success border-success text-white"
                                : "border-border/60 hover:border-primary group-hover:scale-110"
                            )}
                          >
                            {action.status === NodeStatus.COMPLETED && <Check size={12} />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-base font-bold tracking-tight transition-all",
                              action.status === NodeStatus.COMPLETED && "line-through text-text-secondary"
                            )}>
                              {action.title}
                            </p>
                            {action.estimatedDuration && (
                              <span className="text-[10px] font-bold text-text-secondary/60 uppercase tracking-widest">⏱ {action.estimatedDuration}m</span>
                            )}
                          </div>
                        </div>
                      ))}

                      {!activePhaseId && (
                        <div className="py-20 text-center space-y-4">
                          <div className="w-16 h-16 rounded-full bg-surface mx-auto flex items-center justify-center opacity-40">
                            <ArrowRight className="text-text-secondary" />
                          </div>
                          <p className="text-sm font-bold text-text-secondary/50">Select a phase to start executing</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="p-8 border-t border-border/20 bg-surface/10 flex gap-4 items-center">
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60">Execution Workspace</p>
                <p className="text-xs font-bold text-text-secondary">Focus on one step at a time.</p>
              </div>
              <Button variant="ghost" onClick={onClose} size="sm" className="h-10">Back to List</Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}