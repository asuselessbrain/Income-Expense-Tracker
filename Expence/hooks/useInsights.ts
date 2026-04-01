"use client"

import { useFinance } from "@/components/finance-provider"
import { useMemo } from "react"
import { generateAllInsights, Insight } from "@/lib/insights"

export function useInsights() {
  const { transactions, categories } = useFinance()

  const insights = useMemo(() => {
    return generateAllInsights(transactions, categories)
  }, [transactions, categories])

  const criticalInsights = useMemo(() => {
    return insights.filter((i) => i.type === "warning" || i.type === "negative")
  }, [insights])

  const positiveInsights = useMemo(() => {
    return insights.filter((i) => i.type === "positive")
  }, [insights])

  const hasCriticalInsights = useMemo(() => {
    return criticalInsights.length > 0
  }, [criticalInsights])

  return {
    insights,
    criticalInsights,
    positiveInsights,
    hasCriticalInsights,
  }
}
