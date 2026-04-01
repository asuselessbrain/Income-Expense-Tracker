"use client"

import { generateAllInsights } from "@/lib/insights"
import { Transaction, Category } from "@/lib/finance-data"
import { InsightCard } from "./insight-card"

interface InsightsGridProps {
  transactions: Transaction[]
  categories: Category[]
  title?: string
}

export function InsightsGrid({
  transactions,
  categories,
  title = "Smart Insights",
}: InsightsGridProps) {
  const insights = generateAllInsights(transactions, categories)

  if (insights.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  )
}
