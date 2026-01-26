
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

interface StepMoodProps {
    selected: string[];
    onChange: (val: string[]) => void;
    onNext: () => void;
}

export function StepMood({ selected, onChange, onNext }: StepMoodProps) {
    const moods = [
        { id: "overwhelmed", label: "😫 Overwhelmed" },
        { id: "calm", label: "😌 Calm" },
        { id: "anxious", label: "🤯 Anxious" },
        { id: "motivated", label: "😄 Motivated" },
        { id: "tired", label: "💤 Tired" },
        { id: "distracted", label: "😵‍💫 Distracted" },
        { id: "stuck", label: "🧱 Stuck" },
        { id: "focused", label: "🧠 Focused" },
    ];

    const toggle = (id: string) => {
        if (selected.includes(id)) {
            onChange(selected.filter(i => i !== id));
        } else {
            onChange([...selected, id]);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold font-display">What's the vibe?</h3>
                <p className="text-text-secondary">Select all that apply.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {moods.map(mood => {
                    const active = selected.includes(mood.id);
                    return (
                        <button
                            key={mood.id}
                            onClick={() => toggle(mood.id)}
                            className={`p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between group ${active
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-border hover:border-primary/50 text-text"
                                }`}
                        >
                            <span className="font-medium">{mood.label}</span>
                            {active && <Check size={16} />}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={onNext}
                disabled={selected.length === 0}
                className="w-full py-4 bg-primary text-background font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next <ArrowRight size={18} />
            </button>
        </div>
    );
}
