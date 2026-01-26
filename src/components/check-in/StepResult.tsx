
import { motion } from "framer-motion";
import { Recommendation } from "./types";
import { ArrowRight, RefreshCw, X, Sparkles } from "lucide-react";

interface StepResultProps {
    recommendation: Recommendation;
    onClose: () => void;
    onAccept: () => void;
}

export function StepResult({ recommendation, onClose, onAccept }: StepResultProps) {
    const { strategy, rationale, primaryAction, alternatives } = recommendation;

    const gradients = {
        rest: "from-blue-400 to-cyan-300",
        easy_win: "from-green-400 to-emerald-300",
        focus: "from-purple-500 to-indigo-400",
        motivation: "from-orange-400 to-pink-500",
    };

    const gradient = gradients[strategy] || gradients.focus;

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-xl`}
            >
                <div className="flex items-start gap-4">
                    <div className="text-4xl">
                        {strategy === "rest" && "🧘"}
                        {strategy === "easy_win" && "✅"}
                        {strategy === "focus" && "🔭"}
                        {strategy === "motivation" && "🔥"}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg opacity-90 uppercase tracking-wider mb-1">
                            {strategy.replace("_", " ")}
                        </h3>
                        <p className="font-medium leading-relaxed opacity-95">
                            {rationale}
                        </p>
                    </div>
                </div>
            </motion.div>

            <div className="space-y-4">
                <p className="text-xl font-bold font-display text-text mb-4">Here’s something you could do right now:</p>

                <motion.div
                    whileHover={{ scale: 1.01, borderColor: "rgba(var(--primary), 0.5)" }}
                    whileTap={{ scale: 0.99 }}
                    className="p-6 rounded-3xl bg-surface border border-border hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group relative overflow-hidden"
                    onClick={onAccept}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <span className="font-bold text-xl text-text group-hover:text-primary transition-colors block mb-1">{primaryAction.text}</span>
                            {primaryAction.nodeId && <span className="inline-flex items-center gap-1 text-sm text-text-tertiary font-medium"><Sparkles size={12} /> AI Suggested Task</span>}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <ArrowRight size={20} />
                        </div>
                    </div>
                </motion.div>

                {alternatives.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-border/50">
                        <p className="text-sm font-bold text-text-tertiary uppercase tracking-widest mb-4">Or try one of these</p>
                        <div className="space-y-2">
                            {alternatives.map((alt, i) => (
                                <button
                                    key={i}
                                    className="w-full p-4 rounded-xl text-left hover:bg-surface-hover transition-colors flex items-center justify-between text-text-secondary hover:text-text group"
                                >
                                    <span className="font-medium">{alt.text}</span>
                                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-text-tertiary" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-4 flex justify-between">
                <button onClick={onClose} className="text-text-tertiary hover:text-text text-sm font-medium">
                    Not now
                </button>
                <button onClick={() => window.location.reload()} className="text-primary hover:text-primary-dark text-sm font-medium flex items-center gap-1">
                    <RefreshCw size={14} /> Start Over
                </button>
            </div>
        </div>
    );
}
