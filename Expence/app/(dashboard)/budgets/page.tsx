"use client"

import { useState } from "react"
import { useFinance } from "@/components/finance-provider"
import { BudgetCard } from "@/components/budgets/budget-card"
import { BudgetForm } from "@/components/budgets/budget-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Budget, calculateSpentInBudget } from "@/lib/finance-data"
import { Card } from "@/components/ui/card"

export default function BudgetsPage() {
  const { budgets, addBudget, updateBudget, deleteBudget, categories, transactions, currency } = useFinance()
  const [formOpen, setFormOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>(undefined)

  const handleAddBudget = (data: Omit<Budget, "id" | "createdAt">) => {
    addBudget(data)
  }

  const handleUpdateBudget = (data: Omit<Budget, "id" | "createdAt">) => {
    if (editingBudget) {
      updateBudget(editingBudget.id, data)
      setEditingBudget(undefined)
    }
  }

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget)
    setFormOpen(true)
  }

  const handleDeleteBudget = (id: string) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      deleteBudget(id)
    }
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditingBudget(undefined)
  }

  // Sort budgets by month and year
  const sortedBudgets = [...budgets].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    return b.month - a.month
  })

  const currentBudgets = sortedBudgets.filter((b) => {
    const now = new Date()
    return b.month === now.getMonth() && b.year === now.getFullYear()
  })

  const pastBudgets = sortedBudgets.filter((b) => {
    const now = new Date()
    return !(b.month === now.getMonth() && b.year === now.getFullYear())
  })

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground">
            Set spending limits for your categories
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="rounded-xl shadow-lg shadow-primary/25">
          <Plus className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </header>

      <BudgetForm
        open={formOpen}
        budget={editingBudget}
        categories={categories}
        onSubmit={editingBudget ? handleUpdateBudget : handleAddBudget}
        onOpenChange={handleFormClose}
      />

      {sortedBudgets.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No budgets yet. Create one to get started!</p>
        </Card>
      ) : (
        <>
          {currentBudgets.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Current Month</h2>
              <div className="grid gap-4">
                {currentBudgets.map((budget) => {
                  const category = categories.find((c) => c.id === budget.categoryId)
                  const spent = calculateSpentInBudget(transactions, budget)
                  return (
                    <BudgetCard
                      key={budget.id}
                      budget={budget}
                      category={category}
                      spent={spent}
                      onEdit={handleEditBudget}
                      onDelete={handleDeleteBudget}
                      currency={currency}
                    />
                  )
                })}
              </div>
            </div>
          )}

          {pastBudgets.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Previous Months</h2>
              <div className="grid gap-4">
                {pastBudgets.map((budget) => {
                  const category = categories.find((c) => c.id === budget.categoryId)
                  const spent = calculateSpentInBudget(transactions, budget)
                  return (
                    <BudgetCard
                      key={budget.id}
                      budget={budget}
                      category={category}
                      spent={spent}
                      onEdit={handleEditBudget}
                      onDelete={handleDeleteBudget}
                      currency={currency}
                    />
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
