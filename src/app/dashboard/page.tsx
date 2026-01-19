"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
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
  Focus
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout user={{ fullName: user?.fullName || null }}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-10"
      >
        {/* Welcome Section */}
        <motion.div variants={item} className="space-y-2">
          <h1 className="text-4xl font-display font-black tracking-tight">
            Good morning, <span className="text-primary italic">{user?.firstName || "there"}</span>
          </h1>
          <p className="text-xl text-text-secondary font-medium">
            Genie has analyzed your day. You have <span className="text-text font-bold">4 high-focus</span> tasks to tackle.
          </p>
        </motion.div>

        {/* Focus Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div variants={item} className="md:col-span-2">
            <Card variant="ai" className="h-full flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Brain size={120} className="text-primary" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-primary w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">AI Strategy</span>
                </div>
                <h3 className="text-3xl font-bold mb-4 max-w-md">Breakthrough: Your morning window is prime for &quot;Deep Work&quot;.</h3>
                <p className="text-text-secondary mb-8 max-w-md">Genie suggests focusing on <strong>UI Refactor</strong> before your 11 AM meeting. Your energy levels are usually highest now.</p>
              </div>
              <div className="relative z-10">
                <Button variant="primary" className="shadow-xl">Execute Plan <ArrowRight className="ml-2 w-4 h-4" /></Button>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full flex flex-col justify-between border-primary/20 bg-primary/5">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="text-warning w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest text-warning">Current Vibe</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-medium text-text-secondary">Energy Level</span>
                    <span className="text-2xl font-black">84%</span>
                  </div>
                  <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "84%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full ai-gradient"
                    />
                  </div>
                  <p className="text-xs text-text-secondary font-medium italic">High focus potential for the next 2 hours.</p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-primary">
                  <Clock size={16} />
                  <span className="text-sm font-bold">Next Break in 45m</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Task Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Today&apos;s Focus</h2>
            <Button variant="ghost" size="sm" className="text-primary group">
              View all tasks <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid gap-4">
            <TaskItem
              title="Implement Glassmorphism Components"
              category="Frontend"
              time="10:00 AM"
              priority="high"
              completed={false}
              aiSuggested
            />
            <TaskItem
              title="Review Designer Feedback"
              category="General"
              time="2:15 PM"
              priority="medium"
              completed={false}
            />
            <TaskItem
              title="Daily Standup Meeting"
              category="Team"
              time="11:00 AM"
              priority="low"
              completed={true}
            />
          </div>
        </section>

        {/* Insights Section */}
        <section className="grid md:grid-cols-2 gap-6">
          <Card variants={item} className="flex gap-6 items-center">
            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center shrink-0 border border-success/20">
              <CheckCircle2 className="text-success w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-secondary uppercase tracking-tight">Productivity</p>
              <h4 className="text-2xl font-black">+24% <span className="text-sm font-medium text-text-secondary">vs last week</span></h4>
            </div>
          </Card>
          <Card variants={item} className="flex gap-6 items-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <Star className="text-primary w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-secondary uppercase tracking-tight">Milestone</p>
              <h4 className="text-2xl font-black">Level 12 <span className="text-sm font-medium text-text-secondary italic">Genie Master</span></h4>
            </div>
          </Card>
        </section>
      </motion.div>
    </DashboardLayout>
  );
}

function TaskItem({ title, category, time, priority, completed, aiSuggested }: any) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className={cn(
        "group flex items-center justify-between p-4 rounded-2xl border transition-all",
        completed ? "bg-surface/50 border-border opacity-60" : "bg-surface border-border hover:border-primary/30 shadow-sm hover:shadow-md"
      )}
    >
      <div className="flex items-center gap-4">
        <button className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
          completed ? "bg-success border-success text-white" : "border-border hover:border-primary group-hover:scale-110"
        )}>
          {completed && <CheckCircle2 size={14} />}
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h4 className={cn("font-bold text-lg", completed && "line-through")}>{title}</h4>
            {aiSuggested && <Sparkles size={14} className="text-primary" />}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs font-bold text-text-secondary uppercase px-2 py-0.5 rounded-md bg-surface-hover">{category}</span>
            <div className="flex items-center gap-1 text-xs text-text-secondary font-medium">
              <Clock size={12} />
              {time}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className={cn(
          "w-2 h-2 rounded-full",
          priority === "high" ? "bg-error" : priority === "medium" ? "bg-warning" : "bg-success"
        )} />
        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">Details</Button>
      </div>
    </motion.div>
  );
}