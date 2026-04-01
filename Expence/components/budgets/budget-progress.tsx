"use client"

import { Progress } from "@/components/ui/progress"
import { getBudgetStatus, getBudgetProgress, formatCurrency } from "@/lib/finance-data"

interface BudgetProgressProps {
  spent: number
  limit: number
  currency?: string
}

export function BudgetProgress({ spent, limit, currency = "BDT" }: BudgetProgressProps) {
  const progress = getBudgetProgress(spent, limit)
  const status = getBudgetStatus(spent, limit)

  const statusColors = {
    ok: "bg-emerald-500",
    warning: "bg-amber-500",
    exceeded: "bg-red-500",
  }

  const statusBgColors = {
    ok: "bg-emerald-500/10",
    warning: "bg-amber-500/10",
    exceeded: "bg-red-500/10",
  }

  const statusTextColors = {
    ok: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    exceeded: "text-red-600 dark:text-red-400",
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          {formatCurrency(spent, currency)} / {formatCurrency(limit, currency)}
        </span>
        <span className={`font-medium ${statusTextColors[status]}`}>
          {Math.round(progress)}%
        </span>
      </div>
      <Progress value={progress} className={statusBgColors[status]} />
      {status === "warning" && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          ⚠️ Budget is {Math.round(progress)}% spent
        </p>
      )}
      {status === "exceeded" && (
        <p className="text-xs text-red-600 dark:text-red-400">
          🚨 Budget exceeded by {formatCurrency(spent - limit, currency)}
        </p>
      )}
    </div>
  )
}
