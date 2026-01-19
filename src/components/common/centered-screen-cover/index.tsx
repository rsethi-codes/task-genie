"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import Link from "next/link";

interface CenteredCoverScreenProps {
  children: ReactNode;
}

export default function CenteredCoverScreen({
  children,
}: CenteredCoverScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-primary/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary opacity-[0.03] blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-secondary opacity-[0.03] blur-[150px] rounded-full"
        />
      </div>

      {/* Brand Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative z-10 flex flex-col items-center gap-4"
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 ai-gradient rounded-2xl flex items-center justify-center ai-glow shadow-2xl">
            <Sparkles className="text-white w-7 h-7" />
          </div>
          <span className="text-3xl font-display font-bold tracking-tight">
            Task<span className="text-primary">Genie</span>
          </span>
        </Link>
      </motion.div>

      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 w-full flex justify-center"
      >
        <div className="absolute inset-0 ai-gradient opacity-10 blur-[80px] -z-10" />
        {children}
      </motion.div>

      {/* Decorative Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-sm font-medium tracking-wide uppercase text-text-secondary"
      >
        Futuristic Productivity System · 2026
      </motion.p>
    </div>
  );
}
