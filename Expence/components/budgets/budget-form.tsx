"use client"

import { useState } from "react"
import { Budget, Category } from "@/lib/finance-data"
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

interface BudgetFormProps {
  open: boolean
  budget?: Budget
  categories: Category[]
  onSubmit: (data: Omit<Budget, "id" | "createdAt">) => void
  onOpenChange: (open: boolean) => void
}

export function BudgetForm({
  open,
  budget,
  categories,
  onSubmit,
  onOpenChange,
}: BudgetFormProps) {
  const expenseCategories = categories.filter((c) => c.type === "expense")
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const [selectedCategory, setSelectedCategory] = useState(
    budget?.categoryId || ""
  )
  const [limitAmount, setLimitAmount] = useState(
    budget?.limitAmount.toString() || ""
  )
  const [month, setMonth] = useState(budget?.month.toString() || currentMonth.toString())
  const [year, setYear] = useState(budget?.year.toString() || currentYear.toString())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCategory || !limitAmount) {
      alert("Please fill in all fields")
      return
    }

    onSubmit({
      categoryId: selectedCategory,
      limitAmount: parseFloat(limitAmount),
      month: parseInt(month),
      year: parseInt(year),
    })

    setSelectedCategory("")
    setLimitAmount("")
    setMonth(currentMonth.toString())
    setYear(currentYear.toString())
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{budget ? "Edit Budget" : "Add Budget"}</DialogTitle>
          <DialogDescription>
            Set spending limits for your expense categories
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit">Limit Amount ($)</Label>
            <Input
              id="limit"
              type="number"
              min={0.01}
              step={0.01}
              value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger id="month">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {new Date(2024, i).toLocaleString("en-US", {
                        month: "long",
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger id="year">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }).map((_, i) => {
                    const y = currentYear + i - 2
                    return (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{budget ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
