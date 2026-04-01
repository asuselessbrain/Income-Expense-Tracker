import { Transaction, Category } from "@/lib/finance-data"

export interface Insight {
  id: string
  icon: string
  title: string
  message: string
  type: "positive" | "warning" | "info" | "negative"
  action?: {
    label: string
    href?: string
  }
}

/**
 * Compare current month spending vs previous month
 */
export function compareMonthlySpending(
  transactions: Transaction[],
  currentMonth?: Date
): Insight | null {
  const now = currentMonth || new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  const currentMonthSpending = transactions
    .filter((t) => {
      const date = new Date(t.date)
      return t.type === "expense" && date >= currentMonthStart && date <= currentMonthEnd
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const previousMonthSpending = transactions
    .filter((t) => {
      const date = new Date(t.date)
      return t.type === "expense" && date >= previousMonthStart && date <= previousMonthEnd
    })
    .reduce((sum, t) => sum + t.amount, 0)

  if (previousMonthSpending === 0) return null

  const percentChange = ((currentMonthSpending - previousMonthSpending) / previousMonthSpending) * 100

  if (percentChange > 20) {
    return {
      id: "monthly-increase",
      icon: "TrendingUp",
      title: "Higher Spending",
      message: `Your spending is ${Math.round(percentChange)}% higher than last month. Consider reviewing your expenses.`,
      type: "warning",
    }
  }

  if (percentChange < -20) {
    return {
      id: "monthly-decrease",
      icon: "TrendingDown",
      title: "Lower Spending",
      message: `Great job! Your spending decreased by ${Math.round(Math.abs(percentChange))}% compared to last month.`,
      type: "positive",
    }
  }

  return null
}

/**
 * Find the top spending category
 */
export function getTopSpendingCategory(
  transactions: Transaction[],
  categories: Category[],
  currentMonth?: Date
): Insight | null {
  const now = currentMonth || new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const categorySpending: Record<string, number> = {}

  transactions
    .filter((t) => {
      const date = new Date(t.date)
      return t.type === "expense" && date >= monthStart && date <= monthEnd
    })
    .forEach((t) => {
      categorySpending[t.categoryId] = (categorySpending[t.categoryId] || 0) + t.amount
    })

  if (Object.keys(categorySpending).length === 0) return null

  const topCategoryId = Object.entries(categorySpending).sort(
    ([, a], [, b]) => b - a
  )[0][0]

  const topCategory = categories.find((c) => c.id === topCategoryId)
  if (!topCategory) return null

  const amount = categorySpending[topCategoryId]

  return {
    id: "top-category",
    icon: "Target",
    title: "Top Spending Category",
    message: `${topCategory.name} is your highest spending category this month with $${amount.toFixed(2)}.`,
    type: "info",
  }
}

/**
 * Detect unusual spending spikes
 */
export function detectSpendingSpike(
  transactions: Transaction[],
  threshold: number = 2
): Insight | null {
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Get all transaction amounts for current month
  const amounts = transactions
    .filter((t) => {
      const date = new Date(t.date)
      return t.type === "expense" && date >= currentMonthStart && date <= currentMonthEnd
    })
    .map((t) => t.amount)
    .sort((a, b) => a - b)

  if (amounts.length < 3) return null

  // Calculate average and std dev
  const avg = amounts.reduce((sum, a) => sum + a, 0) / amounts.length
  const variance =
    amounts.reduce((sum, a) => sum + Math.pow(a - avg, 2), 0) / amounts.length
  const stdDev = Math.sqrt(variance)

  // Find outliers (> 2 std devs from mean)
  const outliers = amounts.filter((a) => a > avg + threshold * stdDev)

  if (outliers.length > 0) {
    const maxOutlier = Math.max(...outliers)
    const percentAboveAvg = ((maxOutlier - avg) / avg) * 100

    return {
      id: "spending-spike",
      icon: "AlertTriangle",
      title: "Unusual Spending Detected",
      message: `You had a transaction of $${maxOutlier.toFixed(2)}, which is ${Math.round(percentAboveAvg)}% above your typical spending.`,
      type: "warning",
    }
  }

  return null
}

/**
 * Suggest savings based on spending patterns
 */
export function generateSavingsTip(
  transactions: Transaction[],
  categories: Category[]
): Insight | null {
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Get discretionary spending (entertainment, shopping, dining)
  const discretionaryCategoryIds = ["entertainment", "shopping", "food"]
  const discretionarySpending = transactions
    .filter((t) => {
      const date = new Date(t.date)
      return (
        t.type === "expense" &&
        discretionaryCategoryIds.includes(t.categoryId) &&
        date >= currentMonthStart &&
        date <= currentMonthEnd
      )
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const totalSpending = transactions
    .filter((t) => {
      const date = new Date(t.date)
      return t.type === "expense" && date >= currentMonthStart && date <= currentMonthEnd
    })
    .reduce((sum, t) => sum + t.amount, 0)

  if (discretionarySpending > totalSpending * 0.3) {
    return {
      id: "discretionary-spending",
      icon: "Lightbulb",
      title: "Potential Savings Opportunity",
      message: `${Math.round((discretionarySpending / totalSpending) * 100)}% of this month's spending is discretionary. Consider reducing to save more.`,
      type: "info",
    }
  }

  return null
}

/**
 * Generate all insights for the current period
 */
export function generateAllInsights(
  transactions: Transaction[],
  categories: Category[],
  currentMonth?: Date
): Insight[] {
  const insights: Insight[] = []

  const monthlyComparison = compareMonthlySpending(transactions, currentMonth)
  if (monthlyComparison) insights.push(monthlyComparison)

  const topCategory = getTopSpendingCategory(transactions, categories, currentMonth)
  if (topCategory) insights.push(topCategory)

  const spike = detectSpendingSpike(transactions)
  if (spike) insights.push(spike)

  const savings = generateSavingsTip(transactions, categories)
  if (savings) insights.push(savings)

  return insights
}
