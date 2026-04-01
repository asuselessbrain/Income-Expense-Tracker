"use client"

import Link from "next/link"
import { useFinance } from "@/components/finance-provider"
import { getCategoryById, formatCurrency, formatDate } from "@/lib/finance-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CategoryIcon } from "@/components/category-icon"
import { ArrowRight, Receipt } from "lucide-react"

export function RecentTransactions() {
  const { transactions, currency } = useFinance()

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const isEmpty = recentTransactions.length === 0

  return (
    <Card className="glass border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Recent Transactions
        </CardTitle>
        <Button variant="ghost" size="sm" asChild className="text-xs">
          <Link href="/transactions">
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        {isEmpty ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Receipt className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No transactions yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Start by adding your first transaction</p>
            <Button asChild className="mt-4 rounded-xl">
              <Link href="/add">Add Transaction</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTransactions.map((transaction) => {
              const category = getCategoryById(transaction.categoryId)
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-xl bg-secondary/50 p-3 transition-all duration-200 hover:bg-secondary hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <CategoryIcon
                      icon={category?.icon || "Circle"}
                      className={category?.color || "bg-gray-500"}
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {category?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      transaction.type === "income"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount, currency)}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
