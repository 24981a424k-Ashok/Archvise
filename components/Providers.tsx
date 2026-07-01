"use client"

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false
      }
    }
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster theme="dark" closeButton richColors position="top-right" />
    </QueryClientProvider>
  )
}
export { Providers }
