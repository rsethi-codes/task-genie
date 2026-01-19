"use client";

import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/dashboard/layout";
import { Card, Button } from "@/components/ui/core";
import { useUser } from "@clerk/nextjs";
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
import { useState } from "react";
import { cn } from "@/lib/utils";

const mockTasks = [
    { id: "1", title: "Scale database infrastructure", group: "Today", priority: "high", status: "todo", category: "DevOps", subtasks: 12 },
    { id: "2", title: "Design system audit", group: "Today", priority: "medium", status: "done", category: "Design", subtasks: 8 },
    { id: "3", title: "Client presentation", group: "Upcoming", priority: "high", status: "todo", category: "Meeting", subtasks: 4 },
    { id: "4", title: "Refactor auth middleware", group: "Upcoming", priority: "medium", status: "todo", category: "Backend", subtasks: 6 },
    { id: "5", title: "Quarterly review", group: "Upcoming", priority: "low", status: "todo", category: "Management", subtasks: 3 },
    { id: "6", title: "Update documentation", group: "Overdue", priority: "medium", status: "todo", category: "Docs", subtasks: 5 },
];

export default function TasksPage() {
    const { user } = useUser();
    const [view, setView] = useState<"list" | "grid">("list");
    const [expandedTask, setExpandedTask] = useState<string | null>(null);

    const groups = ["Today", "Upcoming", "Overdue"];

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
                        <Button variant="ai" className="h-11 shadow-lg">
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
                                    {mockTasks.filter(t => t.group === group).length}
                                </span>
                            </div>

                            <div className={cn(
                                view === "list" ? "space-y-3" : "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                            )}>
                                <AnimatePresence mode="popLayout">
                                    {mockTasks.filter(t => t.group === group).map((task) => (
                                        <motion.div
                                            layout
                                            key={task.id}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                                        >
                                            {view === "list" ? (
                                                <Card className={cn(
                                                    "p-4 cursor-pointer hover:border-primary/30 transition-all group overflow-hidden",
                                                    task.status === "done" && "opacity-50"
                                                )}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <button className={cn(
                                                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                                task.status === "done" ? "bg-success border-success text-white" : "border-border hover:border-primary"
                                                            )}>
                                                                {task.status === "done" && <CheckCircle2 size={14} />}
                                                            </button>
                                                            <div>
                                                                <h3 className={cn("font-bold text-lg", task.status === "done" && "line-through")}>{task.title}</h3>
                                                                <div className="flex items-center gap-3 mt-1 text-xs font-medium text-text-secondary">
                                                                    <span className="bg-surface-hover px-2 py-0.5 rounded-md text-text uppercase tracking-wider">{task.category}</span>
                                                                    <div className="flex items-center gap-1">
                                                                        <Sparkles size={12} className="text-primary" />
                                                                        {task.subtasks} subtasks
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className={cn(
                                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                                task.priority === "high" ? "text-error border-error/20 bg-error/5" : "text-text-secondary border-border"
                                                            )}>
                                                                {task.priority}
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
                                                                    <Button variant="ghost" size="sm">Modify</Button>
                                                                    <Button variant="primary" size="sm">Open Workspace</Button>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </Card>
                                            ) : (
                                                <Card className="h-full flex flex-col justify-between hover:border-primary/30 transition-all group cursor-pointer">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-4">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60">{task.category}</span>
                                                            <div className={cn("w-2 h-2 rounded-full", task.priority === "high" ? "bg-error" : "bg-warning")} />
                                                        </div>
                                                        <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">{task.title}</h3>
                                                    </div>
                                                    <div className="mt-8 pt-4 border-t border-border flex justify-between items-center text-xs font-bold text-text-secondary">
                                                        <div className="flex items-center gap-1">
                                                            <Clock size={12} />
                                                            {task.subtasks} Subtasks
                                                        </div>
                                                        <span className="uppercase tracking-widest">{task.status}</span>
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
            </div>
        </DashboardLayout>
    );
}
