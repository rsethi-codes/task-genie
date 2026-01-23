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

type TaskStatus = "DRAFT" | "ACTIVE" | "BLOCKED" | "COMPLETED" | "ARCHIVED";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

type Task = {
    id: string;
    title: string;
    group: "Today" | "Upcoming" | "Overdue";
    priority: Priority;
    status: TaskStatus;
    category: string | null;
    subtaskCount: number;
    completedSubtasks: number;
    dueDate: string | null;
    isProcessing?: boolean;
};

const getGroup = (dueDate: string | null, status: string): "Today" | "Upcoming" | "Overdue" => {
    if (status === "COMPLETED") return "Upcoming"; // Or handled separately
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
    const searchParams = useSearchParams();
    const [view, setView] = useState<"list" | "grid">("list");
    const [expandedTask, setExpandedTask] = useState<string | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

    const fetchTasks = async () => {
        try {
            const token = await getToken();
            if (!token) return;

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to fetch tasks");

            const data = await response.json();
            const normalizedTasks = data.map((t: any) => ({
                ...t,
                group: getGroup(t.dueDate, t.status)
            }));
            setTasks(normalizedTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error("Failed to sync tasks");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTasks();
        }
    }, [user, getToken]);

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

    const handleTaskCreated = (newTask: any) => {
        const taskWithProcessing = {
            ...newTask,
            group: getGroup(newTask.dueDate, newTask.status),
            isProcessing: true
        };
        setTasks((prev) => [taskWithProcessing, ...prev]);
    };

    // Poll for processing tasks
    useEffect(() => {
        const processingTasks = tasks.filter(t => t.isProcessing);
        if (processingTasks.length === 0) return;

        const pollInterval = setInterval(async () => {
            const token = await getToken();
            if (!token) return;

            for (const task of processingTasks) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks/${task.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        // If subtasks are generated or processing flag on backend would be better, 
                        // but here we check subtaskCount or hasSubtasks
                        if (data.subtaskCount > 0 || data.hasSubtasks) {
                            setTasks(prev => prev.map(t =>
                                t.id === task.id ? { ...t, isProcessing: false, subtaskCount: data.subtaskCount } : t
                            ));
                        }
                    }
                } catch (e) {
                    console.error("Polling error", e);
                }
            }
        }, 3000);

        return () => clearInterval(pollInterval);
    }, [tasks, getToken]);

    const handleToggleComplete = async (taskId: string) => {
        const taskToToggle = tasks.find(t => t.id === taskId);
        if (!taskToToggle) return;

        const newStatus = taskToToggle.status === "COMPLETED" ? "ACTIVE" : "COMPLETED";

        // Optimistic UI
        setTasks((prev) =>
            prev.map((t) =>
                t.id === taskId ? { ...t, status: newStatus as any } : t
            )
        );

        try {
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

            const updatedTask = await response.json();
            setTasks((prev) =>
                prev.map((t) =>
                    t.id === taskId ? { ...updatedTask, group: getGroup(updatedTask.dueDate, updatedTask.status) } : t
                )
            );
        } catch (error) {
            toast.error("Failed to update task");
            fetchTasks();
        }
    };

    const handleTaskClick = (task: Task, e: React.MouseEvent) => {
        // Don't expand if clicking on checkbox or details button
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('[role="button"]')) {
            return;
        }
        setSelectedTask(task);
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
                                                <Card className={cn(
                                                    "p-4 cursor-pointer hover:border-primary/30 transition-all group overflow-hidden relative",
                                                    task.status === "COMPLETED" && "opacity-50",
                                                    task.isProcessing && "border-primary/20 bg-primary/[0.02]"
                                                )}>
                                                    {task.isProcessing && (
                                                        <motion.div
                                                            initial={{ x: "-100%" }}
                                                            animate={{ x: "100%" }}
                                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                            className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                                                        />
                                                    )}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleToggleComplete(task.id);
                                                                    toast.success(
                                                                        task.status === "COMPLETED"
                                                                            ? "Task marked as incomplete"
                                                                            : "Task completed!"
                                                                    );
                                                                }}
                                                                className={cn(
                                                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                                    task.status === "COMPLETED" ? "bg-success border-success text-white" : "border-border hover:border-primary"
                                                                )}
                                                            >
                                                                {task.status === "COMPLETED" && <CheckCircle2 size={14} />}
                                                            </button>
                                                            <div>
                                                                <h3 className={cn("font-bold text-lg", task.status === "COMPLETED" && "line-through")}>{task.title}</h3>
                                                                <div className="flex items-center gap-3 mt-1 text-xs font-medium text-text-secondary">
                                                                    <span className="bg-surface-hover px-2 py-0.5 rounded-md text-text uppercase tracking-wider">{task.category || "General"}</span>
                                                                    {task.isProcessing ? (
                                                                        <ThinkingIndicator className="mt-1" />
                                                                    ) : (
                                                                        <div className="flex items-center gap-1">
                                                                            <Sparkles size={12} className="text-primary" />
                                                                            {task.subtaskCount || 0} subtasks
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className={cn(
                                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                                task.priority === "HIGH" || task.priority === "URGENT" || task.priority === "MEDIUM"
                                                                    ? "text-warning border-warning/20 bg-warning/5"
                                                                    : task.priority === "LOW"
                                                                        ? "text-info border-info/20 bg-info/5"
                                                                        : "text-text-secondary border-border"
                                                            )}>
                                                                {task.priority.toLowerCase()}
                                                            </div>
                                                            <MoreVertical size={18} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    </div>

                                                    {/* Expanded content */}
                                                    <AnimatePresence>
                                                        {expandedTask === task.id && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="mt-6 pt-6 border-t border-border overflow-hidden"
                                                            >
                                                                <div className="grid grid-cols-2 gap-8">
                                                                    <div className="space-y-4">
                                                                        <h4 className="text-xs font-black uppercase tracking-widest text-text-secondary">AI Recommendation</h4>
                                                                        <p className="text-sm font-medium leading-relaxed">Based on your current trajectory, completing this task will unblock <strong>4 other dependencies</strong>. High probability of flow state detected.</p>
                                                                    </div>
                                                                    <div className="space-y-4 text-right">
                                                                        <h4 className="text-xs font-black uppercase tracking-widest text-text-secondary">Last Sync</h4>
                                                                        <p className="text-sm font-medium">Today at 10:24 AM</p>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-6 flex justify-end gap-3">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedTask(task);
                                                                            setIsDetailModalOpen(true);
                                                                        }}
                                                                    >
                                                                        View Details
                                                                    </Button>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </Card>
                                            ) : (
                                                <Card className="h-full flex flex-col justify-between hover:border-primary/30 transition-all group cursor-pointer">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-4">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60">{task.category || "General"}</span>
                                                            <div className={cn(
                                                                "w-2 h-2 rounded-full",
                                                                task.priority === "HIGH" || task.priority === "MEDIUM" || task.priority === "URGENT"
                                                                    ? "bg-warning"
                                                                    : "bg-info"
                                                            )} />
                                                        </div>
                                                        <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">{task.title}</h3>
                                                    </div>
                                                    <div className="mt-8 pt-4 border-t border-border flex justify-between items-center text-xs font-bold text-text-secondary">
                                                        <div className="flex items-center gap-1">
                                                            <Clock size={12} />
                                                            {task.subtaskCount || 0} Subtasks
                                                        </div>
                                                        <span className="uppercase tracking-widest">{task.status.toLowerCase()}</span>
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
                        setSelectedTask(null);
                    }}
                    task={selectedTask ? {
                        id: selectedTask.id,
                        title: selectedTask.title,
                        category: selectedTask.category || "General",
                        priority: selectedTask.priority as any,
                        status: selectedTask.status as any,
                        time: selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleTimeString() : "Anytime",
                        aiSuggested: false,
                    } : null}
                    onToggleComplete={handleToggleComplete}
                />
            </div>
        </DashboardLayout>
    );
}
