"use client";

import { motion } from "framer-motion";
import {
    BarChart3,
    Calendar,
    CheckCircle2,
    ChevronRight,
    Home,
    Layers,
    LogOut,
    Settings,
    Sparkles,
    Search,
    Plus
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/core";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { AIChat } from "./ai-chat";

interface DashboardLayoutProps {
    children: ReactNode;
    user: {
        fullName: string | null;
    };
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const sidebarLinks = [
        { name: "Focus", href: "/dashboard", icon: Home },
        { name: "My Tasks", href: "/dashboard/tasks", icon: Layers },
        { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
        { name: "Insights", href: "/dashboard/insights", icon: BarChart3 },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 280 }}
                animate={{ width: isCollapsed ? 80 : 280 }}
                className="glass border-r border-border h-full flex flex-col z-30 relative"
            >
                <div className="p-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 ai-gradient rounded-lg flex items-center justify-center shrink-0">
                            <Sparkles className="text-white w-5 h-5" />
                        </div>
                        {!isCollapsed && (
                            <span className="font-display font-bold text-xl tracking-tight">TaskGenie</span>
                        )}
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.href} href={link.href}>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                                        isActive
                                            ? "bg-primary text-background font-bold shadow-lg"
                                            : "text-text-secondary hover:bg-surface-hover hover:text-text"
                                    )}
                                >
                                    <link.icon size={20} className={cn(isActive ? "text-background" : "group-hover:text-primary")} />
                                    {!isCollapsed && <span>{link.name}</span>}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border space-y-4">
                    {!isCollapsed && (
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">AI Status</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                <p className="text-sm font-medium">Genie: Thinking...</p>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center justify-between gap-2">
                        <UserButton />
                        {!isCollapsed && (
                            <div className="text-left flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">{user.fullName || "User"}</p>
                                <p className="text-xs text-text-secondary truncate">Free Plan</p>
                            </div>
                        )}
                        <ThemeSwitcher />
                    </div>
                </div>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-24 w-6 h-6 bg-surface border border-border rounded-full flex items-center justify-center hover:bg-surface-hover transition-colors z-50 shadow-md"
                >
                    <ChevronRight size={14} className={cn("transition-transform", isCollapsed ? "" : "rotate-180")} />
                </button>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
                {/* Header */}
                <header className="h-20 border-b border-border px-8 flex items-center justify-between glass z-20">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Find a task or ask Genie..."
                                className="w-full bg-surface border border-border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:border-primary transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border">
                            <span className="text-xs font-bold text-text-secondary uppercase">Streak</span>
                            <span className="text-sm font-bold text-primary">🔥 12 Days</span>
                        </div>
                        <Button variant="ai" size="sm" className="hidden sm:flex">
                            <Plus size={18} /> New Task
                        </Button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
            <AIChat />
        </div>
    );
}
