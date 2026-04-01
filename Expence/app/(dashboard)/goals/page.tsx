"use client"

import { useState } from "react"
import { useFinance } from "@/components/finance-provider"
import { GoalCard } from "@/components/goals/goal-card"
import { GoalForm } from "@/components/goals/goal-form"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"
import { Plus, Target } from "lucide-react"
import { Goal } from "@/lib/finance-data"
import { useGoals } from "@/hooks/useGoals"

export default function GoalsPage() {
  const { categories, currency } = useFinance()
  const { goals, addGoal, updateGoal, deleteGoal, activeGoals, alertGoals, completedGoals } = useGoals()
  const [formOpen, setFormOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined)

  const handleAddGoal = (data: Omit<Goal, "id" | "createdAt" | "completedAt">) => {
    addGoal(data)
  }

  const handleUpdateGoal = (data: Omit<Goal, "id" | "createdAt" | "completedAt">) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, data)
      setEditingGoal(undefined)
    }
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setFormOpen(true)
  }

  const handleDeleteGoal = (id: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      deleteGoal(id)
    }
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditingGoal(undefined)
  }

  const getCategory = (id: string) => categories.find((c) => c.id === id)

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground">
            Set and track your financial goals
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="rounded-xl shadow-lg shadow-primary/25">
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </header>

      <GoalForm
        open={formOpen}
        goal={editingGoal}
        categories={categories}
        onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal}
        onOpenChange={handleFormClose}
      />

      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No category goals yet"
          description="Create your first goal to track category spending, income, or savings with live transaction progress."
          action={{ label: "Add Goal", onClick: () => setFormOpen(true) }}
        />
      ) : (
        <>
          {activeGoals.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Active Goals</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {activeGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    category={getCategory(goal.categoryId)}
                    onEdit={handleEditGoal}
                    onDelete={handleDeleteGoal}
                    currency={currency}
                  />
                ))}
              </div>
            </div>
          )}

          {alertGoals.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Needs Attention</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {alertGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    category={getCategory(goal.categoryId)}
                    onEdit={handleEditGoal}
                    onDelete={handleDeleteGoal}
                    currency={currency}
                  />
                ))}
              </div>
            </div>
          )}

          {completedGoals.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Completed</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {completedGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    category={getCategory(goal.categoryId)}
                    onEdit={handleEditGoal}
                    onDelete={handleDeleteGoal}
                    currency={currency}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
