"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const THINKING_MESSAGES = [
    "Thinking through the best path... 🌿",
    "Breaking this down gently... 💧",
    "Finding a clear starting point... 🔭",
    "Organizing the next steps... 📝",
    "Structuring the goal... 🧱",
    "Making this manageable... 🕯️",
    "Sorting out the details... 🍃",
    "Almost ready for you... ✨",
];

export function ThinkingIndicator({ className }: { className?: string }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((i) => (i + 1) % THINKING_MESSAGES.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={className}>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 180, 270, 360],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="text-primary"
                    >
                        <Sparkles size={16} />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 0.5, 0], scale: [0.5, 1.5, 0.5] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
                    />
                </div>

                <div className="h-5 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={index}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                            className="text-xs font-medium text-primary/80 italic tracking-tight"
                        >
                            {THINKING_MESSAGES[index]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
