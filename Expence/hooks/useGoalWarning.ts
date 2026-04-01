"use client"

import { useMemo } from "react"
import { useFinance } from "@/components/finance-provider"
import { calculateGoalProgress } from "@/lib/goal-warning"
import type { GoalWarningLevel } from "@/lib/goal-warning"

export function useGoalWarning(
  categoryId: string,
  amount: number,
  date: Date,
  type: "income" | "expense",
) {
  const { goals, transactions } = useFinance()

  return useMemo(() => {
    if (!categoryId || type !== "expense") {
      return {
        goal: undefined,
        totalSpent: 0,
        remaining: 0,
        afterNewExpense: 0,
        percentageAfter: 0,
        warningLevel: "none" as GoalWarningLevel,
      }
    }

    return calculateGoalProgress(goals, transactions, categoryId, amount, date)
  }, [goals, transactions, categoryId, amount, date, type])
}
