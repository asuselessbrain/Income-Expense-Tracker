import { Transaction, Category } from "@/lib/finance-data"

/**
 * Calculate total income for a period
 */
export function calculateTotalIncome(
  transactions: Transaction[],
  startDate?: Date,
  endDate?: Date
): number {
  return transactions
    .filter((t) => {
      if (!startDate || !endDate) return t.type === "income"
      const date = new Date(t.date)
      return t.type === "income" && date >= startDate && date <= endDate
    })
    .reduce((sum, t) => sum + t.amount, 0)
}

/**
 * Calculate total expense for a period
 */
export function calculateTotalExpense(
  transactions: Transaction[],
  startDate?: Date,
  endDate?: Date
): number {
  return transactions
    .filter((t) => {
      if (!startDate || !endDate) return t.type === "expense"
      const date = new Date(t.date)
      return t.type === "expense" && date >= startDate && date <= endDate
    })
    .reduce((sum, t) => sum + t.amount, 0)
}

/**
 * Calculate net balance (income - expense)
 */
export function calculateNetBalance(
  transactions: Transaction[],
  startDate?: Date,
  endDate?: Date
): number {
  const income = calculateTotalIncome(transactions, startDate, endDate)
  const expense = calculateTotalExpense(transactions, startDate, endDate)
  return income - expense
}

/**
 * Calculate expenses by category
 */
export function calculateExpensesByCategory(
  transactions: Transaction[],
  categories: Category[],
  startDate?: Date,
  endDate?: Date
): Record<string, number> {
  const expenses: Record<string, number> = {}

  transactions
    .filter((t) => {
      if (!startDate || !endDate) return t.type === "expense"
      const date = new Date(t.date)
      return t.type === "expense" && date >= startDate && date <= endDate
    })
    .forEach((t) => {
      const category = categories.find((c) => c.id === t.categoryId)
      const name = category?.name || "Unknown"
      expenses[name] = (expenses[name] || 0) + t.amount
    })

  return expenses
}

/**
 * Calculate income by category
 */
export function calculateIncomeByCategory(
  transactions: Transaction[],
  categories: Category[],
  startDate?: Date,
  endDate?: Date
): Record<string, number> {
  const income: Record<string, number> = {}

  transactions
    .filter((t) => {
      if (!startDate || !endDate) return t.type === "income"
      const date = new Date(t.date)
      return t.type === "income" && date >= startDate && date <= endDate
    })
    .forEach((t) => {
      const category = categories.find((c) => c.id === t.categoryId)
      const name = category?.name || "Unknown"
      income[name] = (income[name] || 0) + t.amount
    })

  return income
}

/**
 * Calculate average expense per day
 */
export function calculateDailyAverageExpense(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): number {
  const totalExpense = calculateTotalExpense(transactions, startDate, endDate)
  const daysDiff = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  return daysDiff > 0 ? totalExpense / daysDiff : 0
}

/**
 * Calculate expense trend (percentage change)
 */
export function calculateExpenseTrend(
  currentPeriod: number,
  previousPeriod: number
): number {
  if (previousPeriod === 0) return currentPeriod > 0 ? 100 : 0
  return ((currentPeriod - previousPeriod) / previousPeriod) * 100
}

/**
 * Get top spending categories
 */
export function getTopCategories(
  transactions: Transaction[],
  categories: Category[],
  limit = 5,
  startDate?: Date,
  endDate?: Date
): Array<{ name: string; amount: number; percentage: number }> {
  const expenses = calculateExpensesByCategory(transactions, categories, startDate, endDate)
  const totalExpense = Object.values(expenses).reduce((sum, amt) => sum + amt, 0)

  return Object.entries(expenses)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit)
}

/**
 * Calculate savings rate
 */
export function calculateSavingsRate(
  transactions: Transaction[],
  startDate?: Date,
  endDate?: Date
): number {
  const income = calculateTotalIncome(transactions, startDate, endDate)
  const expense = calculateTotalExpense(transactions, startDate, endDate)

  if (income === 0) return 0
  return ((income - expense) / income) * 100
}
