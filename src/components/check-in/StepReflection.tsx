
import { ArrowRight, SkipForward } from "lucide-react";

interface StepReflectionProps {
    value: string;
    onChange: (val: string) => void;
    onNext: () => void;
}

export function StepReflection({ value, onChange, onNext }: StepReflectionProps) {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-3">
                <h3 className="text-3xl font-bold font-display text-text">Anything on your mind?</h3>
                <p className="text-lg text-text-secondary font-medium">Optional. Getting it out helps.</p>
            </div>

            <div className="relative">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="I'm worried about the deadline... / I just want to relax..."
                    className="w-full h-40 p-6 rounded-3xl bg-surface border border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none resize-none transition-all text-lg leading-relaxed shadow-inner"
                />
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onNext}
                    className="flex-1 py-4 bg-gradient-to-r from-primary to-primary/80 text-background font-bold text-lg rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                    {value.trim() ? "Let's Go" : "Skip & Go"} <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}
