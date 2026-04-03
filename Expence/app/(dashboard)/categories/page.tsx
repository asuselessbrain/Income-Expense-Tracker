import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddCategoryDialog } from "@/components/category-management/add-category-dialog"
import { getCategory } from "@/services/category";
import { CategoryCard } from "@/components/category-management/category-card";
import { TabsContent } from "@radix-ui/react-tabs";
import { Card } from "@/components/ui/card";
import { ICategory } from "@/types";

export default async function CategoriesPage() {

  const incomeCategories = await getCategory("INCOME");

  const expenseCategories = await getCategory("EXPENSE");


  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your transaction categories
          </p>
        </div>
        <AddCategoryDialog />
      </header>

      <Tabs defaultValue="income" className="w-full">
        <TabsList className="rounded-xl p-1 grid w-full grid-cols-2">
          <TabsTrigger value="income" className="rounded-lg">Income</TabsTrigger>
          <TabsTrigger value="expense" className="rounded-lg">Expense</TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-6 mt-6">
          {incomeCategories.data.length > 0 ? (
            <>
              {incomeCategories.data.length > 0 && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {incomeCategories.data.map((category: ICategory) => (
                      <CategoryCard key={category.id}
                        category={category} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No income categories</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="expense" className="space-y-6 mt-6">
          {expenseCategories.data.length > 0 ? (
            <>
              {expenseCategories.data.length > 0 && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {expenseCategories.data.map((category: ICategory) => (
                      <CategoryCard
                        key={category.id}
                        category={category}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* <div className="space-y-4">
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
              </div> */}
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
