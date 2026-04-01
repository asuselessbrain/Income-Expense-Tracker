"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useFinance } from "@/components/finance-provider"
import { useAppToast } from "@/lib/toast-store"
import { availableIcons, availableColors, formatCurrency, type TransactionType } from "@/lib/finance-data"
import { useGoalWarning } from "@/hooks/useGoalWarning"
import { calculateGoalProgress, findCategoryLimitGoal } from "@/lib/goal-warning"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CategoryIcon, IconRenderer } from "@/components/category-icon"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Check, Loader2, Plus } from "lucide-react"
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

interface QuickCategoryData {
  name: string
  icon: string
  color: string
}

export default function AddTransactionPage() {
  const router = useRouter()
  const { addTransaction, categories, addCategory, goals, transactions, currency } = useFinance()
  const { success, warning } = useAppToast()

  const [type, setType] = useState<TransactionType>("expense")
  const [amount, setAmount] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showLimitConfirm, setShowLimitConfirm] = useState(false)
  
  // Quick add category state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [quickCategory, setQuickCategory] = useState<QuickCategoryData>({
    name: "",
    icon: "Circle",
    color: "bg-blue-500",
  })

  const filteredCategories = categories.filter((c) => c.type === type)
  const parsedAmount = parseFloat(amount || "0") || 0
  const goalWarning = useGoalWarning(categoryId, parsedAmount, date, type)

  const categoryRemainingById = useMemo(() => {
    if (type !== "expense") return {}

    const map: Record<string, number> = {}
    for (const cat of filteredCategories) {
      const result = calculateGoalProgress(goals, transactions, cat.id, 0, date)
      if (!result.goal) continue
      map[cat.id] = Math.max(0, result.goal.targetAmount - result.totalSpent)
    }
    return map
  }, [type, filteredCategories, goals, transactions, date])

  const warningText =
    goalWarning.warningLevel === "warning"
      ? `You are close to your limit. Remaining: ${formatCurrency(Math.max(0, goalWarning.goal ? goalWarning.goal.targetAmount - goalWarning.afterNewExpense : 0), currency)}`
      : goalWarning.warningLevel === "limit"
      ? `You have reached your goal limit for this category.`
      : goalWarning.warningLevel === "exceeded"
      ? `This will exceed your goal limit by ${formatCurrency(Math.max(0, goalWarning.afterNewExpense - (goalWarning.goal?.targetAmount || 0)), currency)}`
      : ""

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "")
    const parts = value.split(".")
    if (parts.length > 2) return
    if (parts[1]?.length > 2) return
    setAmount(value)
  }

  const saveTransaction = async () => {
    if (!amount || !categoryId) return

    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 300))

    addTransaction({
      amount: parseFloat(amount),
      type,
      categoryId,
      date: format(date, "yyyy-MM-dd"),
      note: note || undefined,
    })

    if (type === "expense" && goalWarning.warningLevel === "warning") {
      warning("Warning: You are close to your budget", warningText)
    }

    if (type === "expense" && (goalWarning.warningLevel === "limit" || goalWarning.warningLevel === "exceeded")) {
      warning("Limit exceeded", warningText)
    }

    success(
      type === "income" ? "Income added" : "Expense recorded",
      `${type === "income" ? "+" : "-"}${formatCurrency(parseFloat(amount), currency)} has been saved`
    )

    router.push("/")
  }

  const handleSubmit = async () => {
    if (!amount || !categoryId) return

    if (type === "expense" && goalWarning.warningLevel === "exceeded") {
      setShowLimitConfirm(true)
      return
    }

    await saveTransaction()
  }

  const handleQuickAddCategory = () => {
    if (!quickCategory.name.trim()) return
    
    addCategory({
      name: quickCategory.name,
      icon: quickCategory.icon,
      color: quickCategory.color,
      type,
    })
    
    success("Category added", `${quickCategory.name} is now available`)
    setIsQuickAddOpen(false)
    setQuickCategory({ name: "", icon: "Circle", color: "bg-blue-500" })
  }

  const isValid = amount && parseFloat(amount) > 0 && categoryId

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 pb-32 lg:pb-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Add Transaction</h1>
        <p className="text-muted-foreground">Record a new income or expense</p>
      </header>

      {/* Amount Input */}
      <Card className="glass border-0 overflow-hidden">
        <CardContent className="p-0">
          <div className={cn(
            "p-8 text-center transition-colors duration-300",
            type === "expense" 
              ? "bg-linear-to-br from-rose-500/10 to-rose-500/5" 
              : "bg-linear-to-br from-emerald-500/10 to-emerald-500/5"
          )}>
            <p className="text-sm text-muted-foreground mb-3">Amount</p>
            <div className="flex items-center justify-center">
              <span className={cn(
                "text-5xl font-light transition-colors",
                type === "expense" ? "text-rose-500" : "text-emerald-500"
              )}>
                {type === "expense" ? "-" : "+"}৳
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                autoFocus
                className={cn(
                  "text-5xl font-bold bg-transparent border-none text-center w-48 focus:outline-none placeholder:text-muted-foreground/30",
                  "transition-colors"
                )}
              />
            </div>
          </div>
          {type === "expense" && goalWarning.warningLevel !== "none" && (
            <div
              className={cn(
                "border-t px-6 py-3 text-sm",
                goalWarning.warningLevel === "warning" && "bg-amber-500/10 text-amber-700 dark:text-amber-300",
                (goalWarning.warningLevel === "limit" || goalWarning.warningLevel === "exceeded") &&
                  "bg-red-500/10 text-red-700 dark:text-red-300",
              )}
            >
              {warningText}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Type Toggle */}
      <Card className="glass border-0">
        <CardContent className="p-3">
          <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl">
            <Button
              variant="ghost"
              onClick={() => {
                setType("expense")
                setCategoryId("")
              }}
              className={cn(
                "flex-1 rounded-lg h-12 transition-all duration-200",
                type === "expense" 
                  ? "bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/25" 
                  : "text-muted-foreground hover:text-foreground hover:bg-transparent"
              )}
            >
              Expense
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setType("income")
                setCategoryId("")
              }}
              className={cn(
                "flex-1 rounded-lg h-12 transition-all duration-200",
                type === "income" 
                  ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/25" 
                  : "text-muted-foreground hover:text-foreground hover:bg-transparent"
              )}
            >
              Income
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Selector */}
      <Card className="glass border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium">Category</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsQuickAddOpen(true)}
              className="text-xs text-primary hover:text-primary"
            >
              <Plus className="mr-1 h-3 w-3" />
              New Category
            </Button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200",
                  categoryId === cat.id
                    ? "bg-primary/10 ring-2 ring-primary scale-105"
                    : "bg-secondary/50 hover:bg-secondary hover:scale-102"
                )}
              >
                <div className="relative">
                  <CategoryIcon icon={cat.icon} className={cat.color} />
                  {categoryId === cat.id && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <span className="text-xs text-center font-medium truncate w-full">
                  {cat.name.split(" ")[0]}
                </span>
                {type === "expense" && (() => {
                  const linkedGoal = findCategoryLimitGoal(goals, cat.id, date)
                  if (!linkedGoal) return null
                  const remaining = categoryRemainingById[cat.id] ?? linkedGoal.targetAmount
                  return (
                    <span className="text-[10px] text-muted-foreground truncate w-full">
                      Remaining: {formatCurrency(remaining, currency)}
                    </span>
                  )
                })()}
              </button>
            ))}
            
            {/* Empty state if no categories */}
            {filteredCategories.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <p className="text-sm">No categories yet</p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setIsQuickAddOpen(true)}
                  className="mt-2"
                >
                  Create your first category
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Date Picker */}
      <Card className="glass border-0">
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-3">Date</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                className="w-full justify-start text-left font-normal rounded-xl h-12"
              >
                <CalendarIcon className="mr-3 h-4 w-4" />
                {format(date, "EEEE, MMMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* Note */}
      <Card className="glass border-0">
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-3">Note (optional)</p>
          <Textarea
            placeholder="Add a description for this transaction..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-25 resize-none rounded-xl"
          />
        </CardContent>
      </Card>

      {/* Submit Button - Fixed on mobile */}
      <div className="fixed bottom-20 left-0 right-0 bg-linear-to-t from-background via-background to-transparent p-4 lg:relative lg:bottom-0 lg:bg-transparent lg:p-0">
        <Button
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          className={cn(
            "w-full h-14 rounded-xl text-base font-semibold transition-all duration-300",
            type === "expense"
              ? "bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/25"
              : "bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25",
            !isValid && "opacity-50"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            `Save ${type === "expense" ? "Expense" : "Income"}`
          )}
        </Button>
      </div>

      {/* Quick Add Category Dialog */}
      <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quick Add Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input
                value={quickCategory.name}
                onChange={(e) => setQuickCategory({ ...quickCategory, name: e.target.value })}
                placeholder="Enter category name"
                className="rounded-xl"
                autoFocus
              />
            </div>

            {/* Icon Picker */}
            <div className="space-y-2">
              <Label>Icon</Label>
              <ScrollArea className="h-28 rounded-xl border p-3">
                <div className="grid grid-cols-8 gap-2">
                  {availableIcons.slice(0, 24).map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setQuickCategory({ ...quickCategory, icon: iconName })}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                        quickCategory.icon === iconName
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
                    onClick={() => setQuickCategory({ ...quickCategory, color: color.value })}
                    className={cn(
                      "h-7 w-7 rounded-full transition-all",
                      color.value,
                      quickCategory.color === color.value
                        ? "ring-2 ring-offset-2 ring-primary scale-110"
                        : "hover:scale-105"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <CategoryIcon icon={quickCategory.icon} className={quickCategory.color} size="sm" />
              <span className="font-medium text-sm">{quickCategory.name || "Category Name"}</span>
              <span className="text-xs text-muted-foreground capitalize ml-auto">
                {type}
              </span>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsQuickAddOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button 
              onClick={handleQuickAddCategory} 
              disabled={!quickCategory.name.trim()}
              className="rounded-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showLimitConfirm} onOpenChange={setShowLimitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You are exceeding your budget</AlertDialogTitle>
            <AlertDialogDescription>
              {warningText || "This expense will exceed your goal limit. Do you want to continue?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setShowLimitConfirm(false)
                await saveTransaction()
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
