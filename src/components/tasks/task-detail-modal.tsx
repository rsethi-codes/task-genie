"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/core";
import { Sparkles, CheckCircle2, Circle, X, AlertCircle, Check, Plus, Trash2, PencilLine, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import { ThinkingIndicator } from "./thinking-indicator";
import { useQueryClient } from "@tanstack/react-query";

interface Subtask {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed";
  estimatedDuration?: number;
  aiGenerated?: boolean;
  userModified?: boolean;
  isDeleted?: boolean;
  isEditing?: boolean; // New field for UI state
  order?: number; // New field for reordering
}

interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "DRAFT" | "ACTIVE" | "BLOCKED" | "COMPLETED" | "ARCHIVED";
  aiGenerationStatus?: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
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
  task: (Task & { aiGenerationStatus?: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" }) | null;
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
  const [task, setTask] = useState<Task | null>(initialTask);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [isLoadingSubtasks, setIsLoadingSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editedTaskTitle, setEditedTaskTitle] = useState(initialTask?.title || "");
  const [editedTaskDescription, setEditedTaskDescription] = useState(initialTask?.description || "");

  const fetchTaskDetails = useCallback(async (id: string, silent = false) => {
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
        setSubtasks((data.subtasks || []).filter((s: Subtask) => !s.isDeleted));
      }
    } catch (err) {
      console.error("Failed to fetch task details", err);
    } finally {
      if (!silent) setIsLoadingSubtasks(false);
    }
  }, [getToken]);

  useEffect(() => {
    setTask(initialTask);
    if (initialTask) {
      setEditedTaskTitle(initialTask.title);
      setEditedTaskDescription(initialTask.description || "");
    }
    if (isOpen && initialTask) {
      fetchTaskDetails(initialTask.id);
    }
  }, [isOpen, initialTask, fetchTaskDetails]);

  useEffect(() => {
    if (isOpen && task && (task.aiGenerationStatus === "PENDING" || task.aiGenerationStatus === "PROCESSING")) {
      const pollInterval = setInterval(() => {
        fetchTaskDetails(task.id, true);
      }, 3000); // Poll every 3 seconds

      return () => clearInterval(pollInterval);
    }
  }, [isOpen, task?.id, task?.aiGenerationStatus, fetchTaskDetails]);

  const handleCreateSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || !task) return;

    const tempId = `temp-${Date.now()}`;
    const newSubtask: Subtask = {
      id: tempId,
      title: newSubtaskTitle,
      status: "pending",
      userModified: true,
      aiGenerated: false
    };

    // Optimistic Update
    setSubtasks([...subtasks, newSubtask]);
    setNewSubtaskTitle("");
    setIsAddingSubtask(false);

    try {
      const token = await getToken();
      if (!token) throw new Error("No token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks/${task.id}/subtasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newSubtask.title,
          // userModified is handled by backend logic
        })
      });

      if (!res.ok) throw new Error("Failed to create subtask");

      // Refresh to get real ID
      fetchTaskDetails(task.id, true);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Step added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add step");
      setSubtasks(prev => prev.filter(s => s.id !== tempId)); // Revert
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    // Optimistic
    const previous = [...subtasks];
    setSubtasks(subtasks.filter(s => s.id !== subtaskId));

    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subtasks/${subtaskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to delete subtask");
      toast.success("Step removed");
      fetchTaskDetails(task!.id, true); // Refresh parent task details to update subtask count
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete step");
      setSubtasks(previous); // Revert
    }
  };

  const handleToggleSubtask = async (subtaskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

    // Optimistic
    setSubtasks(prev => prev.map(s =>
      s.id === subtaskId ? { ...s, status: newStatus } : s
    ));

    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subtasks/${subtaskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error("Failed to update subtask status");

      // If completed, trigger backend /complete endpoint (for tracking attempts)
      if (newStatus === 'completed') {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subtasks/${subtaskId}/complete`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchTaskDetails(task!.id, true); // Refresh parent task details to update subtask count
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Step status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update step status");
      // Revert logic would go here if needed, but fetchTaskDetails will correct it
    }
  };

  const handleUpdateTask = async () => {
    if (!task) return;

    try {
      const token = await getToken();
      if (!token) throw new Error("No token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editedTaskTitle,
          description: editedTaskDescription,
        })
      });

      if (!res.ok) throw new Error("Failed to update task");

      const updatedTask = await res.json();
      setTask(updatedTask);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated");
      setIsEditingTask(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task");
    }
  };

  const handleUpdateSubtask = async (subtaskId: string, newTitle: string) => {
    try {
      const token = await getToken();
      if (!token) throw new Error("No token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subtasks/${subtaskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle })
      });

      if (!res.ok) throw new Error("Failed to update subtask");

      setSubtasks(prev => prev.map(s =>
        s.id === subtaskId ? { ...s, title: newTitle, isEditing: false } : s
      ));
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Step updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update step");
    }
  };

  const handleReorderSubtask = async (subtaskId: string, newOrder: number) => {
    if (!task) return;

    try {
      const token = await getToken();
      if (!token) throw new Error("No token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subtasks/${subtaskId}/reorder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newOrder })
      });

      if (!res.ok) throw new Error("Failed to reorder subtask");

      // Re-fetch all subtasks for the parent to ensure correct order is returned from the backend
      fetchTaskDetails(task.id, true);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Steps reordered");
    } catch (err) {
      console.error(err);
      toast.error("Failed to reorder steps");
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !task) return;

    const { source, destination, draggableId } = result;

    if (source.index === destination.index) return; // No change in order

    const newSubtasks = Array.from(subtasks);
    const [reorderedItem] = newSubtasks.splice(source.index, 1);
    newSubtasks.splice(destination.index, 0, reorderedItem);

    setSubtasks(newSubtasks);

    // Find the new order value based on the destination index
    const newOrder = destination.index + 1;
    handleReorderSubtask(draggableId, newOrder);
  };

  const handleDeleteTask = async () => {
    if (!task) return;
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks/${task.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onTaskDeleted?.(task.id);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete task");
    }
  };

  const handleRetryGeneration = async (taskId: string) => {
    // TODO: Implement backend call to re-trigger subtask generation
    toast.info("Retrying subtask generation...");
    // For now, simply refetch to update status if backend already retried
    fetchTaskDetails(taskId);
  }

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

  const isGenerating = task.aiGenerationStatus === "PENDING" || task.aiGenerationStatus === "PROCESSING";
  const isFailed = task.aiGenerationStatus === "FAILED";

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
            {isEditingTask ? (
              <input
                type="text"
                value={editedTaskTitle}
                onChange={(e) => setEditedTaskTitle(e.target.value)}
                className="text-3xl font-display font-black tracking-tight leading-tight bg-transparent border-b border-white/20 focus:outline-none focus:border-primary-light"
              />
            ) : (
              <h3 className="text-3xl font-display font-black tracking-tight leading-tight">
                {task.title}
              </h3>
            )}
          </div>
          {isEditingTask ? (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleUpdateTask}>Save</Button>
              <Button variant="outline" size="sm" onClick={() => { setIsEditingTask(false); setEditedTaskTitle(task.title); setEditedTaskDescription(task.description || ""); }}>Cancel</Button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingTask(true)}
              className="p-2 hover:bg-surface/50 rounded-full transition-colors mr-2"
              title="Edit Task"
            >
              <PencilLine size={20} className="text-text-secondary" />
            </button>
          )}
          <button
            onClick={handleDeleteTask}
            className="p-2 hover:bg-error/10 hover:text-error rounded-full transition-colors mr-2"
            title="Delete Task"
          >
            <Trash2 size={20} />
          </button>
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
                {task.aiSuggested && <Sparkles size={16} className="text-primary" />}
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                  Genie Context
                </p>
              </div>
              <div className="space-y-3">
                {isEditingTask ? (
                  <textarea
                    value={editedTaskDescription}
                    onChange={(e) => setEditedTaskDescription(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 focus:outline-none focus:border-primary-light text-base text-text leading-relaxed font-medium"
                    rows={3}
                  />
                ) : (task.description && (
                  <p className="text-base text-text leading-relaxed font-medium">
                    {task.description}
                  </p>
                ))}
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
              {isGenerating && (
                <ThinkingIndicator />
              )}
            </div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="subtasks" isDropDisabled={false}>
              {(provided: DroppableProvided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {(isFailed && subtasks.length === 0) ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-10 bg-surface/20 rounded-3xl border border-dashed border-border/50 flex flex-col items-center justify-center text-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-surface/40 flex items-center justify-center">
                        {isGenerating ? (
                          <Sparkles size={28} className="text-primary/20" />
                        ) : (
                          <AlertCircle size={28} className="text-error/40" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold">Genie encountered an issue</p>
                        <p className="text-xs text-text-secondary max-w-[240px]">Subtask generation failed. Please try again or create subtasks manually.</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleRetryGeneration(task.id)} className="mt-2">
                        Retry Generation
                      </Button>
                    </motion.div>
                  ) : (isGenerating && subtasks.length === 0) ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-10 bg-surface/20 rounded-3xl border border-dashed border-border/50 flex flex-col items-center justify-center text-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-surface/40 flex items-center justify-center">
                        {isGenerating ? (
                          <Sparkles size={28} className="text-primary/20" />
                        ) : (
                          <Sparkles size={28} className="text-primary/20" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold">Plan is still cooking...</p>
                        <p className="text-xs text-text-secondary max-w-[240px]">Genie is taking a bit longer to refine your trajectory. It will appear here shortly.</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => { fetchTaskDetails(task.id); }} className="mt-2">
                        Nudge Genie
                      </Button>
                    </motion.div>
                  ) : (
                    subtasks.map((sub, i) => (
                      <Draggable key={sub.id} draggableId={sub.id} index={i}>
                        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={provided.draggableProps.style}
                          >
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className={cn(
                                "group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
                                sub.status === 'completed'
                                  ? "bg-surface/20 border-transparent opacity-50"
                                  : "bg-surface/40 border-border/40 hover:border-primary/40 hover:bg-surface/60",
                                snapshot.isDragging && "ring-2 ring-primary/50 bg-surface/60 shadow-lg"
                              )}
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleSubtask(sub.id, sub.status);
                                }}
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
                                {sub.isEditing ? (
                                  <input
                                    type="text"
                                    value={sub.title}
                                    onChange={(e) => setSubtasks(prev => prev.map(s => s.id === sub.id ? { ...s, title: e.target.value } : s))}
                                    onBlur={(e) => handleUpdateSubtask(sub.id, e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.currentTarget.blur();
                                      }
                                    }}
                                    autoFocus
                                    className="bg-transparent border-b border-white/20 focus:outline-none focus:border-primary-light text-sm font-bold tracking-tight w-full"
                                  />
                                ) : (
                                  <p className={cn("text-sm font-bold tracking-tight", sub.status === 'completed' && "line-through text-text-secondary")}>
                                    {sub.title}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                {sub.estimatedDuration && (
                                  <span className="text-[10px] font-black text-text-secondary/60 uppercase tracking-widest bg-surface/60 px-2 py-1 rounded-lg">
                                    {sub.estimatedDuration}m
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSubtasks(prev => prev.map(s => s.id === sub.id ? { ...s, isEditing: !s.isEditing } : s));
                                  }}
                                  className="p-1.5 opacity-0 group-hover:opacity-100 hover:text-primary transition-all rounded-lg hover:bg-primary/10"
                                >
                                  <PencilLine size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSubtask(sub.id);
                                  }}
                                  className="p-1.5 opacity-0 group-hover:opacity-100 hover:text-error transition-all rounded-lg hover:bg-error/10"
                                >
                                  <Trash2 size={14} />
                                </button>
                                <span
                                  {...provided.dragHandleProps}
                                  className="p-1.5 opacity-0 group-hover:opacity-100 text-text-secondary/60 hover:text-text transition-all rounded-lg hover:bg-surface/60 cursor-grab"
                                  role="button"
                                  tabIndex={0}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <GripVertical size={14} />
                                </span>
                              </div>
                            </motion.div>
                          </div>
                        )}
                      </Draggable>
                     ))
                    )}
                    {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>


          {/* Add Subtask Input */}
          {isAddingSubtask ? (
            <form onSubmit={handleCreateSubtask} className="flex items-center gap-3 p-4 bg-surface/30 rounded-2xl border border-primary/30">
              <div className="w-6 h-6 rounded-full border-2 border-dashed border-primary/40 flex-shrink-0" />
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="What's the next step?"
                autoFocus
                className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-text-secondary/50"
                onBlur={() => !newSubtaskTitle && setIsAddingSubtask(false)}
              />
              <Button type="submit" size="sm" className="h-7 text-xs">Add</Button>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingSubtask(true)}
              className="flex items-center gap-3 p-4 w-full rounded-2xl border border-dashed border-border/40 hover:bg-surface/30 hover:border-primary/30 transition-all text-text-secondary hover:text-primary group"
            >
              <div className="w-6 h-6 rounded-full border-2 border-dashed border-current flex items-center justify-center transition-transform group-hover:scale-110">
                <Plus size={14} />
              </div>
              <span className="text-sm font-medium">Add step manually</span>
            </button>
          )}
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
    </Modal>
  );
}