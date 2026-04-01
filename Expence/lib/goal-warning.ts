import { Goal, Transaction } from "@/lib/finance-data"

export type GoalWarningLevel = "none" | "warning" | "limit" | "exceeded"

export interface GoalProgressResult {
  goal?: Goal
  totalSpent: number
  remaining: number
  afterNewExpense: number
  percentageAfter: number
  warningLevel: GoalWarningLevel
}

function isDateWithinRange(date: Date, start: string, end: string): boolean {
  const check = new Date(date)
  const startDate = new Date(start)
  const endDate = new Date(end)
  return check >= startDate && check <= endDate
}

export function findCategoryLimitGoal(
  goals: Goal[],
  categoryId: string,
  transactionDate: Date,
): Goal | undefined {
  return goals.find(
    (goal) =>
      goal.goalType === "limit" &&
      goal.categoryId === categoryId &&
      isDateWithinRange(transactionDate, goal.startDate, goal.endDate),
  )
}

export function calculateGoalProgress(
  goals: Goal[],
  transactions: Transaction[],
  categoryId: string,
  newAmount: number,
  transactionDate: Date,
): GoalProgressResult {
  const goal = findCategoryLimitGoal(goals, categoryId, transactionDate)

  if (!goal) {
    return {
      goal: undefined,
      totalSpent: 0,
      remaining: 0,
      afterNewExpense: 0,
      percentageAfter: 0,
      warningLevel: "none",
    }
  }

  const totalSpent = transactions
    .filter((t) => {
      if (t.type !== "expense") return false
      if (t.categoryId !== categoryId) return false
      return isDateWithinRange(new Date(t.date), goal.startDate, goal.endDate)
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const safeAmount = Number.isFinite(newAmount) ? Math.max(0, newAmount) : 0
  const afterNewExpense = totalSpent + safeAmount
  const remaining = goal.targetAmount - totalSpent
  const percentageAfter = goal.targetAmount > 0 ? (afterNewExpense / goal.targetAmount) * 100 : 0

  let warningLevel: GoalWarningLevel = "none"
  if (afterNewExpense > goal.targetAmount) {
    warningLevel = "exceeded"
  } else if (afterNewExpense >= goal.targetAmount) {
    warningLevel = "limit"
  } else if (percentageAfter >= 80) {
    warningLevel = "warning"
  }

  return {
    goal,
    totalSpent,
    remaining,
    afterNewExpense,
    percentageAfter,
    warningLevel,
  }
}
