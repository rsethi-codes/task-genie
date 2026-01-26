"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/core";
import { ChevronRight, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface QuestionOption {
    value: string;
    label: string;
}

interface Question {
    id: string;
    text: string;
    type: "single_choice" | "multiple_choice" | "text";
    options?: QuestionOption[];
    dimension: string;
    mandatory: boolean;
}

interface QuestionnaireData {
    required: boolean;
    sessionId?: string;
    questions?: Question[];
    answeredCount?: number;
    totalCount?: number;
    ambiguityScore?: number;
}

interface AdaptiveQuestionnaireProps {
    taskId: string;
    onComplete: () => void;
}

export function AdaptiveQuestionnaire({ taskId, onComplete }: AdaptiveQuestionnaireProps) {
    const { getToken } = useAuth();
    const [data, setData] = useState<QuestionnaireData | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const fetchQuestionnaire = async () => {
            try {
                const token = await getToken();
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks/${taskId}/questionnaire`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const json = await response.json();
                    setData(json);
                    if (!json.required) onComplete();
                }
            } catch (error) {
                console.error("Failed to fetch questionnaire", error);
                onComplete();
            }
        };

        fetchQuestionnaire();
    }, [taskId, getToken, onComplete]);

    const currentQuestion = data?.questions?.[currentIndex];

    const handleAnswer = async (answer: any) => {
        if (!currentQuestion || !data?.sessionId) return;

        setIsSubmitting(true);
        try {
            const token = await getToken();
            const startTime = Date.now();

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks/${taskId}/questionnaire/${data.sessionId}/answer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    questionId: currentQuestion.id,
                    answer,
                    metrics: { responseTime: Date.now() - startTime }
                })
            });

            if (response.ok) {
                if (currentIndex < (data.questions?.length || 0) - 1) {
                    setCurrentIndex(currentIndex + 1);
                } else {
                    setIsFinished(true);
                    setTimeout(() => onComplete(), 2000);
                }
            }
        } catch (error) {
            toast.error("Failed to save answer");
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = data?.questions ? ((currentIndex) / data.questions.length) * 100 : 0;

    if (!data) return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-medium text-text-secondary animate-pulse">Designing your path...</p>
        </div>
    );

    if (!data.required) return null;

    if (isFinished) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-12 text-center"
            >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-text mb-2">Clarity Achieved</h3>
                <p className="text-text-secondary">I have everything I need to build your plan perfectly.</p>
            </motion.div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-2xl mx-auto">
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary/60">
                        Vision Alignment
                    </span>
                </div>
                <div className="text-[10px] font-black text-text-secondary/40">
                    {currentIndex + 1} OF {data.questions?.length}
                </div>
            </div>

            <div className="h-1 w-full bg-surface/20 rounded-full mb-12 overflow-hidden shadow-inner">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary-light"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion?.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-8"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-text leading-tight tracking-tight">
                        {currentQuestion?.text}
                    </h2>

                    <div className="grid gap-3">
                        {currentQuestion?.type === "single_choice" && currentQuestion.options?.map((option) => (
                            <button
                                key={option.value}
                                disabled={isSubmitting}
                                onClick={() => handleAnswer(option.value)}
                                className={cn(
                                    "group relative w-full text-left p-4 md:p-5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/20 transition-all duration-300",
                                    isSubmitting && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-base md:text-lg font-medium text-text-secondary group-hover:text-text">
                                        {option.label}
                                    </span>
                                    <ChevronRight className="w-5 h-5 text-text-secondary/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                            </button>
                        ))}

                        {currentQuestion?.type === "multiple_choice" && (
                            <div className="space-y-4">
                                <div className="grid gap-3">
                                    {currentQuestion.options?.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                const current = selectedAnswers[currentQuestion.id] || [];
                                                const next = current.includes(option.value)
                                                    ? current.filter((v: string) => v !== option.value)
                                                    : [...current, option.value];
                                                setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: next });
                                            }}
                                            className={cn(
                                                "text-left p-4 rounded-2xl border transition-all duration-300",
                                                (selectedAnswers[currentQuestion.id] || []).includes(option.value)
                                                    ? "bg-primary/10 border-primary/30 text-text"
                                                    : "bg-white/5 border-white/5 text-text-secondary"
                                            )}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    disabled={isSubmitting || !(selectedAnswers[currentQuestion.id]?.length > 0)}
                                    onClick={() => handleAnswer(selectedAnswers[currentQuestion.id])}
                                    variant="ai"
                                    className="w-full py-6 rounded-2xl"
                                >
                                    Continue
                                </Button>
                            </div>
                        )}

                        {currentQuestion?.type === "text" && (
                            <div className="space-y-4">
                                <textarea
                                    autoFocus
                                    value={selectedAnswers[currentQuestion.id] || ""}
                                    onChange={(e) => setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: e.target.value })}
                                    placeholder="Share your thoughts..."
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-lg min-h-[150px] outline-none focus:border-primary/30 transition-all"
                                />
                                <Button
                                    disabled={isSubmitting || !selectedAnswers[currentQuestion.id]?.trim()}
                                    onClick={() => handleAnswer(selectedAnswers[currentQuestion.id])}
                                    variant="ai"
                                    className="w-full py-6 rounded-2xl"
                                >
                                    Finalize Vision
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="mt-12 text-center">
                <p className="text-[10px] font-medium text-text-secondary/30 italic uppercase tracking-widest">
                    Genie is listening. Precision is being sharpened.
                </p>
            </div>
        </div>
    );
}
