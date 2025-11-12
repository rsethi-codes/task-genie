"use client"
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight, Brain, Zap, CalendarCheck } from "lucide-react";
import { SignOutButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#000] text-white overflow-hidden relative">
      {/* Floating Background Lights */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary opacity-10 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#7B7B7B] opacity-10 blur-3xl rounded-full animate-pulse delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight"
        >
          <Link href={'/'}>
          Task<span className="text-[#E8A476]">Genie</span>
          </Link>
        </motion.h1>

        <div className="flex gap-6 text-lg">
          <Link href="#features" className="hover:text-[#E8A476] transition">
            Features
          </Link>
          <Link href="#about" className="hover:text-[#E8A476] transition">
            About
          </Link>
          <Link href="#contact" className="hover:text-[#E8A476] transition">
            Contact
          </Link>

          {/* // ! this is for user sign out testing */}
            <UserButton /> 
          {/* <SignOutButton /> */}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-6 md:px-20 pt-24 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
        >
          Turn Ideas into <span className="text-[#E8A476]">Action</span> with AI
          ✨
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[#7B7B7B] text-lg md:text-xl max-w-2xl"
        >
          TaskGenie isn’t just a to-do list — it’s your AI productivity partner
          that breaks down your goals, schedules your focus time, and keeps you
          accountable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col md:flex-row gap-4"
        >
          <Link
            href="/sign-up"
            className="bg-[#E8A476] hover:bg-[#f1b589] text-black px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/sign-in"
            className="border border-[#E8A476] hover:bg-[#E8A476]/10 px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
          >
            Sign In
          </Link>
        </motion.div>

        {/* Floating icons animation */}
        <div className="mt-20 flex gap-12 text-[#E8A476]/70">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <Brain size={50} />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          >
            <Zap size={50} />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <CalendarCheck size={50} />
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section
        id="features"
        className="mt-40 px-6 md:px-20 pb-40 relative z-10"
      >
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold text-center mb-16"
        >
          Why You’ll Love <span className="text-[#E8A476]">TaskGenie</span>
        </motion.h3>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: <Sparkles className="w-10 h-10 text-[#E8A476]" />,
              title: "AI-Powered Subtasks",
              desc: "Breaks your tasks into smart, actionable micro-goals.",
            },
            {
              icon: <Zap className="w-10 h-10 text-[#E8A476]" />,
              title: "Personalized Schedules",
              desc: "Learns your habits and optimizes time slots automatically.",
            },
            {
              icon: <CalendarCheck className="w-10 h-10 text-[#E8A476]" />,
              title: "Focus Mode",
              desc: "Stay in flow with built-in timers and energy-based recommendations.",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-[#151515] p-8 rounded-2xl shadow-lg border border-[#2a2a2a] flex flex-col items-center text-center gap-4 transition"
            >
              {feature.icon}
              <h4 className="text-2xl font-semibold">{feature.title}</h4>
              <p className="text-[#7B7B7B]">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] py-6 text-center text-[#7B7B7B]">
        <p>
          © {new Date().getFullYear()} TaskMind. Built for dreamers by doers.
        </p>
      </footer>
    </div>
  );
}
