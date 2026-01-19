"use client";

import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/layout";
import { Card } from "@/components/ui/core";
import { useUser } from "@clerk/nextjs";
import { BarChart3, TrendingUp, Target } from "lucide-react";

export default function InsightsPage() {
  const { user } = useUser();

  return (
    <DashboardLayout user={{ fullName: user?.fullName || null }}>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tight">Insights</h1>
          <p className="text-text-secondary font-medium mt-1">Analytics and productivity insights.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 border-border/60 bg-surface/30">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <TrendingUp className="text-primary w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.1em] mb-1">Productivity</p>
                <h4 className="text-2xl font-black">+24%</h4>
                <p className="text-sm text-text-secondary mt-1">vs last week</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/60 bg-surface/30">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center border border-success/20">
                <Target className="text-success w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.1em] mb-1">Completion Rate</p>
                <h4 className="text-2xl font-black">87%</h4>
                <p className="text-sm text-text-secondary mt-1">this month</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/60 bg-surface/30">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center border border-warning/20">
                <BarChart3 className="text-warning w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.1em] mb-1">Focus Time</p>
                <h4 className="text-2xl font-black">42h</h4>
                <p className="text-sm text-text-secondary mt-1">this week</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-16 border-dashed border-2 border-border/50 bg-surface/30">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-hover flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-text-secondary/40" />
            </div>
            <h3 className="text-lg font-bold mb-2">Detailed insights coming soon</h3>
            <p className="text-sm text-text-secondary max-w-sm">
              Advanced analytics, charts, and productivity trends will be available in a future update.
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
