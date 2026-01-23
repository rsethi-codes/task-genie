'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      themes={['light', 'dark', 'cyberpunk', 'forest', 'sunset', 'midnight', 'monochrome']}
      enableSystem={true}
      disableTransitionOnChange={false}
      storageKey="task-genie-theme"
    >
      {children}
      <Toaster />
    </ThemeProvider>
  )
}