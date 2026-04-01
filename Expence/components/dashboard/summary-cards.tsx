"use client"

import { useFinance } from "@/components/finance-provider"
import { formatCurrency } from "@/lib/finance-data"
import { Card } from "@/components/ui/card"
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react"

export function SummaryCards() {
  const { transactions, currency } = useFinance()

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense
  const savings = totalIncome - totalExpense
  const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(0) : "0"

  const cards = [
    {
      title: "Total Balance",
      amount: balance,
      icon: Wallet,
      gradient: "from-primary/20 via-primary/10 to-primary/5",
      iconBg: "bg-primary",
      trend: null,
    },
    {
      title: "Total Income",
      amount: totalIncome,
      icon: TrendingUp,
      gradient: "from-emerald-500/20 via-emerald-500/10 to-emerald-500/5",
      iconBg: "bg-emerald-500",
      trend: "+12.5%",
    },
    {
      title: "Total Expense",
      amount: totalExpense,
      icon: TrendingDown,
      gradient: "from-rose-500/20 via-rose-500/10 to-rose-500/5",
      iconBg: "bg-rose-500",
      trend: "-8.3%",
    },
    {
      title: "Savings",
      amount: savings,
      icon: PiggyBank,
      gradient: "from-blue-500/20 via-blue-500/10 to-blue-500/5",
      iconBg: "bg-blue-500",
      trend: `${savingsRate}% rate`,
      trendColor: Number(savingsRate) >= 20 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={`relative overflow-hidden border-0 bg-gradient-to-br ${card.gradient} p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {card.title}
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {formatCurrency(card.amount, currency)}
              </p>
              {card.trend && (
                <p
                  className={`text-xs font-medium ${
                    card.trendColor ||
                    (card.trend.startsWith("+")
                      ? "text-emerald-600 dark:text-emerald-400"
                      : card.trend.startsWith("-")
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-muted-foreground")
                  }`}
                >
                  {card.trend} {!card.trendColor && "from last month"}
                </p>
              )}
            </div>
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg} shadow-lg`}
            >
              <card.icon className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
