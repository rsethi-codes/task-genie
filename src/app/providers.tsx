'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      themes={['light', 'dark']}
      enableSystem={false}
      disableTransitionOnChange={false}
      storageKey="task-genie-theme"
    >
      {children}
    </ThemeProvider>
  )
}