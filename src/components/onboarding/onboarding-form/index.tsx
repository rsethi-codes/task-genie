'use client'
import { FormProvider } from 'react-hook-form'
import { onboardingQuestions } from '@/config/onboarding-questions'
import { useOnboarding } from '@/hooks/useOnboarding'
import { QuestionCard } from '../question-card'
import { MultipleChoiceField } from '../form-fields/multiple-choice-field'
import { MultiSelectField } from '../form-fields/multi-select-field'
import { SliderField } from '../form-fields/slider-field'
import { DateField } from '../form-fields/date-field'
import { TextField } from '../form-fields/text-field'
import { ProgressIndicator } from '../progress-indicator'
import { OnboardingStepper } from '../onboarding-stepper'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useMemo } from 'react'

export function OnboardingForm() {
  const { form, currentStep, nextStep, prevStep, onSubmit, isSubmitting, isCurrentStepValid } = useOnboarding()

  // Convert QuestionsByCategory object to array
  const questionsArray = useMemo(() => Object.values(onboardingQuestions), [])

  const currentQuestion = questionsArray[currentStep]
  const isLastStep = currentStep === questionsArray.length - 1

  const renderField = () => {
    if (!currentQuestion) return null

    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <MultipleChoiceField
            name={currentQuestion.id}
            options={currentQuestion.options || []}
          />
        )
      case 'multi-select':
        return (
          <MultiSelectField
            name={currentQuestion.id}
            options={currentQuestion.options || []}
          />
        )
      case 'slider':
        return (
          <SliderField
            name={currentQuestion.id}
            min={currentQuestion.validation?.min || 15}
            max={currentQuestion.validation?.max || 480}
            step={15}
            unit="mins"
          />
        )
      case 'date':
        return <DateField name={currentQuestion.id} />
      case 'text':
        return (
          <TextField
            name={currentQuestion.id}
            placeholder="Type your goals here..."
          />
        )
      default:
        return null
    }
  }

  if (!currentQuestion) {
    return <div>Loading...</div>
  }

  console.log("🚀 ~ OnboardingForm ~ currentQuestion:", currentQuestion)

  return (
    <FormProvider {...form}>
      <form className="w-full flex flex-col items-center gap-8">
        {/* Progress */}
        <ProgressIndicator
          current={currentStep + 1}
          total={questionsArray.length}
        />

        {/* Question Card */}
        <QuestionCard
          icon={currentQuestion.icon}
          title={currentQuestion.title}
          description={currentQuestion.description}
        >
          {renderField()}
        </QuestionCard>

        {/* Error Message */}
        {form.formState.errors.root && (
          <Alert variant="destructive" className="w-full max-w-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation & Submit */}
        <OnboardingStepper
          onPrev={prevStep}
          onNext={nextStep}
          onSubmit={onSubmit}
          isFirstStep={currentStep === 0}
          isLastStep={isLastStep}
          isLoading={isSubmitting}
          isValid={isCurrentStepValid}

        />
      </form>
    </FormProvider>
  )
}