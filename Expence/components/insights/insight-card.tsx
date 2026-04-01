"use client"

import { Insight } from "@/lib/insights"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Target,
  Lightbulb,
  Info,
} from "lucide-react"
import Link from "next/link"

const iconMap = {
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  Lightbulb,
  Info,
}

interface InsightCardProps {
  insight: Insight
}

export function InsightCard({ insight }: InsightCardProps) {
  const Icon = iconMap[insight.icon as keyof typeof iconMap] || Info

  const typeStyles = {
    positive: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900",
    warning: "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900",
    info: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900",
    negative: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900",
  }

  const iconStyles = {
    positive: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    info: "text-blue-600 dark:text-blue-400",
    negative: "text-red-600 dark:text-red-400",
  }

  return (
    <Card className={`p-4 border ${typeStyles[insight.type]}`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-1 flex-shrink-0 ${iconStyles[insight.type]}`} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">{insight.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{insight.message}</p>
          {insight.action && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-auto p-0"
              asChild={!!insight.action.href}
            >
              {insight.action.href ? (
                <Link href={insight.action.href}>{insight.action.label} →</Link>
              ) : (
                <span>{insight.action.label}</span>
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
