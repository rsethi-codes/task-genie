import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Success - Task Genie',
  description: 'Onboarding complete!',
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-surface border-border p-8 text-center space-y-6 animate-in fade-in-50 duration-500">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-success animate-in bounce duration-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-text-primary">
            All Set! 🎉
          </h1>
          <p className="text-text-secondary">
            Your preferences have been saved successfully. You&apos;re ready to become more productive!
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Link href="/dashboard" className="block">
            <Button className="w-full bg-primary hover:bg-primary-hover h-10">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="text-xs text-text-tertiary">
            You can update these preferences anytime in settings
          </p>
        </div>
      </Card>
    </div>
  )
}