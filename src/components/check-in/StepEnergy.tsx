
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

interface StepEnergyProps {
    value: number;
    onChange: (val: number) => void;
    onNext: () => void;
}

export function StepEnergy({ value, onChange, onNext }: StepEnergyProps) {
    const labels = ["Drained", "Low", "Okay", "Good", "High"];

    return (
        <div className="space-y-8 text-center">
            <div className="space-y-3">
                <h3 className="text-3xl font-bold font-display text-text">How is your energy right now?</h3>
                <p className="text-lg text-text-secondary font-medium">Be honest — no judgment here.</p>
            </div>

            <div className="py-8 px-6 bg-surface-hover/30 rounded-[2rem] border border-white/5 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                {/* Visual Slider Track */}
                <div className="relative h-12 flex items-center justify-between px-2 mb-8 cursor-pointer group">
                    <div className="absolute inset-x-0 h-4 bg-surface rounded-full overflow-hidden border border-white/10 shadow-inner">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary/40 to-primary"
                            initial={false}
                            animate={{ width: `${((value - 1) / 4) * 100}%` }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        />
                    </div>

                    {/* Interaction Points */}
                    {[1, 2, 3, 4, 5].map((level) => (
                        <button
                            key={level}
                            onClick={() => onChange(level)}
                            className="relative z-10 w-12 h-12 flex items-center justify-center focus:outline-none"
                        >
                            <motion.div
                                animate={{
                                    scale: value === level ? 1.2 : 1,
                                    backgroundColor: value >= level ? "rgb(var(--primary))" : "rgba(255,255,255,0.1)"
                                }}
                                className={`w-4 h-4 rounded-full shadow-lg transition-colors duration-300 ${value === level ? 'ring-4 ring-primary/20' : ''}`}
                            />
                        </button>
                    ))}
                </div>

                <div className="flex justify-center items-end h-32 mb-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={value}
                            initial={{ scale: 0.5, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.5, opacity: 0, y: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="text-8xl filter drop-shadow-2xl"
                        >
                            {value === 1 && "🪫"}
                            {value === 2 && "🔌"}
                            {value === 3 && "🔋"}
                            {value === 4 && "⚡️"}
                            {value === 5 && "🚀"}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-between px-2">
                    <span className="text-xs font-black uppercase tracking-widest text-text-tertiary">Drained</span>
                    <span className="text-xs font-black uppercase tracking-widest text-text-tertiary">Charged</span>
                </div>
            </div>

            <button
                onClick={onNext}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary/80 hover:to-primary text-background font-bold text-lg rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
            >
                Continue <Zap size={20} fill="currentColor" />
            </button>
        </div>
    );
}
