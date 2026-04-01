"use client"

import { Budget, Category } from "@/lib/finance-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2 } from "lucide-react"
import { BudgetProgress } from "./budget-progress"
import { CategoryIcon } from "@/components/category-icon"

interface BudgetCardProps {
  budget: Budget
  category: Category | undefined
  spent: number
  onEdit: (budget: Budget) => void
  onDelete: (id: string) => void
  currency?: string
}

export function BudgetCard({
  budget,
  category,
  spent,
  onEdit,
  onDelete,
  currency = "BDT",
}: BudgetCardProps) {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <CategoryIcon icon={category?.icon || "Wallet"} size="sm" className={category?.color || "bg-gray-500"} />
            <div>
              <h3 className="font-semibold text-sm">{category?.name || "Unknown"}</h3>
              <p className="text-xs text-muted-foreground">
                {budget.month + 1}/{budget.year}
              </p>
            </div>
          </div>
          <BudgetProgress spent={spent} limit={budget.limitAmount} currency={currency} />
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(budget)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(budget.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
