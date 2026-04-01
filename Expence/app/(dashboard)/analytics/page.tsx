"use client"

import { useMemo } from "react"
import { useFinance } from "@/components/finance-provider"
import { PeriodProvider, usePeriod } from "@/components/period-provider"
import { DateRangeFilter } from "@/components/date-range-filter"
import { formatCurrency } from "@/lib/finance-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryIcon } from "@/components/category-icon"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, TrendingDown, AlertCircle, Lightbulb, Target, ArrowUp, ArrowDown, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, isWithinInterval, eachDayOfInterval, eachMonthOfInterval, startOfDay, differenceInDays } from "date-fns"

const COLORS = [
  "hsl(160, 70%, 45%)",
  "hsl(0, 75%, 55%)",
  "hsl(220, 70%, 55%)",
  "hsl(45, 90%, 50%)",
  "hsl(280, 65%, 55%)",
]

function AnalyticsContent() {
  const { transactions, currency, categories, getCategoryById } = useFinance()
  const { periodType, customRange, getDateRange, getPreviousRange, getRangeLabel } = usePeriod()

  // Filter transactions for current range
  const currentRangeData = useMemo(() => {
    const range = getDateRange()
    return transactions.filter(t => 
      isWithinInterval(new Date(t.date), { start: range.from, end: range.to })
    )
  }, [transactions, getDateRange])

  // Filter transactions for previous range (for comparison)
  const previousRangeData = useMemo(() => {
    const range = getPreviousRange()
    return transactions.filter(t => 
      isWithinInterval(new Date(t.date), { start: range.from, end: range.to })
    )
  }, [transactions, getPreviousRange])

  // Calculate current period totals
  const currentIncome = currentRangeData.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const currentExpense = currentRangeData.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)
  
  // Calculate previous period totals
  const previousIncome = previousRangeData.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const previousExpense = previousRangeData.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)

  // Calculate changes
  const incomeChange = previousIncome > 0 ? ((currentIncome - previousIncome) / previousIncome) * 100 : 0
  const expenseChange = previousExpense > 0 ? ((currentExpense - previousExpense) / previousExpense) * 100 : 0
  const savingsRate = currentIncome > 0 ? ((currentIncome - currentExpense) / currentIncome) * 100 : 0

  // Generate trend data based on period
  const trendData = useMemo(() => {
    const range = getDateRange()
    const daysDiff = differenceInDays(range.to, range.from)
    
    // Use daily for ranges <= 31 days, monthly for longer
    const useDaily = daysDiff <= 31
    
    if (useDaily) {
      const days = eachDayOfInterval({ start: range.from, end: range.to })
      return days.map(day => {
        const dayStart = startOfDay(day)
        const dayTransactions = currentRangeData.filter(t => {
          const tDate = startOfDay(new Date(t.date))
          return tDate.getTime() === dayStart.getTime()
        })
        return {
          date: format(day, "MMM d"),
          income: dayTransactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0),
          expense: dayTransactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0),
        }
      })
    } else {
      const months = eachMonthOfInterval({ start: range.from, end: range.to })
      return months.map(month => {
        const monthTransactions = currentRangeData.filter(t => {
          const tDate = new Date(t.date)
          return tDate.getMonth() === month.getMonth() && tDate.getFullYear() === month.getFullYear()
        })
        return {
          date: format(month, "MMM yy"),
          income: monthTransactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0),
          expense: monthTransactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0),
        }
      })
    }
  }, [currentRangeData, getDateRange])

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {}
    
    currentRangeData
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const category = getCategoryById(t.categoryId)
        const name = category?.name || "Other"
        breakdown[name] = (breakdown[name] || 0) + t.amount
      })

    return Object.entries(breakdown)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [currentRangeData, getCategoryById])

  // Top spending categories
  const topCategories = useMemo(() => {
    const catTotals: Record<string, { amount: number; categoryId: string }> = {}
    
    currentRangeData
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        if (!catTotals[t.categoryId]) {
          catTotals[t.categoryId] = { amount: 0, categoryId: t.categoryId }
        }
        catTotals[t.categoryId].amount += t.amount
      })

    return Object.values(catTotals)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }, [currentRangeData])

  // Generate insights based on data
  const insights = useMemo(() => {
    const results = []
    
    // Spending comparison
    if (expenseChange !== 0 && previousExpense > 0) {
      results.push({
        icon: expenseChange > 0 ? TrendingUp : TrendingDown,
        title: `You spent ${Math.abs(expenseChange).toFixed(0)}% ${expenseChange > 0 ? "more" : "less"} in this period`,
        description: expenseChange > 0 
          ? "Consider reviewing your expenses to stay on budget"
          : "Great job keeping your spending in check!",
        type: expenseChange > 0 ? "warning" : "success" as const,
      })
    }
    
    // Top spending category
    if (topCategories.length > 0 && currentExpense > 0) {
      const top = topCategories[0]
      const category = getCategoryById(top.categoryId)
      const percentage = ((top.amount / currentExpense) * 100).toFixed(0)
      results.push({
        icon: AlertCircle,
        title: `Top category: ${category?.name}`,
        description: `${percentage}% of expenses in this period (${formatCurrency(top.amount, currency)})`,
        type: "info" as const,
      })
    }

    // Savings rate
    if (currentIncome > 0) {
      if (savingsRate > 20) {
        results.push({
          icon: Target,
          title: `Excellent savings rate: ${savingsRate.toFixed(0)}%`,
          description: "You're saving more than 20% of your income. Keep it up!",
          type: "success" as const,
        })
      } else if (savingsRate < 10 && savingsRate >= 0) {
        results.push({
          icon: TrendingDown,
          title: `Low savings rate: ${savingsRate.toFixed(0)}%`,
          description: "Consider reducing expenses to save at least 20% of income.",
          type: "warning" as const,
        })
      }
    }

    // No data warning
    if (currentRangeData.length === 0) {
      results.push({
        icon: Calendar,
        title: "No data in selected range",
        description: "Try selecting a different date range or add some transactions.",
        type: "info" as const,
      })
    }

    // Tip
    results.push({
      icon: Lightbulb,
      title: "Pro tip",
      description: "Set monthly budget limits for each category to better control spending.",
      type: "info" as const,
    })

    return results
  }, [topCategories, currentExpense, currentIncome, savingsRate, currency, expenseChange, previousExpense, getCategoryById, currentRangeData.length])

  // Previous period label
  const previousRangeLabel = useMemo(() => {
    const range = getPreviousRange()
    return `${format(range.from, "MMM d")} - ${format(range.to, "MMM d, yyyy")}`
  }, [getPreviousRange])

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Insights for {getRangeLabel()}
          </p>
        </div>
        <DateRangeFilter />
      </header>

      {/* Comparison Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-0 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Income</p>
              <p className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                {formatCurrency(currentIncome, currency)}
              </p>
            </div>
            {incomeChange !== 0 && previousIncome > 0 && (
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
                incomeChange > 0 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              )}>
                {incomeChange > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {Math.abs(incomeChange).toFixed(0)}%
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            vs {formatCurrency(previousIncome, currency)} previous
          </p>
        </Card>

        <Card className="glass border-0 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Expenses</p>
              <p className="text-2xl font-bold mt-1 text-rose-600 dark:text-rose-400">
                {formatCurrency(currentExpense, currency)}
              </p>
            </div>
            {expenseChange !== 0 && previousExpense > 0 && (
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
                expenseChange < 0 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              )}>
                {expenseChange > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {Math.abs(expenseChange).toFixed(0)}%
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            vs {formatCurrency(previousExpense, currency)} previous
          </p>
        </Card>

        <Card className="glass border-0 p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Net Savings</p>
          <p className={cn(
            "text-2xl font-bold mt-1",
            currentIncome - currentExpense >= 0 
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400"
          )}>
            {formatCurrency(currentIncome - currentExpense, currency)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">In selected period</p>
        </Card>

        <Card className="glass border-0 p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Savings Rate</p>
          <p className={cn(
            "text-2xl font-bold mt-1",
            savingsRate >= 20 
              ? "text-emerald-600 dark:text-emerald-400"
              : savingsRate >= 10
              ? "text-amber-600 dark:text-amber-400"
              : "text-rose-600 dark:text-rose-400"
          )}>
            {currentIncome > 0 ? `${savingsRate.toFixed(0)}%` : "N/A"}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Target: 20%+</p>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="glass border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Income vs Expense Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {trendData.length > 0 && currentRangeData.length > 0 ? (
            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(160, 70%, 45%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(160, 70%, 45%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0, 75%, 55%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(0, 75%, 55%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => value >= 1000 ? `$${value / 1000}k` : `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
                      padding: "12px",
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke="hsl(160, 70%, 45%)"
                    strokeWidth={2}
                    fill="url(#incomeGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    name="Expense"
                    stroke="hsl(0, 75%, 55%)"
                    strokeWidth={2}
                    fill="url(#expenseGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-75 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No data available for this period</p>
                <p className="text-sm mt-1">Try selecting a different date range</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Breakdown Pie Chart */}
        <Card className="glass border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {categoryBreakdown.length > 0 ? (
              <div className="h-75">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {categoryBreakdown.slice(0, 5).map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                        padding: "12px",
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                    />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      iconType="circle"
                      iconSize={10}
                      wrapperStyle={{ fontSize: "13px", lineHeight: "1.8" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-75 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p>No expense data for this period</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Categories with Progress */}
        <Card className="glass border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Top Spending Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-5">
              {topCategories.map((item, index) => {
                const category = getCategoryById(item.categoryId)
                const percentage = currentExpense > 0 ? (item.amount / currentExpense) * 100 : 0
                return (
                  <div key={item.categoryId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CategoryIcon
                          icon={category?.icon || "Circle"}
                          className={category?.color || "bg-gray-500"}
                          size="sm"
                        />
                        <span className="text-sm font-medium">
                          {category?.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold">
                          {formatCurrency(item.amount, currency)}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                )
              })}
              {topCategories.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  No expense data for this period
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="glass border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3 rounded-xl p-4 transition-all duration-200 hover:scale-[1.01]",
                  insight.type === "success"
                    ? "bg-emerald-500/10"
                    : insight.type === "warning"
                    ? "bg-amber-500/10"
                    : "bg-blue-500/10"
                )}
              >
                <insight.icon
                  className={cn(
                    "h-5 w-5 mt-0.5 shrink-0",
                    insight.type === "success"
                      ? "text-emerald-500"
                      : insight.type === "warning"
                      ? "text-amber-500"
                      : "text-blue-500"
                  )}
                />
                <div>
                  <p className="text-sm font-semibold">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {insight.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Period comparison note */}
      <div className="text-center text-xs text-muted-foreground">
        Comparing to previous period: {previousRangeLabel}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <PeriodProvider>
      <AnalyticsContent />
    </PeriodProvider>
  )
}
