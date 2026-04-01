"use client"

import { Category, Goal, formatCurrency, formatDate } from "@/lib/finance-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit2 } from "lucide-react"
import { CategoryIcon } from "@/components/category-icon"

interface GoalCardProps {
  goal: Goal & {
    currentAmount: number
    progress: number
    status: "on-track" | "near-limit" | "exceeded" | "completed"
    message: string
  }
  category?: Category
  onEdit: (goal: Goal) => void
  onDelete: (id: string) => void
  currency?: string
}

export function GoalCard({
  goal,
  category,
  onEdit,
  onDelete,
  currency = "BDT",
}: GoalCardProps) {
  const statusStyles: Record<string, string> = {
    "on-track": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    "near-limit": "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    "exceeded": "bg-red-500/15 text-red-700 dark:text-red-300",
    "completed": "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  }

  const progressBarClass =
    goal.status === "exceeded"
      ? "[&>div]:bg-red-500"
      : goal.status === "near-limit"
      ? "[&>div]:bg-amber-500"
      : goal.status === "completed"
      ? "[&>div]:bg-blue-500"
      : "[&>div]:bg-emerald-500"

  const label =
    goal.status === "on-track"
      ? "On Track"
      : goal.status === "near-limit"
      ? "Near Limit"
      : goal.status === "exceeded"
      ? "Exceeded"
      : "Completed"

  const goalTypeLabel =
    goal.goalType === "limit"
      ? "Limit Spending"
      : goal.goalType === "earn"
      ? "Earn Income"
      : "Save Money"

  return (
    <Card className="p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3 grow">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <CategoryIcon icon={category?.icon || "Wallet"} size="sm" className={category?.color || "bg-slate-500"} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{goal.title}</h3>
                  <Badge className={statusStyles[goal.status]}>{label}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {category?.name || "Unknown Category"} • {goalTypeLabel}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {formatCurrency(goal.currentAmount, currency)} / {formatCurrency(goal.targetAmount, currency)}
              </span>
              <span className="font-semibold">{Math.round(goal.progress)}%</span>
            </div>
            <Progress
              value={Math.min(goal.progress, 100)}
              className={`h-2.5 bg-muted/70 transition-all duration-300 ${progressBarClass}`}
            />
          </div>

          <p className="text-sm text-muted-foreground">{goal.message}</p>
        </div>

        <div className="flex gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => onEdit(goal)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(goal.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
