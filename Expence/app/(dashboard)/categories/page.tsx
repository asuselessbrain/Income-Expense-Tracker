"use client"

import { useState } from "react"
import { useFinance } from "@/components/finance-provider"
import { CategoryCard } from "@/components/category-management/category-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { Category } from "@/lib/finance-data"
import { Card } from "@/components/ui/card"
import { CategoryForm } from "@/components/category-management/category-form"

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory, transactions } = useFinance()
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined)

  const handleAddCategory = (data: Omit<Category, "id">) => {
    addCategory(data)
  }

  const handleUpdateCategory = (data: Omit<Category, "id">) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, data)
      setEditingCategory(undefined)
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setFormOpen(true)
  }

  const handleDeleteCategory = (id: string) => {
    const hasTransactions = transactions.some((t) => t.categoryId === id)
    if (hasTransactions) {
      alert("Cannot delete this category because it has associated transactions.")
      return
    }
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory(id)
    }
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditingCategory(undefined)
  }

  const incomeCategories = categories.filter((c) => c.type === "income")
  const expenseCategories = categories.filter((c) => c.type === "expense")

  const defaultIncomeIds = ["salary", "freelance", "investments", "gifts", "other-income"]
  const defaultExpenseIds = ["food", "transport", "shopping", "entertainment", "bills", "health", "education", "travel", "other-expense"]

  const customIncomeCategories = incomeCategories.filter((c) => !defaultIncomeIds.includes(c.id))
  const customExpenseCategories = expenseCategories.filter((c) => !defaultExpenseIds.includes(c.id))

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your transaction categories
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="rounded-xl shadow-lg shadow-primary/25">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </header>

      <CategoryForm
        open={formOpen}
        category={editingCategory}
        onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
        onOpenChange={handleFormClose}
      />

      <Tabs defaultValue="income" className="w-full">
        <TabsList className="rounded-xl p-1 grid w-full grid-cols-2">
          <TabsTrigger value="income" className="rounded-lg">Income</TabsTrigger>
          <TabsTrigger value="expense" className="rounded-lg">Expense</TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-6 mt-6">
          {incomeCategories.length > 0 ? (
            <>
              {customIncomeCategories.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">Custom Categories</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {customIncomeCategories.map((category) => (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        onEdit={handleEditCategory}
                        onDelete={handleDeleteCategory}
                        isDefault={false}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground">Default Categories</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {incomeCategories.filter((c) => defaultIncomeIds.includes(c.id)).map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onEdit={handleEditCategory}
                      onDelete={handleDeleteCategory}
                      isDefault={true}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No income categories</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="expense" className="space-y-6 mt-6">
          {expenseCategories.length > 0 ? (
            <>
              {customExpenseCategories.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">Custom Categories</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {customExpenseCategories.map((category) => (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        onEdit={handleEditCategory}
                        onDelete={handleDeleteCategory}
                        isDefault={false}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground">Default Categories</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {expenseCategories.filter((c) => defaultExpenseIds.includes(c.id)).map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onEdit={handleEditCategory}
                      onDelete={handleDeleteCategory}
                      isDefault={true}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No expense categories</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
