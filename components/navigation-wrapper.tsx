"use client"

import { Navigation } from '@/components/navigation'

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  )
}
