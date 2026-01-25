"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/core";
import {
  Sparkles,
  CheckCircle2,
  Circle,
  X,
  AlertCircle,
  Check,
  Plus,
  Trash2,
  PencilLine,
  GripVertical,
  ChevronRight,
  Lightbulb,
  ArrowRight,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { ThinkingIndicator } from "./thinking-indicator";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";

import { TaskNode, NodeStatus, Priority, NodeType, TemporalIntent } from "@/types/task-node";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskNode | null;
  onToggleComplete?: (taskId: string) => void;
  onTaskDeleted?: (taskId: string) => void;
}

export function TaskDetailModal({
  isOpen,
  onClose,
  task: initialTask,
  onToggleComplete,
  onTaskDeleted,
}: TaskDetailModalProps) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const [task, setTask] = useState<TaskNode | null>(initialTask);
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  // Derived Data
  const phases = useMemo(() =>
    (task?.children || []).filter(c => c.nodeType === NodeType.PHASE),
    [task]);

  const guidance = useMemo(() =>
    (task?.children || []).filter(c => c.nodeType === NodeType.GUIDANCE),
    [task]);

  // Actions for the active phase
  const activePhaseActions = useMemo(() => {
    if (!activePhaseId) return [];
    const phase = phases.find(p => p.id === activePhaseId);
    return (phase?.children || []).filter(c => c.nodeType === NodeType.ACTION || c.nodeType === NodeType.DAILY);
  }, [activePhaseId, phases]);

  // Guidance for the active phase
  const activePhaseGuidance = useMemo(() => {
    if (!activePhaseId) return [];
    const phase = phases.find(p => p.id === activePhaseId);
    return (phase?.children || []).filter(c => c.nodeType === NodeType.GUIDANCE);
  }, [activePhaseId, phases]);

  // Overall Goal Progress (Calculated from ALL actions in ALL phases)
  const goalProgress = useMemo(() => {
    const allActions = [
      ...(task?.children || []).filter(c => c.nodeType === NodeType.ACTION || c.nodeType === NodeType.DAILY),
      ...phases.flatMap(p => (p.children || []).filter(c => c.nodeType === NodeType.ACTION || c.nodeType === NodeType.DAILY))
    ];
    if (allActions.length === 0) return 0;
    const completed = allActions.filter(a => a.status === NodeStatus.COMPLETED).length;
    return (completed / allActions.length) * 100;
  }, [task, phases]);

  const fetchTaskDetails = useCallback(async (id: string, silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data: TaskNode = await res.json();
        setTask(data);

        // Auto-select active phase if not set
        if (data.children) {
          const fetchedPhases = data.children.filter(c => c.nodeType === NodeType.PHASE);
          if (fetchedPhases.length > 0 && !activePhaseId) {
            const firstIncomplete = fetchedPhases.find(p => p.status !== NodeStatus.COMPLETED) || fetchedPhases[0];
            setActivePhaseId(firstIncomplete.id);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch task details", err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [getToken, activePhaseId]);

  useEffect(() => {
    if (isOpen && initialTask) {
      setTask(initialTask);
      setEditedTitle(initialTask.title);
      fetchTaskDetails(initialTask.id);
    }
  }, [isOpen, initialTask, fetchTaskDetails]);

  // Real-time task room subscription
  useEffect(() => {
    if (!socket || !isOpen || !task?.id) return;
    socket.emit("join-task", task.id);
    const handleUpdate = (payload: { taskId: string; status: string }) => {
      if (payload.taskId === task.id) {
        fetchTaskDetails(task.id, true);
        if (payload.status === 'READY') toast.success("Genie ready!");
      }
    };
    socket.on("task:status-updated", handleUpdate);
    return () => {
      socket.emit("leave-task", task.id);
      socket.off("task:status-updated", handleUpdate);
    };
  }, [socket, isOpen, task?.id, fetchTaskDetails]);

  const handleToggleAction = async (actionId: string, currentStatus: NodeStatus) => {
    const newStatus = currentStatus === NodeStatus.COMPLETED ? NodeStatus.ACTIVE : NodeStatus.COMPLETED;

    // Optimistic UI
    setTask(prev => {
      if (!prev) return null;
      const updateChildren = (children: TaskNode[]): TaskNode[] => {
        return children.map(c => {
          if (c.id === actionId) return { ...c, status: newStatus };
          if (c.children) return { ...c, children: updateChildren(c.children) };
          return c;
        });
      };
      return { ...prev, children: updateChildren(prev.children || []) };
    });

    try {
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks/${actionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } catch (err) {
      fetchTaskDetails(task!.id, true);
    }
  };

  const handleUpdateGoal = async () => {
    if (!task) return;
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: editedTitle })
      });
      if (res.ok) {
        setTask(await res.json());
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        setIsEditingGoal(false);
        toast.success("Goal updated");
      }
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  if (!task) return null;

  const isGenerating = task.aiGenerationStatus === "PENDING" || task.aiGenerationStatus === "PROCESSING";

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
      <div className="flex h-[85vh] flex-col md:flex-row">
        {/* Sidebar: Phase Timeline */}
        <div className="w-full md:w-80 bg-surface/50 border-b md:border-b-0 md:border-r border-border/40 p-8 flex flex-col gap-10">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Trajectory</span>
              {isGenerating && <ThinkingIndicator className="scale-75" />}
            </div>

            <div className="space-y-4 relative">
              {/* Vertical line connector */}
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

              {phases.length === 0 && !isGenerating && (
                <div className="py-4 text-center">
                  <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest leading-relaxed">
                    No structure generated.<br />Try regenerating or adding steps.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-border/20">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-[10px] h-9"
              onClick={() => {
                if (confirm("Regenerate entire plan?")) {
                  /* handleRetryGeneration */
                }
              }}
            >
              Regenerate Plan
            </Button>
          </div>
        </div>

        {/* Main Content Area: Execution Workspace */}
        <div className="flex-1 flex flex-col bg-background/50">
          {/* Workspace Header */}
          <div className="p-8 border-b border-border/20 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 text-primary text-[9px] font-black px-2 py-0.5 rounded tracking-widest uppercase">Goal</span>
                <div className="flex items-center gap-2 text-text-secondary/50">
                  <Clock size={12} />
                  <span className="text-[10px] font-bold tracking-tight uppercase">
                    {task.dueDate ? new Date(task.dueDate).toDateString() : "No deadline"}
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-surface rounded-full transition-colors">
                <X size={20} className="text-text-secondary" />
              </button>
            </div>

            <div className="space-y-4">
              {isEditingGoal ? (
                <div className="flex gap-2">
                  <input
                    value={editedTitle}
                    onChange={e => setEditedTitle(e.target.value)}
                    className="text-4xl font-display font-black tracking-tight bg-transparent border-b border-primary/40 focus:outline-none w-full"
                    autoFocus
                  />
                  <Button onClick={handleUpdateGoal} size="sm">Save</Button>
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

              {/* Goal Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[11px] font-black text-text-secondary tracking-[0.2em] uppercase">Target Achievement</span>
                  <span className="text-sm font-black text-primary">{Math.round(goalProgress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goalProgress}%` }}
                    className="h-full ai-gradient"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action List Section */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePhaseId || "no-phase"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                {/* Phase Guidance Callout */}
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
                          <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Contextual Insight</span>
                          <p className="text-sm font-medium leading-relaxed text-text">
                            {g.title}
                          </p>
                          {g.description && <p className="text-xs text-text-secondary/80 leading-relaxed">{g.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions Checklist */}
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
                            ? "opacity-50 grayscale pt-2 pb-2"
                            : "hover:bg-surface-hover hover:border-border/30"
                        )}
                      >
                        <button
                          onClick={() => handleToggleAction(action.id, action.status)}
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
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
                        </div>
                      </div>
                    ))}

                    {!activePhaseId && !isGenerating && (
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

          {/* Footer Controls */}
          <div className="p-8 border-t border-border/20 bg-surface/20 flex gap-4 items-center">
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60">Execution Workspace</p>
              <p className="text-xs font-bold text-text-secondary">Keep your focus on why you started.</p>
            </div>
            <Button variant="ghost" onClick={onClose} size="sm">Exit Workspace</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}