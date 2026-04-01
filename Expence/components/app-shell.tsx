"use client"

import { AppSidebar, BottomNav } from "./app-sidebar"
import { Toaster } from "./toaster"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="lg:pl-64">
        <div className="min-h-screen pb-20 lg:pb-0">
          {children}
        </div>
      </main>
      <BottomNav />
      <Toaster />
    </div>
  )
}
