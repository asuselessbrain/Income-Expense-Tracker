"use client"

import { useFinance } from "@/components/finance-provider"
import { Goal, getGoalStatus, getGoalProgress, getGoalCurrentAmount } from "@/lib/finance-data"
import { useMemo } from "react"

export interface GoalWithStatus extends Goal {
  currentAmount: number
  progress: number
  status: "on-track" | "near-limit" | "exceeded" | "completed"
  remainingOrOver: number
  isCompleted: boolean
  message: string
}

export function useGoals() {
  const { goals, addGoal, updateGoal, deleteGoal, completeGoal, transactions, categories } = useFinance()

  const goalsWithStatus = useMemo(() => {
    return goals.map((goal) => {
      const currentAmount = getGoalCurrentAmount(goal, transactions)
      const status = getGoalStatus(goal, currentAmount)
      const progress = getGoalProgress(currentAmount, goal.targetAmount)
      const remainingOrOver = goal.goalType === "limit"
        ? Math.max(0, currentAmount - goal.targetAmount)
        : Math.max(0, goal.targetAmount - currentAmount)
      const isCompleted = status === "completed"
      const categoryName = categories.find((c) => c.id === goal.categoryId)?.name || "this category"

      const message = goal.goalType === "limit"
        ? `You have spent ${Math.round(currentAmount)} out of ${Math.round(goal.targetAmount)} in ${categoryName}`
        : goal.goalType === "earn"
        ? `You have earned ${Math.round(currentAmount)} out of ${Math.round(goal.targetAmount)} in ${categoryName}`
        : `You have saved ${Math.round(currentAmount)} out of ${Math.round(goal.targetAmount)} in ${categoryName}`

      return {
        ...goal,
        currentAmount,
        progress,
        status,
        remainingOrOver,
        isCompleted,
        message,
      }
    })
  }, [goals, transactions, categories])

  const activeGoals = useMemo(() => {
    return goalsWithStatus.filter((g) => g.status === "on-track")
  }, [goalsWithStatus])

  const completedGoals = useMemo(() => {
    return goalsWithStatus.filter((g) => g.status === "completed")
  }, [goalsWithStatus])

  const alertGoals = useMemo(() => {
    return goalsWithStatus.filter((g) => g.status === "near-limit" || g.status === "exceeded")
  }, [goalsWithStatus])

  const totalCurrent = useMemo(() => {
    return goalsWithStatus.reduce((sum, g) => sum + g.currentAmount, 0)
  }, [goalsWithStatus])

  const totalTarget = useMemo(() => {
    return goalsWithStatus.reduce((sum, g) => sum + g.targetAmount, 0)
  }, [goalsWithStatus])

  const completionPercentage = useMemo(() => {
    return totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0
  }, [totalCurrent, totalTarget])

  return {
    goals: goalsWithStatus,
    activeGoals,
    completedGoals,
    alertGoals,
    totalCurrent,
    totalTarget,
    completionPercentage,
    addGoal,
    updateGoal,
    deleteGoal,
    completeGoal,
  }
}
