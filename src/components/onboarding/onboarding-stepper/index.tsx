import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

interface OnboardingStepperProps {
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
  isFirstStep: boolean
  isLastStep: boolean
  isLoading: boolean
  isValid: boolean
}

export function OnboardingStepper({
  onPrev,
  onNext,
  onSubmit,
  isFirstStep,
  isLastStep,
  isLoading,
  isValid,
}: OnboardingStepperProps) {
  return (
    <div className="w-full max-w-2xl flex gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onPrev}
        disabled={isFirstStep || isLoading}
        className="flex-1"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>

      {isLastStep ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1 bg-primary hover:bg-primary-hover"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Saving...' : 'Complete Onboarding'}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={isLoading}
          className="flex-1 bg-primary hover:bg-primary-hover"
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  )
}