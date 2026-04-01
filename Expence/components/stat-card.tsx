"use client"

import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/finance-data"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

export interface StatCardProps {
  label: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    direction: "up" | "down" | "neutral"
  }
}

export function StatCard({
  label,
  value,
  description,
  icon,
  trend,
}: StatCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <div className={`flex items-center gap-1 text-sm ${
                trend.direction === "up" ? "text-red-500" : trend.direction === "down" ? "text-emerald-500" : "text-muted-foreground"
              }`}>
                {trend.direction === "up" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : trend.direction === "down" ? (
                  <TrendingDown className="h-4 w-4" />
                ) : null}
                {Math.abs(trend.value).toFixed(1)}%
              </div>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {icon && (
          <div className="ml-4 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}

export function StatsGrid({
  stats,
}: {
  stats: StatCardProps[]
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  )
}
