"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence, Variants } from "framer-motion";
import DashboardLayout from "@/components/dashboard/layout";
import { Card, Button } from "@/components/ui/core";
import {
  Sparkles,
  Clock,
  Brain,
  ArrowRight,
  CheckCircle2,
  Circle,
  Zap,
  Star,
  Loader2,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { TaskCreationModal } from "@/components/tasks/task-creation-modal";
import { TaskDetailModal } from "@/components/tasks/task-detail-modal";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Task = {
  id: string;
  title: string;
  category: string | null;
  dueDate: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "DRAFT" | "ACTIVE" | "BLOCKED" | "COMPLETED" | "ARCHIVED";
  completed: boolean; // Virtual property derived from status
  aiSuggested?: boolean;
};

export default function Dashboard() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { getToken } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const token = await getToken();
      if (!token) return [];

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data = await response.json();
      return data.map((t: any) => ({
        ...t,
        completed: t.status === "COMPLETED"
      })) as Task[];
    },
    refetchInterval: (query) => {
      const data = query.state.data as Task[] | undefined;
      const hasProcessingTasks = !!data?.some(t => (t as any).aiGenerationStatus === "PENDING" || (t as any).aiGenerationStatus === "PROCESSING");
      return hasProcessingTasks ? 3000 : false;
    },
  });

  const tasks = tasksQuery.data ?? [];

  const toggleCompleteMutation = useMutation({
    mutationFn: async ({ taskId, newStatus }: { taskId: string; newStatus: Task["status"] }) => {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error("Failed to update task");
      return response.json();
    },
    onMutate: async ({ taskId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", user?.id] });
      const previous = queryClient.getQueryData<Task[]>(["tasks", user?.id]);

      queryClient.setQueryData(["tasks", user?.id], (prev: Task[] | undefined) =>
        (prev ?? []).map(t =>
          t.id === taskId ? { ...t, status: newStatus, completed: newStatus === "COMPLETED" } : t
        )
      );

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      toast.error("Failed to update task");
      if (ctx?.previous) queryClient.setQueryData(["tasks", user?.id], ctx.previous);
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(["tasks", user?.id], (prev: Task[] | undefined) =>
        (prev ?? []).map(t =>
          t.id === updatedTask.id
            ? { ...updatedTask, completed: updatedTask.status === "COMPLETED" }
            : t
        )
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
    },
  });

  // Loading state with skeleton
  if (!isUserLoaded || (tasksQuery.isLoading && !tasksQuery.data)) {
    return (
      <DashboardLayout user={{ fullName: null }}>
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="h-10 w-64 bg-surface rounded-xl animate-pulse" />
            <div className="h-6 w-96 bg-surface rounded-lg animate-pulse" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-64 bg-surface rounded-2xl animate-pulse" />
            <div className="h-64 bg-surface rounded-2xl animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-8 w-48 bg-surface rounded-lg animate-pulse" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-surface rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleTaskCreated = (newTask: any) => {
    const task: Task = {
      ...newTask,
      completed: newTask.status === "COMPLETED"
    };
    queryClient.setQueryData(["tasks", user?.id], (prev: Task[] | undefined) => [task, ...(prev ?? [])]);
  };

  const handleToggleComplete = async (taskId: string) => {
    const taskToToggle = tasks.find(t => t.id === taskId);
    if (!taskToToggle) return;

    const newStatus = taskToToggle.status === "COMPLETED" ? "ACTIVE" : "COMPLETED";
    toggleCompleteMutation.mutate({ taskId, newStatus });
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const hasTasks = tasks.length > 0;

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <DashboardLayout user={{ fullName: user?.fullName || null }}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-12"
      >
        {/* Welcome Section - Improved spacing and hierarchy */}
        <motion.div variants={item} className="space-y-3">
          <h1 className="text-4xl font-display font-black tracking-tight leading-tight">
            Good morning, <span className="text-primary italic">{user?.firstName || "there"}</span>
          </h1>
          <p className="text-lg text-text-secondary font-medium leading-relaxed max-w-2xl">
            {activeTasks.length > 0 ? (
              <>You have <span className="text-text font-semibold">{activeTasks.length} focus task{activeTasks.length !== 1 ? 's' : ''}</span> to tackle today.</>
            ) : (
              <>Your day is clear. Ready to add some focus?</>
            )}
          </p>
        </motion.div>

        {/* Focus Grid - Improved spacing and visual balance */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* AI Strategy Card - Primary action */}
          <motion.div variants={item} className="md:col-span-2">
            <Card variant="ai" className="h-full flex flex-col justify-between overflow-hidden relative group p-8">
              {/* Subtle background decoration */}
              <div className="absolute top-0 right-0 p-8 opacity-[0.06] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none">
                <Brain size={120} className="text-primary" />
              </div>

              <div className="relative z-10 space-y-6">
                {/* Label - Subtle */}
                <div className="flex items-center gap-2">
                  <Sparkles className="text-primary w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary/80">AI Strategy</span>
                </div>

                {/* Content */}
                <div className="space-y-4 max-w-lg">
                  <h3 className="text-2xl font-bold leading-tight">Morning window is prime for deep work</h3>
                  <p className="text-text-secondary leading-relaxed text-[15px]">
                    Genie suggests focusing on <span className="font-semibold text-text">UI Refactor</span> before your 11 AM meeting. Your energy levels are usually highest now.
                  </p>
                </div>
              </div>

              {/* Primary action - More prominent */}
              <div className="relative z-10 mt-8">
                <Button
                  variant="ai"
                  size="lg"
                  className="w-full md:w-auto shadow-lg"
                  onClick={() => {
                    toast.info("AI plan execution coming soon!");
                  }}
                >
                  Execute Plan
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Energy Card - Secondary info */}
          <motion.div variants={item}>
            <Card className="h-full flex flex-col justify-between p-6 border-border/60 bg-surface/30">
              <div className="space-y-6">
                {/* Label - Subtle */}
                <div className="flex items-center gap-2">
                  <Zap className="text-warning w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Energy</span>
                </div>

                {/* Energy level */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-text-secondary">Current Level</span>
                    <span className="text-3xl font-black text-text">84%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-hover rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "84%" }}
                      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                      className="h-full ai-gradient rounded-full"
                    />
                  </div>
                  <p className="text-xs text-text-secondary/80 leading-relaxed">High focus potential for the next 2 hours</p>
                </div>
              </div>

              {/* Break timer - Subtle */}
              <div className="mt-8 pt-6 border-t border-border/40">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Clock size={14} className="opacity-60" />
                  <span className="text-sm font-medium">Next break in 45m</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Task Section - Improved hierarchy */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Today&apos;s Focus</h2>
              <p className="text-sm text-text-secondary mt-1">{activeTasks.length} active task{activeTasks.length !== 1 ? 's' : ''}</p>
            </div>
            {/* Secondary action - More subtle */}
            <Link href="/dashboard/tasks">
              <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text group">
                View all
                <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Tasks List or Empty State */}
          <AnimatePresence mode="wait">
            {hasTasks ? (
              <motion.div
                key="tasks"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {tasks.map((task, index) => (
                  <TaskItem
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    category={task.category}
                    dueDate={task.dueDate}
                    priority={task.priority}
                    completed={task.completed}
                    aiSuggested={task.aiSuggested}
                    delay={index * 0.05}
                    onToggleComplete={handleToggleComplete}
                    onDetailsClick={() => {
                      setSelectedTask(task);
                      setIsDetailModalOpen(true);
                    }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-16"
              >
                <Card className="border-dashed border-2 border-border/50 bg-surface/30">
                  <div className="flex flex-col items-center justify-center text-center py-12 px-6">
                    <div className="w-16 h-16 rounded-2xl bg-surface-hover flex items-center justify-center mb-4">
                      <Circle className="w-8 h-8 text-text-secondary/40" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">No tasks yet</h3>
                    <p className="text-sm text-text-secondary mb-6 max-w-sm">
                      Start your day by adding a focus task or let Genie suggest one for you.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCreateModalOpen(true)}
                    >
                      Add Task
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Insights Section - Subtle, at bottom */}
        <motion.section variants={item} className="grid md:grid-cols-2 gap-5">
          <Card className="p-6 border-border/60 bg-surface/30">
            <div className="flex gap-5 items-center">
              <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center shrink-0 border border-success/20">
                <TrendingUp className="text-success w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.1em] mb-1">Productivity</p>
                <h4 className="text-xl font-black">
                  +24% <span className="text-sm font-medium text-text-secondary">vs last week</span>
                </h4>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/60 bg-surface/30">
            <div className="flex gap-5 items-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                <Star className="text-primary w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.1em] mb-1">Milestone</p>
                <h4 className="text-xl font-black">
                  Level 12 <span className="text-sm font-medium text-text-secondary italic">Genie Master</span>
                </h4>
              </div>
            </div>
          </Card>
        </motion.section>
      </motion.div>

      {/* Modals */}
      <TaskCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask ? {
          id: selectedTask.id,
          title: selectedTask.title,
          category: selectedTask.category || "General",
          priority: selectedTask.priority as any,
          status: selectedTask.status as any,
          time: selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleTimeString() : "Anytime",
          aiSuggested: selectedTask.aiSuggested,
        } : null}
        onToggleComplete={(taskId) => {
          handleToggleComplete(taskId);
        }}
      />
    </DashboardLayout>
  );
}

function TaskItem({
  id,
  title,
  category,
  dueDate,
  priority,
  completed,
  aiSuggested,
  delay = 0,
  onToggleComplete,
  onDetailsClick,
}: {
  id: string;
  title: string;
  category: string | null;
  dueDate: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  completed: boolean;
  aiSuggested?: boolean;
  delay?: number;
  onToggleComplete?: (id: string) => void;
  onDetailsClick?: () => void;
}) {
  const priorityColors = {
    HIGH: "bg-warning",
    MEDIUM: "bg-warning",
    LOW: "bg-info",
    URGENT: "bg-error",
    high: "bg-warning", // Fallback
    medium: "bg-warning",
    low: "bg-info",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ x: 2 }}
      className={cn(
        "group flex items-center justify-between p-5 rounded-xl border transition-all duration-200",
        completed
          ? "bg-surface/40 border-border/60 opacity-70"
          : "bg-surface border-border/60 hover:border-primary/40 hover:shadow-sm"
      )}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Checkbox - Primary interaction */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete?.(id);
            toast.success(completed ? "Task marked as incomplete" : "Task completed!");
          }}
          className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
            completed
              ? "bg-success border-success text-white"
              : "border-border hover:border-primary group-hover:scale-105"
          )}
          aria-label={completed ? `Mark "${title}" as incomplete` : `Mark "${title}" as complete`}
        >
          {completed && <CheckCircle2 size={12} />}
        </button>

        {/* Task content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <h4 className={cn(
              "font-semibold text-base leading-tight truncate",
              completed && "line-through text-text-secondary"
            )}>
              {title}
            </h4>
            {aiSuggested && (
              <Sparkles size={12} className="text-primary shrink-0" aria-label="AI suggested" />
            )}
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] font-bold text-text-secondary/70 uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-hover/60">
              {category || "General"}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary/70">
              <Clock size={11} />
              <span>{dueDate ? new Date(dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Anytime"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Priority indicator and details - Subtle */}
      <div className="flex items-center gap-3 ml-4 shrink-0">
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            priorityColors[priority]
          )}
          aria-label={`Priority: ${priority}`}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDetailsClick?.();
          }}
          className="opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity text-xs px-2"
        >
          Details
        </Button>
      </div>
    </motion.div>
  );
}