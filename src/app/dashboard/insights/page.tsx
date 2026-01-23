"use client";

import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/layout";
import { Card } from "@/components/ui/core";
import { EmptyState } from "@/components/ui/empty-state";
import { useUser } from "@clerk/nextjs";
import { BarChart3, TrendingUp, Target, Clock, Zap, Calendar } from "lucide-react";

export default function InsightsPage() {
  const { user } = useUser();

  const stats = [
    {
      icon: TrendingUp,
      label: "Productivity",
      value: "+24%",
      subtitle: "vs last week",
      color: "primary",
    },
    {
      icon: Target,
      label: "Completion Rate",
      value: "87%",
      subtitle: "this month",
      color: "success",
    },
    {
      icon: Clock,
      label: "Focus Time",
      value: "42h",
      subtitle: "this week",
      color: "warning",
    },
    {
      icon: Zap,
      label: "Streak",
      value: "12",
      subtitle: "days in a row",
      color: "primary",
    },
  ];

  return (
    <DashboardLayout user={{ fullName: user?.fullName || null }}>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tight">Insights</h1>
          <p className="text-text-secondary font-medium mt-1">Analytics and productivity insights.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 border-border/60 bg-surface/30 hover:border-primary/30 transition-all">
                <div className="flex flex-col gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center border border-${stat.color}/20`}>
                    <stat.icon className={`text-${stat.color} w-6 h-6`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.1em] mb-1">
                      {stat.label}
                    </p>
                    <h4 className="text-2xl font-black">{stat.value}</h4>
                    <p className="text-sm text-text-secondary mt-1">{stat.subtitle}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card padding="lg">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="text-primary w-5 h-5" />
                <h3 className="text-lg font-bold">Weekly Overview</h3>
              </div>
              <div className="h-48 flex items-center justify-center border-2 border-dashed border-border/50 rounded-xl">
                <p className="text-sm text-text-secondary">Chart visualization coming soon</p>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-primary w-5 h-5" />
                <h3 className="text-lg font-bold">Task Distribution</h3>
              </div>
              <div className="h-48 flex items-center justify-center border-2 border-dashed border-border/50 rounded-xl">
                <p className="text-sm text-text-secondary">Chart visualization coming soon</p>
              </div>
            </div>
          </Card>
        </div>

        <EmptyState
          icon={<BarChart3 className="w-8 h-8 text-text-secondary/40" />}
          title="Advanced Analytics Coming Soon"
          description="Detailed charts, productivity trends, and AI-powered insights will be available in a future update."
        />
      </div>
    </DashboardLayout>
  );
}
