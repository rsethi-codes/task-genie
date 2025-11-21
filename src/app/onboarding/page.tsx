import { OnboardingForm } from '@/components/onboarding/onboarding-form'

export const metadata = {
  title: 'Onboarding - Task Genie',
  description: 'Complete your profile to get started',
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Welcome to Task Genie 👋
          </h1>
          <p className="text-lg text-text-secondary">
            Let&apos;s get to know your work preferences
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  )
}