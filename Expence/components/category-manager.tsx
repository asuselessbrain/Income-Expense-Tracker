"use client"

import { useState } from "react"
import { useFinance } from "@/components/finance-provider"
import { useAppToast } from "@/lib/toast-store"
import { availableIcons, availableColors, type TransactionType } from "@/lib/finance-data"
import { CategoryIcon, IconRenderer } from "@/components/category-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Plus, Pencil, Trash2, Check, X } from "lucide-react"

interface CategoryFormData {
  name: string
  icon: string
  type: TransactionType
  color: string
}

const defaultFormData: CategoryFormData = {
  name: "",
  icon: "Circle",
  type: "expense",
  color: "bg-blue-500",
}

export function CategoryManager() {
  const { categories, addCategory, updateCategory, deleteCategory, transactions } = useFinance()
  const { success, error } = useAppToast()
  
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>(defaultFormData)
  const [activeTab, setActiveTab] = useState<TransactionType>("expense")

  const incomeCategories = categories.filter((c) => c.type === "income")
  const expenseCategories = categories.filter((c) => c.type === "expense")

  const handleOpenAdd = () => {
    setFormData({ ...defaultFormData, type: activeTab })
    setIsAddOpen(true)
  }

  const handleOpenEdit = (id: string) => {
    const category = categories.find(c => c.id === id)
    if (category) {
      setFormData({
        name: category.name,
        icon: category.icon,
        type: category.type,
        color: category.color,
      })
      setEditingId(id)
    }
  }

  const handleSaveAdd = () => {
    if (!formData.name.trim()) {
      error("Error", "Category name is required")
      return
    }
    addCategory(formData)
    success("Category added", `${formData.name} has been created`)
    setIsAddOpen(false)
    setFormData(defaultFormData)
  }

  const handleSaveEdit = () => {
    if (!editingId || !formData.name.trim()) return
    updateCategory(editingId, formData)
    success("Category updated", `${formData.name} has been updated`)
    setEditingId(null)
    setFormData(defaultFormData)
  }

  const handleDelete = () => {
    if (!deleteId) return
    
    const category = categories.find(c => c.id === deleteId)
    const hasTransactions = transactions.some(t => t.categoryId === deleteId)
    
    if (hasTransactions) {
      error("Cannot delete", "This category has transactions. Delete or reassign them first.")
      setDeleteId(null)
      return
    }
    
    deleteCategory(deleteId)
    success("Category deleted", `${category?.name} has been removed`)
    setDeleteId(null)
  }

  const CategoryForm = ({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) => (
    <div className="space-y-5">
      {/* Name */}
      <div className="space-y-2">
        <Label>Category Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter category name"
          className="rounded-xl"
          autoFocus
        />
      </div>

      {/* Type */}
      <div className="space-y-2">
        <Label>Type</Label>
        <Tabs
          value={formData.type}
          onValueChange={(v) => setFormData({ ...formData, type: v as TransactionType })}
        >
          <TabsList className="w-full rounded-xl">
            <TabsTrigger value="expense" className="flex-1 rounded-lg">
              Expense
            </TabsTrigger>
            <TabsTrigger value="income" className="flex-1 rounded-lg">
              Income
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Icon Picker */}
      <div className="space-y-2">
        <Label>Icon</Label>
        <ScrollArea className="h-32 rounded-xl border p-3">
          <div className="grid grid-cols-8 gap-2">
            {availableIcons.map((iconName) => (
              <button
                key={iconName}
                type="button"
                onClick={() => setFormData({ ...formData, icon: iconName })}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition-all",
                  formData.icon === iconName
                    ? "bg-primary text-primary-foreground scale-110"
                    : "bg-secondary/50 hover:bg-secondary"
                )}
              >
                <IconRenderer icon={iconName} className="h-4 w-4" />
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Color Picker */}
      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {availableColors.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setFormData({ ...formData, color: color.value })}
              className={cn(
                "h-8 w-8 rounded-full transition-all",
                color.value,
                formData.color === color.value
                  ? "ring-2 ring-offset-2 ring-primary scale-110"
                  : "hover:scale-105"
              )}
            />
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <Label>Preview</Label>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
          <CategoryIcon icon={formData.icon} className={formData.color} />
          <span className="font-medium">{formData.name || "Category Name"}</span>
          <span className="text-xs text-muted-foreground capitalize ml-auto">
            {formData.type}
          </span>
        </div>
      </div>

      {/* Actions */}
      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="outline" onClick={onCancel} className="rounded-xl">
          Cancel
        </Button>
        <Button onClick={onSave} className="rounded-xl">
          <Check className="mr-2 h-4 w-4" />
          Save Category
        </Button>
      </DialogFooter>
    </div>
  )

  const CategoryList = ({ items, type }: { items: typeof categories; type: TransactionType }) => (
    <div className="space-y-2">
      {items.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground text-sm">
          No {type} categories yet
        </div>
      ) : (
        items.map((cat) => {
          const transactionCount = transactions.filter(t => t.categoryId === cat.id).length
          return (
            <div
              key={cat.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group"
            >
              <CategoryIcon icon={cat.icon} className={cat.color} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{cat.name}</p>
                <p className="text-xs text-muted-foreground">
                  {transactionCount} transaction{transactionCount !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenEdit(cat.id)}
                  className="h-8 w-8 rounded-lg"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(cat.id)}
                  className="h-8 w-8 rounded-lg text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Header with tabs and add button */}
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TransactionType)}>
          <TabsList className="rounded-xl">
            <TabsTrigger value="expense" className="rounded-lg text-xs">
              Expenses ({expenseCategories.length})
            </TabsTrigger>
            <TabsTrigger value="income" className="rounded-lg text-xs">
              Income ({incomeCategories.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-xl" onClick={handleOpenAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <CategoryForm onSave={handleSaveAdd} onCancel={() => setIsAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Category List */}
      <div className="transition-all duration-200">
        {activeTab === "expense" ? (
          <CategoryList items={expenseCategories} type="expense" />
        ) : (
          <CategoryList items={incomeCategories} type="income" />
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <CategoryForm onSave={handleSaveEdit} onCancel={() => setEditingId(null)} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
