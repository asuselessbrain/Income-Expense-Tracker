"use client"

import { Progress } from "@/components/ui/progress"
import { getGoalProgress, formatCurrency } from "@/lib/finance-data"

interface GoalProgressProps {
  saved: number
  target: number
  currency?: string
  showPercentage?: boolean
}

export function GoalProgress({ 
  saved, 
  target, 
  currency = "BDT",
  showPercentage = true 
}: GoalProgressProps) {
  const progress = getGoalProgress(saved, target)
  const isComplete = progress >= 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          {formatCurrency(saved, currency)} / {formatCurrency(target, currency)}
        </span>
        {showPercentage && (
          <span className={`font-medium ${isComplete ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <Progress value={progress} className={isComplete ? "bg-emerald-500/10" : ""} />
    </div>
  )
}
