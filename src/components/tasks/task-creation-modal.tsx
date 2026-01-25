"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/core";
import { Sparkles, Loader2, Calendar, Tag, ChevronRight, Check, Wand2 } from "lucide-react";
import { ThinkingIndicator } from "./thinking-indicator";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import debounce from "lodash/debounce";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated?: (task: any) => void;
}

export function TaskCreationModal({
  isOpen,
  onClose,
  onTaskCreated,
}: TaskCreationModalProps) {
  const { getToken } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<"HIGH" | "MEDIUM" | "LOW">("MEDIUM");
  const [dueDate, setDueDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    description?: string;
    priority?: "HIGH" | "MEDIUM" | "LOW";
    category?: string;
    dueDate?: string;
    reasoning?: string;
  } | null>(null);

  // States for "Blooming UI"
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteractedWithDesc, setHasInteractedWithDesc] = useState(false);

  const fetchEnrichment = useCallback(
    debounce(async (title: string, token: string) => {
      if (!title || title.length < 5) return;

      setIsEnriching(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks/enrich`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title }),
        });

        if (response.ok) {
          const data = await response.json();
          setAiSuggestions(data);

          // Silent acceptance model: Fill if user hasn't touched the fields
          if (!hasInteractedWithDesc && data.description) setDescription(data.description);
          if (data.priority) setPriority(data.priority);
          if (data.category) setCategory(data.category);
          if (data.dueDate) {
            setDueDate(new Date(data.dueDate).toISOString().split('T')[0]);
          }
        }
      } catch (error) {
        console.error("Enrichment failed", error);
      } finally {
        setIsEnriching(false);
      }
    }, 1200),
    [hasInteractedWithDesc]
  );

  useEffect(() => {
    if (title && title.length >= 5 && !isSubmitting) {
      getToken().then(token => {
        if (token) fetchEnrichment(title, token);
      });
    }
  }, [title, getToken, fetchEnrichment, isSubmitting]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title.trim()) {
      toast.error("Tell me what needs to be done first");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category: category || "General",
          priority,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          status: "ACTIVE",
          nodeType: "ROOT", // Default to ROOT for new user tasks from this modal
          idempotencyKey: uuidv4(),
          aiMetadata: aiSuggestions ? {
            reasoning: aiSuggestions.reasoning,
            suggestions: aiSuggestions
          } : undefined
        }),
      });

      if (!response.ok) throw new Error("Failed to create task");

      const newTask = await response.json();
      onTaskCreated?.(newTask);

      toast.success("Task captured. Setting things in motion...", {
        icon: <Sparkles className="text-primary w-4 h-4" />,
      });

      // Reset & Close
      handleReset();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong on my end. Try again?");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setPriority("MEDIUM");
    setDueDate("");
    setAiSuggestions(null);
    setHasInteractedWithDesc(false);
  };

  const showAdditionalFields = title.length > 0 || isFocused;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="" // Title-less for a more organic feel
      size="md"
      className="bg-background/40 backdrop-blur-3xl border border-white/10 shadow-3xl"
      backdropBlur="xl"
      showCloseButton={false}
    >
      <div className="p-2">
        <div className="relative mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent text-2xl md:text-3xl font-medium text-text placeholder:text-text-secondary/30 border-none outline-none py-2 transition-all"
            autoFocus
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3">
            {isEnriching && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2 pr-2"
              >
                <ThinkingIndicator className="scale-75 origin-right" />
                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-primary/40 whitespace-nowrap">
                  Genie is analyzing
                </span>
              </motion.div>
            )}
            {title.length > 0 && !isSubmitting && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => handleSubmit()}
                className="bg-primary text-white p-2 rounded-full shadow-lg shadow-primary/20 hover:scale-110 transition-transform"
              >
                <ChevronRight size={20} />
              </motion.button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showAdditionalFields && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-6 overflow-hidden"
            >
              {/* Context / Description */}
              <div className="group">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary/50 group-hover:text-primary transition-colors">
                    Want to add more detail?
                  </label>
                  {aiSuggestions?.description && !hasInteractedWithDesc && (
                    <motion.span
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[10px] text-primary/60 flex items-center gap-1 italic"
                    >
                      <Sparkles size={10} /> Genie drafted this
                    </motion.span>
                  )}
                </div>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setHasInteractedWithDesc(true);
                  }}
                  placeholder="Context is optional, but helpful..."
                  className={cn(
                    "w-full bg-surface/30 backdrop-blur-sm border border-border/30 rounded-2xl px-4 py-3 text-sm focus:border-primary/50 transition-all outline-none min-h-[90px] resize-none",
                    !hasInteractedWithDesc && aiSuggestions?.description && "text-text/50 italic"
                  )}
                />
              </div>

              {/* Metadata Pills */}
              <div className="flex flex-wrap gap-4">
                {/* Category Pill */}
                <div className="flex-1 min-w-[140px]">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-text-secondary/50 mb-2 uppercase tracking-[0.2em]">
                    <Tag size={12} className="opacity-50" /> Label
                  </div>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="General"
                    className="w-full bg-surface/20 border border-border/30 rounded-xl px-3 py-2 text-sm focus:border-primary/50 outline-none transition-all placeholder:text-text-secondary/20"
                  />
                </div>

                {/* Due Date Pill */}
                <div className="flex-1 min-w-[140px]">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-text-secondary/50 mb-2 uppercase tracking-[0.2em]">
                    <Calendar size={12} className="opacity-50" /> Timeline
                  </div>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-surface/20 border border-border/30 rounded-xl px-3 py-2 text-sm focus:border-primary/50 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Priority - Subtle Visual Indicators */}
              <div>
                <div className="text-[10px] font-black text-text-secondary/50 mb-3 uppercase tracking-[0.2em]">
                  Focus Energy
                </div>
                <div className="flex gap-2">
                  {(["LOW", "MEDIUM", "HIGH"] as const).map((p) => {
                    const isActive = priority === p;
                    const configs = {
                      LOW: { color: "bg-info/30 text-info", border: "border-info/20", label: "Steady" },
                      MEDIUM: { color: "bg-primary/30 text-primary", border: "border-primary/20", label: "Balanced" },
                      HIGH: { color: "bg-warning/30 text-warning", border: "border-warning/20", label: "Intense" }
                    };
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={cn(
                          "flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl border transition-all duration-300",
                          isActive
                            ? `${configs[p].color} ${configs[p].border} shadow-sm scale-[1.02]`
                            : "bg-surface/10 border-border/20 text-text-secondary/60 hover:bg-surface/20 hover:border-border/40"
                        )}
                      >
                        <span className="text-[10px] font-black uppercase tracking-tighter">
                          {configs[p].label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Footer / Info */}
              {aiSuggestions?.reasoning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-primary/5 rounded-xl p-3 border border-primary/10"
                >
                  <p className="text-[11px] text-primary/70 leading-relaxed italic flex items-start gap-2">
                    <Sparkles size={12} className="mt-0.5 shrink-0" />
                    <span>Persona Insight: {aiSuggestions.reasoning}</span>
                  </p>
                </motion.div>
              )}

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 rounded-2xl border-none bg-surface/30 hover:bg-surface/50 transition-colors"
                >
                  Not now
                </Button>
                <Button
                  onClick={() => handleSubmit()}
                  variant="ai"
                  disabled={isSubmitting || !title.trim()}
                  className="flex-[2] rounded-2xl shadow-xl shadow-primary/10 relative overflow-hidden group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles size={18} className="text-white" />
                      </motion.div>
                      <span className="font-bold tracking-tight">Manifesting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Capture Task</span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ChevronRight size={18} />
                      </motion.div>
                    </div>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
