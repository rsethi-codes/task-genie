'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode, useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SocketProvider } from '@/components/providers/socket-provider'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 30,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
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
      </SocketProvider>
    </QueryClientProvider>
  )
}