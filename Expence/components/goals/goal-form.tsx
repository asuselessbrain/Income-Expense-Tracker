"use client"

import { useState } from "react"
import { Category, Goal } from "@/lib/finance-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface GoalFormProps {
  open: boolean
  goal?: Goal
  categories: Category[]
  onSubmit: (data: Omit<Goal, "id" | "createdAt" | "completedAt">) => void
  onOpenChange: (open: boolean) => void
}

export function GoalForm({
  open,
  goal,
  categories,
  onSubmit,
  onOpenChange,
}: GoalFormProps) {
  const [title, setTitle] = useState(goal?.title || "")
  const [targetAmount, setTargetAmount] = useState(goal?.targetAmount.toString() || "")
  const [categoryId, setCategoryId] = useState(goal?.categoryId || "")
  const [goalType, setGoalType] = useState<"limit" | "save" | "earn">(goal?.goalType || "limit")
  const [startDate, setStartDate] = useState(goal?.startDate || "")
  const [endDate, setEndDate] = useState(goal?.endDate || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !targetAmount || !categoryId || !startDate || !endDate) {
      alert("Please fill in all required fields")
      return
    }

    onSubmit({
      title,
      categoryId,
      goalType,
      targetAmount: parseFloat(targetAmount),
      startDate,
      endDate,
    })

    setTitle("")
    setCategoryId("")
    setGoalType("limit")
    setTargetAmount("")
    setStartDate("")
    setEndDate("")
    onOpenChange(false)
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "Create Goal"}</DialogTitle>
          <DialogDescription>
            Create category-based goals and track progress from your transactions
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Food Spending Limit"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="target">Target Amount</Label>
              <Input
                id="target"
                type="number"
                min={0.01}
                step={0.01}
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Goal Type</Label>
              <Select value={goalType} onValueChange={(v) => setGoalType(v as "limit" | "save" | "earn")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select goal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="limit">Limit spending</SelectItem>
                  <SelectItem value="save">Save money</SelectItem>
                  <SelectItem value="earn">Earn income</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{goal ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
