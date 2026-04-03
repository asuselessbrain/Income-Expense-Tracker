"use client"

import { useState } from "react"
import { availableIcons } from "@/lib/finance-data"
import {
  DialogClose,
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
import { createCategory } from "@/services/category"
import { toast } from "sonner"


export function CategoryForm() {
  const [name, setName] = useState("")
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE")
  const [selectedIcon, setSelectedIcon] = useState("Wallet")
  const [selectedColor, setSelectedColor] = useState("bg-blue-500")
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  // const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined)

  // const handleAddCategory = (data: Omit<Category, "id">) => {
  //   addCategory(data)
  // }

  // const handleUpdateCategory = (data: Omit<Category, "id">) => {
  //   if (editingCategory) {
  //     updateCategory(editingCategory.id, data)
  //     setEditingCategory(undefined)
  //   }
  // }

  // const handleEditCategory = (category: Category) => {
  //   setEditingCategory(category)
  //   setFormOpen(true)
  // }

  // const handleDeleteCategory = (id: string) => {
  //   const hasTransactions = transactions.some((t) => t.categoryId === id)
  //   if (hasTransactions) {
  //     alert("Cannot delete this category because it has associated transactions.")
  //     return
  //   }
  //   if (confirm("Are you sure you want to delete this category?")) {
  //     deleteCategory(id)
  //   }
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      alert("Please enter a category name")
      return
    }

    const result = await createCategory({
      name,
      type,
      icon: selectedIcon,
      color: selectedColor,
    })

    console.log(result)

    if(result.success) {
      toast.success(result.message || "Category created successfully")
    } else {
      toast.error(result.errorMessage || "Failed to create category")
    }

    setName("")
    setType("EXPENSE")
    setSelectedIcon("Wallet")
    setSelectedColor("bg-blue-500")
  }

  return (
      <div>
        <DialogHeader>
          <DialogTitle>"Create Category"</DialogTitle>
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
            <Select value={type} onValueChange={(val) => setType(val as "INCOME" | "EXPENSE")}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
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
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
        </div>
  )
}
