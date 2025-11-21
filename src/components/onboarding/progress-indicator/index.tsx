export interface ProgressIndicatorProps {
  current: number
  total: number
}

export function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full max-w-2xl space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-text-primary">
          Step {current} of {total}
        </h3>
        <span className="text-sm text-text-secondary">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}