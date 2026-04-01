"use client"

import Link from "next/link"
import { useFinance } from "@/components/finance-provider"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { InsightsGrid } from "@/components/insights/insights-grid"
import { PeriodProvider } from "@/components/period-provider"
import { DateRangeFilter } from "@/components/date-range-filter"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

function DashboardContent() {
  const { transactions, categories } = useFinance()

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your financial overview
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <DateRangeFilter />
          <Button asChild className="hidden md:flex rounded-xl shadow-lg shadow-primary/25">
            <Link href="/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Link>
          </Button>
        </div>
      </header>

      <SummaryCards />

      <InsightsGrid transactions={transactions} categories={categories} />

      <div className="grid gap-6 lg:grid-cols-2">
        <OverviewChart />
        <CategoryChart />
      </div>

      <RecentTransactions />

      {/* Floating Add Button for Mobile */}
      <Link
        href="/add"
        className="fixed bottom-20 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105 active:scale-95 lg:hidden"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <PeriodProvider>
      <DashboardContent />
    </PeriodProvider>
  )
}
