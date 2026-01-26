"use client";

import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/dashboard/layout";
import { Card, Button } from "@/components/ui/core";
import { useUser, useAuth } from "@clerk/nextjs";
import {
    Plus,
    Filter,
    Search,
    MoreVertical,
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
    Sparkles,
    ChevronDown,
    LayoutGrid,
    List as ListIcon
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { TaskCreationModal } from "@/components/tasks/task-creation-modal";
import { TaskDetailModal } from "@/components/tasks/task-detail-modal";
import { toast } from "sonner";
import { ThinkingIndicator } from "@/components/tasks/thinking-indicator";
import { TaskItem } from "@/components/tasks/task-item";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";

import { TaskNode, NodeType, NodeStatus, Priority } from "@/types/task-node";

type Task = TaskNode & {
    group: "Today" | "Upcoming" | "Overdue";
};

const getGroup = (dueDate: string | null, status: NodeStatus): "Today" | "Upcoming" | "Overdue" => {
    if (status === NodeStatus.COMPLETED) return "Upcoming";
    if (!dueDate) return "Upcoming";
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDay = new Date(due);
    dueDay.setHours(0, 0, 0, 0);

    if (dueDay.getTime() === today.getTime()) return "Today";
    if (dueDay.getTime() < today.getTime()) return "Overdue";
    return "Upcoming";
};

export default function TasksPage() {
    const { user } = useUser();
    const { getToken } = useAuth();
    const { socket } = useSocket();
    const searchParams = useSearchParams();
    const [view, setView] = useState<"list" | "grid">("list");
    const [expandedTask, setExpandedTask] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

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
                group: getGroup(t.dueDate, t.status),
                aiSuggested: t.aiGenerationStatus === "READY",
            })) as Task[];
        },
    });

    // Real-time updates via Socket.IO
    useEffect(() => {
        if (!socket) return;

        const handleTaskUpdate = (payload: { taskId: string; status: string }) => {
            console.log("[Socket] Master list update:", payload);
            queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });

            if (payload.status === 'READY') {
                toast.success("Task generation complete!");
            }
        };

        socket.on("task:status-updated", handleTaskUpdate);

        return () => {
            socket.off("task:status-updated", handleTaskUpdate);
        };
    }, [socket, user?.id, queryClient]);

    // Ensure only top-level Goals are rendered in the main list
    const tasks = (tasksQuery.data ?? []).filter(t => t.nodeType === NodeType.ROOT);

    const groups = ["Today", "Upcoming", "Overdue"];

    const filteredTasks = useMemo(() => {
        if (!searchQuery.trim()) return tasks;
        const query = searchQuery.toLowerCase();
        return tasks.filter(
            (task) =>
                task.title.toLowerCase().includes(query) ||
                (task.category?.toLowerCase() || "").includes(query)
        );
    }, [tasks, searchQuery]);

    const selectedTask = useMemo(() =>
        selectedTaskId ? tasks.find(t => t.id === selectedTaskId) || null : null
        , [tasks, selectedTaskId]);

    const handleTaskCreated = (newTask: any) => {
        const taskWithProcessing = {
            ...newTask,
            group: getGroup(newTask.dueDate, newTask.status),
            aiGenerationStatus: "PENDING"
        };
        queryClient.setQueryData(["tasks", user?.id], (prev: Task[] | undefined) => [taskWithProcessing, ...(prev ?? [])]);
    };

    const toggleCompleteMutation = useMutation({
        mutationFn: async ({ taskId, newStatus }: { taskId: string; newStatus: NodeStatus }) => {
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
                (prev ?? []).map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
            );

            return { previous };
        },
        onError: (_err, _vars, ctx) => {
            toast.error("Failed to update task");
            if (ctx?.previous) queryClient.setQueryData(["tasks", user?.id], ctx.previous);
        },
        onSuccess: (updatedTask: TaskNode) => {
            queryClient.setQueryData(["tasks", user?.id], (prev: Task[] | undefined) =>
                (prev ?? []).map(t =>
                    t.id === updatedTask.id
                        ? { ...t, ...updatedTask, group: getGroup(updatedTask.dueDate || null, updatedTask.status) }
                        : t
                )
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
        },
    });

    const handleToggleComplete = async (taskId: string) => {
        const taskToToggle = tasks.find(t => t.id === taskId);
        if (!taskToToggle) return;

        const newStatus: NodeStatus = taskToToggle.status === NodeStatus.COMPLETED ? NodeStatus.ACTIVE : NodeStatus.COMPLETED;
        toggleCompleteMutation.mutate({ taskId, newStatus });
    };

    const handleTaskClick = (task: Task, e: React.MouseEvent) => {
        // Don't expand if clicking on checkbox or details button
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('[role="button"]')) {
            return;
        }
        setSelectedTaskId(task.id);
        setIsDetailModalOpen(true);
    };

    return (
        <DashboardLayout user={{ fullName: user?.fullName || null }}>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-display font-black tracking-tight">Master List</h1>
                        <p className="text-text-secondary font-medium mt-1">Manage your trajectory and focus.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-surface border border-border rounded-xl p-1">
                            <button
                                onClick={() => setView("list")}
                                className={cn("p-2 rounded-lg transition-all", view === "list" ? "bg-primary text-background shadow-sm" : "text-text-secondary hover:text-text")}
                            >
                                <ListIcon size={18} />
                            </button>
                            <button
                                onClick={() => setView("grid")}
                                className={cn("p-2 rounded-lg transition-all", view === "grid" ? "bg-primary text-background shadow-sm" : "text-text-secondary hover:text-text")}
                            >
                                <LayoutGrid size={18} />
                            </button>
                        </div>
                        <Button variant="outline" className="h-11">
                            <Filter size={18} className="mr-2" /> Filter
                        </Button>
                        <Button
                            variant="ai"
                            className="h-11 shadow-lg"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <Plus size={18} className="mr-2" /> New Task
                        </Button>
                    </div>
                </div>

                <div className="space-y-12">
                    {groups.map((group) => (
                        <section key={group} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h2 className={cn(
                                    "text-sm font-black uppercase tracking-[0.2em]",
                                    group === "Overdue" ? "text-error" : group === "Today" ? "text-primary" : "text-text-secondary"
                                )}>{group}</h2>
                                <div className="h-px flex-1 bg-border/50" />
                                <span className="text-xs font-bold text-text-secondary bg-surface px-2 py-0.5 rounded-full border border-border">
                                    {filteredTasks.filter(t => t.group === group).length}
                                </span>
                            </div>

                            <div className={cn(
                                view === "list" ? "space-y-3" : "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                            )}>
                                <AnimatePresence mode="popLayout">
                                    {filteredTasks.filter(t => t.group === group).map((task) => (
                                        <motion.div
                                            layout
                                            key={task.id}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            onClick={(e) => handleTaskClick(task, e)}
                                        >
                                            {view === "list" ? (
                                                <TaskItem
                                                    task={task}
                                                    onToggleComplete={handleToggleComplete}
                                                    onDetailsClick={(t) => {
                                                        setSelectedTaskId(t.id);
                                                        setIsDetailModalOpen(true);
                                                    }}
                                                />
                                            ) : (
                                                <Card className="h-full flex flex-col justify-between hover:border-primary/30 transition-all group cursor-pointer">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-4">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60">{task.category || "General"}</span>
                                                            <div className={cn(
                                                                "w-2 h-2 rounded-full",
                                                                task.priority === Priority.HIGH || task.priority === Priority.MEDIUM || task.priority === Priority.URGENT
                                                                    ? "bg-warning"
                                                                    : "bg-info"
                                                            )} />
                                                        </div>
                                                        <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">{task.title}</h3>
                                                    </div>
                                                    <div className="mt-8 pt-4 border-t border-border flex justify-between items-center text-xs font-bold text-text-secondary">
                                                        <div className="flex items-center gap-1">
                                                            {task.aiSuggested && <Sparkles size={12} className="text-primary" />}
                                                            {task.children?.length || 0} Execution Steps
                                                        </div>
                                                        <span className="uppercase tracking-widest">{task.status?.toLowerCase() || 'active'}</span>
                                                    </div>
                                                </Card>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </section>
                    ))}
                </div>

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
                        setSelectedTaskId(null);
                    }}
                    taskId={selectedTaskId}
                />
            </div>
        </DashboardLayout>
    );
}
