'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode, useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SocketProvider } from '@/components/providers/socket-provider'
import { ClientSideInit } from '@/components/client-side-init'

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
          <ClientSideInit />
          {children}
          <Toaster />
        </ThemeProvider>
      </SocketProvider>
    </QueryClientProvider>
  )
}