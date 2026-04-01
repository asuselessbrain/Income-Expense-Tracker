"use client"

import { useFinance } from "@/components/finance-provider"
import { Budget, calculateSpentInBudget, getBudgetStatus, getBudgetProgress } from "@/lib/finance-data"
import { useMemo } from "react"

export interface BudgetWithStatus extends Budget {
  spent: number
  remaining: number
  progress: number
  status: "ok" | "warning" | "exceeded"
}

export function useBudgets() {
  const { budgets, transactions, categories, addBudget, updateBudget, deleteBudget } = useFinance()

  const budgetsWithStatus = useMemo(() => {
    return budgets.map((budget) => {
      const spent = calculateSpentInBudget(transactions, budget)
      const remaining = budget.limitAmount - spent
      const progress = getBudgetProgress(spent, budget.limitAmount)
      const status = getBudgetStatus(spent, budget.limitAmount)

      return {
        ...budget,
        spent,
        remaining,
        progress,
        status,
      }
    })
  }, [budgets, transactions])

  const currentMonthBudgets = useMemo(() => {
    const now = new Date()
    return budgetsWithStatus.filter(
      (b) => b.month === now.getMonth() && b.year === now.getFullYear()
    )
  }, [budgetsWithStatus])

  const totalSpent = useMemo(() => {
    return currentMonthBudgets.reduce((sum, b) => sum + b.spent, 0)
  }, [currentMonthBudgets])

  const totalLimit = useMemo(() => {
    return currentMonthBudgets.reduce((sum, b) => sum + b.limitAmount, 0)
  }, [currentMonthBudgets])

  const warningBudgets = useMemo(() => {
    return budgetsWithStatus.filter((b) => b.status === "warning")
  }, [budgetsWithStatus])

  const exceededBudgets = useMemo(() => {
    return budgetsWithStatus.filter((b) => b.status === "exceeded")
  }, [budgetsWithStatus])

  return {
    budgets: budgetsWithStatus,
    currentMonthBudgets,
    warningBudgets,
    exceededBudgets,
    totalSpent,
    totalLimit,
    addBudget,
    updateBudget,
    deleteBudget,
  }
}
