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
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { ThinkingIndicator } from "@/components/tasks/thinking-indicator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";
import { TaskCreationModal } from "@/components/tasks/task-creation-modal";
import { TaskDetailModal } from "@/components/tasks/task-detail-modal";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";

import { TaskItem } from "@/components/tasks/task-item";
import { TaskNode, NodeStatus, NodeType, Priority, TemporalIntent } from "@/types/task-node";

type Task = TaskNode & {
  completed: boolean; // Virtual property derived from status
};

export default function Dashboard() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { getToken } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { socket } = useSocket();
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
        completed: t.status === NodeStatus.COMPLETED
      })) as Task[];
    },
  });

  // Listen for real-time updates via Socket.IO
  useEffect(() => {
    if (!socket) return;

    const handleTaskUpdate = (payload: { taskId: string; status: string }) => {
      console.log("[Socket] Task update received:", payload);
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });

      if (payload.status === 'READY') {
        toast.success("Genie has finished generating subtasks!");
      } else if (payload.status === 'FAILED') {
        toast.error("Genie failed to generate subtasks.");
      }
    };

    socket.on("task:status-updated", handleTaskUpdate);

    return () => {
      socket.off("task:status-updated", handleTaskUpdate);
    };
  }, [socket, user?.id, queryClient]);

  // Ensure only top-level Goals are rendered in the main list
  const tasks = (tasksQuery.data ?? []).filter(t => t.nodeType === NodeType.ROOT);

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
          t.id === taskId ? { ...t, status: newStatus, completed: newStatus === NodeStatus.COMPLETED } : t
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
      completed: newTask.status === NodeStatus.COMPLETED
    };
    queryClient.setQueryData(["tasks", user?.id], (prev: Task[] | undefined) => [task, ...(prev ?? [])]);
  };

  const handleToggleComplete = async (taskId: string) => {
    const taskToToggle = tasks.find(t => t.id === taskId);
    if (!taskToToggle) return;

    const newStatus = taskToToggle.status === NodeStatus.COMPLETED ? NodeStatus.ACTIVE : NodeStatus.COMPLETED;
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
                    task={task}
                    delay={index * 0.05}
                    onToggleComplete={handleToggleComplete}
                    onDetailsClick={(t) => {
                      setSelectedTask(t as Task);
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
          ...selectedTask,
          category: selectedTask.category || "General",
        } : null}
        onToggleComplete={(taskId) => {
          handleToggleComplete(taskId);
        }}
      />
    </DashboardLayout>
  );
}
