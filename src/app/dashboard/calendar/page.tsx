"use client";

import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/layout";
import { Card } from "@/components/ui/core";
import { useUser } from "@clerk/nextjs";
import { Calendar as CalendarIcon } from "lucide-react";

export default function CalendarPage() {
  const { user } = useUser();

  return (
    <DashboardLayout user={{ fullName: user?.fullName || null }}>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tight">Calendar</h1>
          <p className="text-text-secondary font-medium mt-1">View and manage your scheduled tasks.</p>
        </div>

        <Card className="p-16 border-dashed border-2 border-border/50 bg-surface/30">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-hover flex items-center justify-center mb-4">
              <CalendarIcon className="w-8 h-8 text-text-secondary/40" />
            </div>
            <h3 className="text-lg font-bold mb-2">Calendar coming soon</h3>
            <p className="text-sm text-text-secondary max-w-sm">
              Calendar view will be available in a future update. For now, manage your tasks from the Tasks page.
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
