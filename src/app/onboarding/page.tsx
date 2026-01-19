"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Brain, Zap, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/core";
import CenteredCoverScreen from "@/components/common/centered-screen-cover";
import { useEngagementTracker } from "@/lib/onboarding/useEngagementTracker";
import { AIDecision, OnboardingContext, OnboardingQuestion, PersonaSnapshot } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
    const router = useRouter();
    const { signals, recordInput, recordChoice, recordSkip, resetForNewQuestion } = useEngagementTracker();

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"intro" | "question" | "finalizing">("intro");
    const [currentQuestion, setCurrentQuestion] = useState<OnboardingQuestion | null>(null);
    const [persona, setPersona] = useState<PersonaSnapshot>({
        version: 1,
        timestamp: new Date().toISOString(),
        traits: {},
        confidence: 0,
    });
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [inputValue, setInputValue] = useState("");
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const fetchNextStep = async (lastAnswer?: any) => {
        setLoading(true);

        const context: OnboardingContext = {
            userId: "pending", // Will be set by API from auth
            currentPersona: persona,
            previousAnswers: { ...answers, ...(lastAnswer ? { [currentQuestion?.id || "last"]: lastAnswer } : {}) },
            engagementHistory: [signals],
        };

        try {
            const resp = await fetch("/api/onboarding/next", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(context),
            });

            const decision: AIDecision = await resp.json();

            if (decision.type === "end") {
                setStep("finalizing");
                setPersona(decision.finalPersona);
                setTimeout(() => router.push("/dashboard"), 2500);
            } else {
                setCurrentQuestion(decision.question);
                setStep("question");
                resetForNewQuestion();
                setInputValue("");
                setSelectedOption(null);
            }
        } catch (err) {
            console.error("Failed to fetch next step", err);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        const answer = currentQuestion?.type === "choice" ? selectedOption : inputValue;
        setAnswers(prev => ({ ...prev, [currentQuestion?.id || "unknown"]: answer }));
        fetchNextStep(answer);
    };

    return (
        <CenteredCoverScreen>
            <div className="w-full max-w-lg mx-auto">
                <AnimatePresence mode="wait">
                    {step === "intro" && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center space-y-8"
                        >
                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight">
                                    Let&apos;s Build Your <br />
                                    <span className="text-primary italic">Productivity Persona</span>
                                </h1>
                                <p className="text-text-secondary text-lg font-medium">
                                    Genie needs to understand how you think, plan, and execute.
                                </p>
                            </div>

                            <div className="flex justify-center">
                                <div className="w-24 h-24 rounded-3xl ai-gradient flex items-center justify-center ai-glow animate-pulse">
                                    <Brain className="text-white w-12 h-12" />
                                </div>
                            </div>

                            <Button
                                variant="ai"
                                size="lg"
                                className="w-full h-16 text-xl shadow-2xl"
                                onClick={() => fetchNextStep()}
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Initiate Connection"}
                                <ArrowRight className="ml-2" />
                            </Button>
                        </motion.div>
                    )}

                    {step === "question" && currentQuestion && (
                        <motion.div
                            key={currentQuestion.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border",
                                    currentQuestion.importance === "critical" ? "text-error border-error/20 bg-error/5" : "text-primary border-primary/20 bg-primary/5"
                                )}>
                                    {currentQuestion.importance}
                                </span>
                                <div className="h-1 flex-1 bg-surface rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(persona.confidence * 100 + 10, 100)}%` }}
                                        className="h-full ai-gradient"
                                    />
                                </div>
                                <span className="text-[10px] font-bold text-text-secondary">
                                    Step {Object.keys(answers).length + 1} · {Math.round(persona.confidence * 100)}% SYNC
                                </span>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-3xl font-display font-bold leading-tight">
                                    {currentQuestion.text}
                                </h2>
                                {currentQuestion.rationale && (
                                    <p className="text-sm text-text-secondary italic">
                                        Genie: &quot;{currentQuestion.rationale}&quot;
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4">
                                {currentQuestion.type === "text" ? (
                                    <textarea
                                        autoFocus
                                        className="w-full bg-surface border border-border rounded-2xl p-6 text-lg focus:border-primary transition-all outline-none min-h-[150px] resize-none"
                                        placeholder="Share your thoughts..."
                                        value={inputValue}
                                        onChange={(e) => {
                                            setInputValue(e.target.value);
                                            recordInput(e.target.value);
                                        }}
                                    />
                                ) : (
                                    <div className="grid gap-4">
                                        {currentQuestion.options?.map((option, idx) => (
                                            <motion.button
                                                key={option}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                onClick={() => {
                                                    setSelectedOption(option);
                                                    recordChoice();
                                                    // For momentum, choice questions can auto-advance if preferred
                                                    // but let's stick to the button click for clarity unless user asks for auto.
                                                    // Actually, let's make it feel PLAYFUL by highlighting immediately.
                                                }}
                                                className={cn(
                                                    "p-6 rounded-3xl border-2 text-left transition-all font-bold text-xl relative overflow-hidden group/opt",
                                                    selectedOption === option
                                                        ? "bg-primary border-primary text-background shadow-[0_0_30px_rgba(var(--primary),0.3)] scale-[1.03]"
                                                        : "bg-surface border-border hover:border-primary/50 hover:bg-surface-hover"
                                                )}
                                            >
                                                <div className="flex items-center justify-between relative z-10">
                                                    <span>{option}</span>
                                                    <div className={cn(
                                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                        selectedOption === option ? "bg-background border-background" : "border-border/50"
                                                    )}>
                                                        {selectedOption === option && <CheckCircle2 className="text-primary" size={14} />}
                                                    </div>
                                                </div>
                                                {/* Subtle hover glow */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 -translate-x-full group-hover/opt:translate-x-full transition-transform duration-1000" />
                                            </motion.button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        recordSkip();
                                        fetchNextStep();
                                    }}
                                    disabled={loading}
                                >
                                    Skip
                                </Button>
                                <Button
                                    variant="ai"
                                    className="flex-1 h-14"
                                    disabled={loading || (currentQuestion.type === "choice" ? !selectedOption : !inputValue.trim())}
                                    onClick={handleNext}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : "Continue"}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === "finalizing" && (
                        <motion.div
                            key="finalizing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-8"
                        >
                            <div className="relative inline-block">
                                <div className="w-32 h-32 rounded-[2.5rem] ai-gradient flex items-center justify-center ai-glow shadow-2xl">
                                    <CheckCircle2 className="text-white w-16 h-16" />
                                </div>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-4 border-2 border-dashed border-primary/30 rounded-full"
                                />
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-4xl font-display font-black tracking-tight">
                                    Persona Synchronized
                                </h1>
                                <p className="text-text-secondary text-lg font-medium">
                                    Welcome to the future of productivity, <br />
                                    <span className="text-primary font-bold">Genie Master.</span>
                                </p>
                            </div>

                            <div className="p-6 glass rounded-2xl border border-primary/20 inline-block">
                                <div className="flex items-center gap-4 text-left">
                                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Intelligence Confidence</p>
                                        <p className="text-xl font-black">{Math.round(persona.confidence * 100)}%</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </CenteredCoverScreen>
    );
}
