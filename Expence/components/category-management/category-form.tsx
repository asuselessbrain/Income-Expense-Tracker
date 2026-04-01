"use client"

import { useState } from "react"
import { Category, availableIcons } from "@/lib/finance-data"
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
import { CategoryIcon } from "@/components/category-icon"
import { availableColors } from "@/lib/finance-data"

interface CategoryFormProps {
  open: boolean
  category?: Category
  onSubmit: (data: Omit<Category, "id">) => void
  onOpenChange: (open: boolean) => void
}

export function CategoryForm({
  open,
  category,
  onSubmit,
  onOpenChange,
}: CategoryFormProps) {
  const [name, setName] = useState(category?.name || "")
  const [type, setType] = useState<"income" | "expense">(category?.type || "expense")
  const [selectedIcon, setSelectedIcon] = useState(category?.icon || "Wallet")
  const [selectedColor, setSelectedColor] = useState(category?.color || "bg-blue-500")
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      alert("Please enter a category name")
      return
    }

    onSubmit({
      name,
      type,
      icon: selectedIcon,
      color: selectedColor,
    })

    setName("")
    setType("expense")
    setSelectedIcon("Wallet")
    setSelectedColor("bg-blue-500")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Create Category"}</DialogTitle>
          <DialogDescription>
            Create a new category for organizing your transactions
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Subscriptions"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(val) => setType(val as "income" | "expense")}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <button
              type="button"
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="flex items-center gap-2 p-2 border rounded-lg hover:bg-accent w-full justify-center"
            >
              <CategoryIcon icon={selectedIcon} size="sm" className={selectedColor} />
              <span className="text-sm">{selectedIcon}</span>
            </button>

            {showIconPicker && (
              <div className="grid grid-cols-6 gap-2 p-3 border rounded-lg bg-accent/50 max-h-48 overflow-y-auto">
                {availableIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => {
                      setSelectedIcon(icon)
                      setShowIconPicker(false)
                    }}
                    className={`p-2 border rounded-lg hover:bg-accent transition ${
                      selectedIcon === icon ? "border-primary bg-primary/10" : ""
                    }`}
                    title={icon}
                  >
                    <CategoryIcon icon={icon} size="sm" className={selectedColor} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center gap-2 p-2 border rounded-lg hover:bg-accent w-full justify-center"
            >
              <div className={`w-6 h-6 rounded-full ${selectedColor}`} />
              <span className="text-sm">{availableColors.find((c) => c.value === selectedColor)?.name}</span>
            </button>

            {showColorPicker && (
              <div className="grid grid-cols-6 gap-2 p-3 border rounded-lg bg-accent/50">
                {availableColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => {
                      setSelectedColor(color.value)
                      setShowColorPicker(false)
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition ${
                      selectedColor === color.value
                        ? "border-foreground ring-2 ring-offset-2 ring-offset-background ring-primary"
                        : "border-transparent"
                    }`}
                    title={color.name}
                  >
                    <div className={`w-full h-full rounded-full ${color.value}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{category ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
