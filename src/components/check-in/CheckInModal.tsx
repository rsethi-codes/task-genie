
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { CheckInState, CheckInStep, Recommendation } from "./types";
import { StepEnergy } from "./StepEnergy";
import { StepMood } from "./StepMood";
import { StepReflection } from "./StepReflection";
import { StepResult } from "./StepResult";
import { useCheckIn } from "@/hooks/use-check-in";
import { useQueryClient } from "@tanstack/react-query";

interface CheckInModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CheckInModal({ isOpen, onClose }: CheckInModalProps) {
    const { startSession, processInput, loading } = useCheckIn();
    const queryClient = useQueryClient();
    const [step, setStep] = useState<CheckInStep>("ENERGY");
    const [state, setState] = useState<CheckInState>({
        energy: 3,
        moods: [],
        reflection: "",
    });
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

    const handleStart = async () => {
        try {
            const res = await startSession();
            setSessionId(res.sessionId);
        } catch (e) {
            console.error(e);
        }
    };

    const handleProcess = async () => {
        setStep("PROCESSING");

        // UI Safety Timer: If backend hangs >8s, force fallback
        const safetyTimer = setTimeout(() => {
            console.warn("CheckInModal: Backend timed out, showing fallback");
            setRecommendation({
                strategy: "easy_win",
                rationale: "I'm having a bit of trouble connecting to the cloud, but let's keep it simple.",
                primaryAction: { text: "Take a deep breath and review your list" },
                alternatives: []
            });
            setStep("RESULT");
        }, 8000);

        // Ensure session started
        let currentSessionId = sessionId;
        if (!currentSessionId) {
            try {
                const res = await startSession();
                currentSessionId = res.sessionId;
                setSessionId(res.sessionId);
            } catch (e) {
                clearTimeout(safetyTimer);
                console.error(e);
                // Fallback on start failure
                setRecommendation({
                    strategy: "rest",
                    rationale: "We couldn't reach the server, but maybe that's a sign to pause.",
                    primaryAction: { text: "Rest for 5 minutes" },
                    alternatives: []
                });
                setStep("RESULT");
                return;
            }
        }

        try {
            const res = await processInput(currentSessionId!, state.energy, state.moods, state.reflection);
            clearTimeout(safetyTimer); // Clear timer on success

            if (res.recommendation) {
                setRecommendation(res.recommendation);
                setStep("RESULT");
            } else {
                // Should not happen with new backend guarantee, but just in case
                setRecommendation({
                    strategy: "focus",
                    rationale: "Let's focus on what's in front of you.",
                    primaryAction: { text: "Pick one task" },
                    alternatives: []
                });
                setStep("RESULT");
            }
        } catch (e) {
            clearTimeout(safetyTimer);
            console.error("CheckInModal: Process failed", e);
            // Graceful fallback on API error
            setRecommendation({
                strategy: "easy_win",
                rationale: "I couldn't analyze everything perfectly, but let's move forward.",
                primaryAction: { text: "Check your task list" },
                alternatives: []
            });
            setStep("RESULT");
        }
    };

    const reset = () => {
        setStep("ENERGY");
        setState({ energy: 3, moods: [], reflection: "" });
        setSessionId(null);
        setRecommendation(null);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative"
                        >
                            <div className="absolute top-4 right-4 z-10">
                                <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                                    <X size={20} className="text-text-tertiary" />
                                </button>
                            </div>

                            {/* Header / Brand */}
                            <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                            <div className="p-8">
                                <AnimatePresence mode="wait">
                                    {step === "ENERGY" && (
                                        <motion.div key="energy" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                                            <StepEnergy
                                                value={state.energy}
                                                onChange={(v) => setState(s => ({ ...s, energy: v }))}
                                                onNext={() => setStep("MOOD")}
                                            />
                                        </motion.div>
                                    )}
                                    {step === "MOOD" && (
                                        <motion.div key="mood" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                                            <StepMood
                                                selected={state.moods}
                                                onChange={(v) => setState(s => ({ ...s, moods: v }))}
                                                onNext={() => setStep("REFLECTION")}
                                            />
                                        </motion.div>
                                    )}
                                    {step === "REFLECTION" && (
                                        <motion.div key="reflection" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                                            <StepReflection
                                                value={state.reflection}
                                                onChange={(v) => setState(s => ({ ...s, reflection: v }))}
                                                onNext={handleProcess}
                                            />
                                        </motion.div>
                                    )}
                                    {step === "PROCESSING" && (
                                        <motion.div key="processing" className="text-center py-12 space-y-4">
                                            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                                                <Sparkles className="text-primary w-8 h-8 animate-spin-slow" />
                                            </div>
                                            <h3 className="text-xl font-bold">Connecting...</h3>
                                            <p className="text-text-secondary">Taking a moment to think...</p>
                                        </motion.div>
                                    )}
                                    {step === "RESULT" && recommendation && (
                                        <motion.div key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                            <StepResult
                                                recommendation={recommendation}
                                                onClose={onClose}
                                                onAccept={() => {
                                                    // In real app, route to task ID or execute action
                                                    queryClient.invalidateQueries({ queryKey: ["tasks"] });
                                                    onClose();
                                                }}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
