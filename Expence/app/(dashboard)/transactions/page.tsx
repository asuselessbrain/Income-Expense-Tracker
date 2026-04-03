"use client"

import { useState, useMemo } from "react"
import { useFinance } from "@/components/finance-provider"
import { useAppToast } from "@/lib/toast-store"
import {
  getCategoryById,
  formatCurrency,
  formatDate,
  categories,
  type TransactionType,
} from "@/lib/finance-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CategoryIcon } from "@/components/category-icon"
import { Search, X, Trash2, CalendarIcon, Receipt } from "lucide-react"
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

export default function TransactionsPage() {
  const { transactions, deleteTransaction, currency } = useFinance()
  const { success } = useAppToast()
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        if (typeFilter !== "all" && t.type !== typeFilter) return false
        if (categoryFilter !== "all" && t.categoryId !== categoryFilter) return false
        
        // Date range filter
        if (dateRange?.from && dateRange?.to) {
          const transactionDate = new Date(t.date)
          if (!isWithinInterval(transactionDate, { start: dateRange.from, end: dateRange.to })) {
            return false
          }
        }
        
        if (search) {
          const category = getCategoryById(t.categoryId)
          const searchLower = search.toLowerCase()
          return (
            category?.name.toLowerCase().includes(searchLower) ||
            t.note?.toLowerCase().includes(searchLower)
          )
        }
        return true
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [transactions, typeFilter, categoryFilter, search, dateRange])

  const hasFilters = search || typeFilter !== "all" || categoryFilter !== "all"

  const clearFilters = () => {
    setSearch("")
    setTypeFilter("all")
    setCategoryFilter("all")
    setDateRange({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    })
  }

  const handleDelete = (id: string) => {
    deleteTransaction(id)
    success("Transaction deleted", "The transaction has been removed")
  }

  const totalIncome = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          View and manage all your transactions
        </p>
      </header>

      {/* Filters */}
      <Card className="glass border-0">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl h-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* Type Filter */}
              <Select
                value={typeFilter}
                onValueChange={(v) => setTypeFilter(v as "all" | TransactionType)}
              >
                <SelectTrigger className="w-32.5 rounded-xl h-10">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 rounded-xl h-10">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Date Range Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-55 justify-start text-left font-normal rounded-xl h-10",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "MMM d")} -{" "}
                          {format(dateRange.to, "MMM d, yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "MMM d, yyyy")
                      )
                    ) : (
                      "Pick a date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFilters}
                  className="rounded-xl h-10 w-10"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card className="glass border-0 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Transactions</p>
          <p className="text-xl font-bold mt-1">{filteredTransactions.length}</p>
        </Card>
        <Card className="glass border-0 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Income</p>
          <p className="text-xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalIncome, currency)}
          </p>
        </Card>
        <Card className="glass border-0 p-4 col-span-2 sm:col-span-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Expenses</p>
          <p className="text-xl font-bold mt-1 text-rose-600 dark:text-rose-400">
            {formatCurrency(totalExpense, currency)}
          </p>
        </Card>
      </div>

      {/* Transaction List */}
      <Card className="glass border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            {filteredTransactions.length} Transaction
            {filteredTransactions.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Receipt className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">No transactions found</p>
              {hasFilters && (
                <Button
                  variant="link"
                  onClick={clearFilters}
                  className="mt-2 text-primary"
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((transaction) => {
                const category = getCategoryById(transaction.categoryId)
                return (
                  <div
                    key={transaction.id}
                    className="group flex items-center justify-between rounded-xl bg-secondary/50 p-3 transition-all duration-200 hover:bg-secondary hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <CategoryIcon
                        icon={category?.icon || "Circle"}
                        className={category?.color || "bg-gray-500"}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {category?.name || "Unknown"}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatDate(transaction.date)}</span>
                          {transaction.note && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-37.5">
                                {transaction.note}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(transaction.id)}
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
