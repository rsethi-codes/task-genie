"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Zap, Trees, Sunrise, Sparkles, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const themes = [
  { id: "light", name: "Light", icon: Sun },
  { id: "dark", name: "Dark", icon: Moon },
  { id: "cyberpunk", name: "Cyberpunk", icon: Zap },
  { id: "forest", name: "Forest", icon: Trees },
  { id: "sunset", name: "Sunset", icon: Sunrise },
  { id: "midnight", name: "Midnight", icon: Sparkles },
  { id: "monochrome", name: "Monochrome", icon: Circle },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = themes.find((t) => t.id === theme) || themes[1];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border shadow-lg hover:border-primary transition-all"
      >
        <currentTheme.icon size={18} className="text-primary" />
        <span className="font-semibold text-sm">{currentTheme.name}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-2xl p-2 shadow-2xl z-50 grid grid-cols-1 gap-1"
            >
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-surface-hover w-full text-left",
                    theme === t.id ? "text-primary bg-primary/10" : "text-text-secondary"
                  )}
                >
                  <t.icon size={16} />
                  {t.name}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}