"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/layout";
import { Card, Button } from "@/components/ui/core";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import {
    Bell,
    Shield,
    Zap,
    Monitor,
    Smartphone,
    Accessibility,
    Palette,
    Eye,
    Activity,
    User as UserIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const { user } = useUser();
    const { theme, setTheme } = useTheme();

    const themes = [
        { id: "light", name: "Light", color: "#ffffff" },
        { id: "dark", name: "Dark", color: "#000000" },
        { id: "cyberpunk", name: "Cyberpunk", color: "#0EA5E9" },
        { id: "forest", name: "Forest", color: "#10B981" },
        { id: "sunset", name: "Sunset", color: "#F97316" },
        { id: "midnight", name: "Midnight", color: "#6366F1" },
        { id: "monochrome", name: "Monochrome", color: "#71717A" },
    ];

    return (
        <DashboardLayout user={{ fullName: user?.fullName || null }}>
            <div className="space-y-12 pb-20">
                <div>
                    <h1 className="text-4xl font-display font-black tracking-tight">System Settings</h1>
                    <p className="text-text-secondary font-medium mt-1">Configure your AI productivity environment.</p>
                </div>

                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Palette className="text-primary" size={24} />
                        <h2 className="text-xl font-bold">Visual Persona</h2>
                    </div>

                    <Card className="p-8">
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-3 group transition-all",
                                        theme === t.id ? "scale-105" : "opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "w-12 h-12 rounded-2xl border-2 transition-all shadow-xl",
                                            theme === t.id ? "border-primary scale-110" : "border-border group-hover:border-primary/50"
                                        )}
                                        style={{ backgroundColor: t.color }}
                                    />
                                    <span className={cn("text-xs font-bold uppercase tracking-widest", theme === t.id ? "text-primary" : "text-text-secondary")}>
                                        {t.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </Card>
                </section>

                <section className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Activity className="text-primary" size={24} />
                            <h2 className="text-xl font-bold">Motion & Flow</h2>
                        </div>
                        <Card className="space-y-6">
                            <ToggleSetting
                                title="High Intensity Motion"
                                description="Enable complex transitions and AI-driven fluid movement."
                                defaultChecked={true}
                            />
                            <ToggleSetting
                                title="Tactile Feedback"
                                description="Subtle vibrations and micro-interactions on task completion."
                                defaultChecked={true}
                            />
                            <ToggleSetting
                                title="Reduced Motion"
                                description="Simplify animations for a calmer experience."
                                defaultChecked={false}
                            />
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Shield className="text-primary" size={24} />
                            <h2 className="text-xl font-bold">Genie Autonomy</h2>
                        </div>
                        <Card className="space-y-6">
                            <ToggleSetting
                                title="Auto-Breaking Tasks"
                                description="Allow Genie to automatically decompose focus-heavy goals."
                                defaultChecked={true}
                            />
                            <ToggleSetting
                                title="Predictive Scheduling"
                                description="Let Genie manage your calendar based on biological peak times."
                                defaultChecked={true}
                            />
                            <ToggleSetting
                                title="Contextual Awareness"
                                description="Enable location and activity based task suggestions."
                                defaultChecked={false}
                            />
                        </Card>
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                        <UserIcon className="text-primary" size={24} />
                        <h2 className="text-xl font-bold">Account Intelligence</h2>
                    </div>
                    <Card className="flex flex-col md:flex-row items-center justify-between gap-8 p-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-3xl ai-gradient flex items-center justify-center text-white ai-glow">
                                <UserIcon size={40} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{user?.fullName || "User"}</h3>
                                <p className="text-text-secondary font-medium">Synced across 3 devices · Free Tier</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline">Export Data</Button>
                            <Button variant="ai">Upgrade to Premium</Button>
                        </div>
                    </Card>
                </section>
            </div>
        </DashboardLayout>
    );
}

function ToggleSetting({ title, description, defaultChecked }: any) {
    const [enabled, setEnabled] = useState(defaultChecked);

    return (
        <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
                <h4 className="font-bold">{title}</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
            </div>
            <button
                onClick={() => setEnabled(!enabled)}
                className={cn(
                    "w-12 h-6 rounded-full transition-all relative shrink-0",
                    enabled ? "bg-primary" : "bg-surface-hover border border-border"
                )}
            >
                <motion.div
                    animate={{ x: enabled ? 24 : 2 }}
                    className={cn(
                        "w-4 h-4 rounded-full absolute top-1 transition-colors",
                        enabled ? "bg-background" : "bg-text-secondary"
                    )}
                />
            </button>
        </div>
    );
}
