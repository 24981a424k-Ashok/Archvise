import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8 select-none">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-[450px] w-full rounded-lg" />
    </div>
  )
}
