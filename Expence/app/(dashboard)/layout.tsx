import { AppShell } from "@/components/app-shell"
import { FinanceProvider } from "@/components/finance-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FinanceProvider>
      <AppShell>{children}</AppShell>
    </FinanceProvider>
  )
}
