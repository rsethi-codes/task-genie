import { Card } from "@/components/ui/card";

interface QuestionCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    children: React.ReactNode;
}

export function QuestionCard({
    icon,
    title,
    description,
    children,
}: QuestionCardProps) {
    const Icon = icon;

    return (
        <Card className="w-full max-w-2xl bg-surface border-border animate-in fade-in-50 duration-300">
            <div className="p-6 sm:p-8">
                {/* Icon */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-surface-hover">
                    <Icon className="text-[#0a84ff]" size={24} />
                </div>

                {/* Title & Description */}
                <h2 className="mb-2 text-2xl font-semibold text-text-primary">
                    {title}
                </h2>
                <p className="mb-8 text-sm sm:text-base text-text-secondary">
                    {description}
                </p>

                {/* Form Field */}
                <div className="space-y-4">
                    {children}
                </div>
            </div>
        </Card>

    )
}

