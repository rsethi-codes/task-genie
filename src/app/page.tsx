"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight, Brain, Zap, CalendarCheck, Shield, Rocket, Globe } from "lucide-react";
import { Button } from "@/components/ui/core";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary opacity-[0.03] blur-[120px] rounded-full"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary opacity-[0.03] blur-[150px] rounded-full"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-150" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 ai-gradient rounded-xl flex items-center justify-center ai-glow">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">
              Task<span className="text-primary">Genie</span>
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#philosophy" className="hover:text-primary transition-colors">Philosophy</Link>
            <Link href="#showcase" className="hover:text-primary transition-colors">Showcase</Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Link href="/sign-in">
              <Button variant="ghost" className="hidden sm:flex">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="ai">Try Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-44 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase opacity-80">Next Gen Productivity</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-display font-black leading-[0.9] mb-8 tracking-tighter">
              A Brilliant <span className="text-primary">AI Companion</span> <br />
              for Your Life.
            </h1>

            <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
              TaskGenie is not a to-do list. It&apos;s a collaborator that helps you
              think, plan, and execute with effortless precision.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/sign-up">
                <Button variant="ai" size="lg" className="w-full sm:w-auto h-16 px-10 text-xl shadow-2xl">
                  Get Started for Free <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="glass" size="lg" className="w-full sm:w-auto h-16 px-10 text-xl border-white/10 hover:border-white/20">
                  See how it works
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Abstract Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-32 relative mx-auto max-w-5xl group"
          >
            <div className="absolute inset-0 ai-gradient opacity-20 blur-[100px] rounded-full group-hover:opacity-30 transition-opacity" />
            <div className="relative glass border border-white/10 rounded-[2.5rem] p-4 shadow-2xl overflow-hidden backdrop-blur-3xl">
              <div className="w-full aspect-[16/10] bg-background/50 rounded-[1.8rem] flex items-center justify-center relative">
                <div className="absolute top-8 left-8 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="space-y-6 w-full max-w-md">
                  <div className="h-8 w-1/2 bg-surface rounded-lg animate-pulse" />
                  <div className="h-24 w-full bg-surface-hover rounded-2xl animate-pulse" />
                  <div className="h-24 w-full bg-surface-hover rounded-2xl animate-pulse delay-75" />
                  <div className="h-8 w-3/4 bg-surface rounded-lg animate-pulse delay-150" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="py-40 relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">Designed for the <span className="text-primary italic">Deep Thinkers</span></h2>
            <p className="text-text-secondary text-xl max-w-2xl mx-auto">Tools that disappear when you don&apos;t need them, and empower you when you do.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-8 h-8" />}
              title="Autonomous Planning"
              description="AI breaks down complex goals into manageable steps, adjusting to your real-life flow and energy."
              delay={0}
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Reactive Intelligence"
              description="Not just reminders. TaskGenie understands context, suggesting focus time when you're most productive."
              delay={0.1}
            />
            <FeatureCard
              icon={<Rocket className="w-8 h-8" />}
              title="Fluid Boundaries"
              description="Seamlessly bridge the gap between thinking and doing with a UI that feels alive and responsive."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border relative z-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 ai-gradient rounded-md" />
            <span className="font-display font-bold">TaskGenie</span>
          </div>
          <p className="text-text-secondary text-sm">© 2026 AI Task Systems. All rights reserved.</p>
          <div className="flex gap-6">
            <Globe className="w-5 h-5 text-text-secondary cursor-pointer hover:text-primary transition-colors" />
            <Shield className="w-5 h-5 text-text-secondary cursor-pointer hover:text-primary transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className="p-10 rounded-[2rem] glass border border-border hover:border-primary/30 transition-all duration-500 group"
    >
      <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-8 border border-border group-hover:ai-gradient group-hover:text-white transition-all duration-500 shadow-xl">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-text-secondary leading-relaxed font-medium">{description}</p>
    </motion.div>
  );
}
