export type TransactionType = 'income' | 'expense'

export type Category = {
  id: string
  name: string
  icon: string
  type: TransactionType
  color: string
}

export type Transaction = {
  id: string
  amount: number
  type: TransactionType
  categoryId: string
  date: string
  note?: string
}

export type Budget = {
  id: string
  categoryId: string
  limitAmount: number
  month: number // 0-11
  year: number
  createdAt: string
}

export type Goal = {
  id: string
  title: string
  categoryId: string
  goalType: 'limit' | 'save' | 'earn'
  targetAmount: number
  startDate: string
  endDate: string
  createdAt: string
  completedAt?: string
}

// Available icons for category picker
export const availableIcons = [
  "Briefcase",
  "Laptop",
  "TrendingUp",
  "Gift",
  "Plus",
  "Utensils",
  "Car",
  "ShoppingBag",
  "Film",
  "Receipt",
  "Heart",
  "GraduationCap",
  "Plane",
  "MoreHorizontal",
  "Home",
  "Wifi",
  "Phone",
  "Music",
  "Book",
  "Camera",
  "Coffee",
  "Gamepad2",
  "Dumbbell",
  "Shirt",
  "Baby",
  "Dog",
  "Leaf",
  "Wrench",
  "Banknote",
  "CreditCard",
  "PiggyBank",
  "Wallet",
] as const

// Available colors for categories
export const availableColors = [
  { name: "Emerald", value: "bg-emerald-500" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Pink", value: "bg-pink-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Yellow", value: "bg-yellow-500" },
  { name: "Red", value: "bg-red-500" },
  { name: "Cyan", value: "bg-cyan-500" },
  { name: "Indigo", value: "bg-indigo-500" },
  { name: "Teal", value: "bg-teal-500" },
  { name: "Lime", value: "bg-lime-500" },
  { name: "Amber", value: "bg-amber-500" },
] as const

export const defaultCategories: Category[] = [
  // Income categories
  { id: 'salary', name: 'Salary', icon: 'Briefcase', type: 'income', color: 'bg-emerald-500' },
  { id: 'freelance', name: 'Freelance', icon: 'Laptop', type: 'income', color: 'bg-blue-500' },
  { id: 'investments', name: 'Investments', icon: 'TrendingUp', type: 'income', color: 'bg-green-500' },
  { id: 'gifts', name: 'Gifts', icon: 'Gift', type: 'income', color: 'bg-pink-500' },
  { id: 'other-income', name: 'Other', icon: 'Plus', type: 'income', color: 'bg-gray-500' },
  // Expense categories
  { id: 'food', name: 'Food & Dining', icon: 'Utensils', type: 'expense', color: 'bg-orange-500' },
  { id: 'transport', name: 'Transport', icon: 'Car', type: 'expense', color: 'bg-blue-500' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', type: 'expense', color: 'bg-purple-500' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Film', type: 'expense', color: 'bg-pink-500' },
  { id: 'bills', name: 'Bills & Utilities', icon: 'Receipt', type: 'expense', color: 'bg-yellow-500' },
  { id: 'health', name: 'Health', icon: 'Heart', type: 'expense', color: 'bg-red-500' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', type: 'expense', color: 'bg-indigo-500' },
  { id: 'travel', name: 'Travel', icon: 'Plane', type: 'expense', color: 'bg-cyan-500' },
  { id: 'other-expense', name: 'Other', icon: 'MoreHorizontal', type: 'expense', color: 'bg-gray-500' },
]

// Keep for backwards compatibility - maps to dynamic categories
export const categories = defaultCategories

// Sample transactions data
export const sampleTransactions: Transaction[] = [
  { id: '1', amount: 5000, type: 'income', categoryId: 'salary', date: '2024-03-01', note: 'Monthly salary' },
  { id: '2', amount: 1200, type: 'income', categoryId: 'freelance', date: '2024-03-05', note: 'Web design project' },
  { id: '3', amount: 85, type: 'expense', categoryId: 'food', date: '2024-03-02', note: 'Grocery shopping' },
  { id: '4', amount: 45, type: 'expense', categoryId: 'transport', date: '2024-03-03', note: 'Gas' },
  { id: '5', amount: 250, type: 'expense', categoryId: 'shopping', date: '2024-03-04', note: 'New headphones' },
  { id: '6', amount: 120, type: 'expense', categoryId: 'entertainment', date: '2024-03-06', note: 'Concert tickets' },
  { id: '7', amount: 200, type: 'expense', categoryId: 'bills', date: '2024-03-07', note: 'Electric bill' },
  { id: '8', amount: 500, type: 'income', categoryId: 'investments', date: '2024-03-10', note: 'Dividend payment' },
  { id: '9', amount: 65, type: 'expense', categoryId: 'food', date: '2024-03-11', note: 'Restaurant' },
  { id: '10', amount: 150, type: 'expense', categoryId: 'health', date: '2024-03-12', note: 'Gym membership' },
  { id: '11', amount: 3500, type: 'income', categoryId: 'salary', date: '2024-02-01', note: 'Monthly salary' },
  { id: '12', amount: 95, type: 'expense', categoryId: 'food', date: '2024-02-05', note: 'Grocery' },
  { id: '13', amount: 180, type: 'expense', categoryId: 'transport', date: '2024-02-10', note: 'Car maintenance' },
  { id: '14', amount: 75, type: 'expense', categoryId: 'entertainment', date: '2024-02-15', note: 'Movies' },
  { id: '15', amount: 800, type: 'income', categoryId: 'freelance', date: '2024-02-20', note: 'Logo design' },
  { id: '16', amount: 350, type: 'expense', categoryId: 'shopping', date: '2024-02-25', note: 'Clothes' },
  { id: '17', amount: 4200, type: 'income', categoryId: 'salary', date: '2024-01-01', note: 'Monthly salary' },
  { id: '18', amount: 110, type: 'expense', categoryId: 'food', date: '2024-01-08', note: 'Dinner out' },
  { id: '19', amount: 500, type: 'expense', categoryId: 'travel', date: '2024-01-15', note: 'Weekend trip' },
  { id: '20', amount: 200, type: 'expense', categoryId: 'education', date: '2024-01-20', note: 'Online course' },
]

// Sample budgets data - 2024 March budgets
export const sampleBudgets: Budget[] = [
  { id: 'b1', categoryId: 'food', limitAmount: 300, month: 2, year: 2024, createdAt: '2024-03-01' },
  { id: 'b2', categoryId: 'transport', limitAmount: 200, month: 2, year: 2024, createdAt: '2024-03-01' },
  { id: 'b3', categoryId: 'entertainment', limitAmount: 150, month: 2, year: 2024, createdAt: '2024-03-01' },
  { id: 'b4', categoryId: 'shopping', limitAmount: 500, month: 2, year: 2024, createdAt: '2024-03-01' },
  { id: 'b5', categoryId: 'bills', limitAmount: 400, month: 2, year: 2024, createdAt: '2024-03-01' },
]

// Sample goals data
export const sampleGoals: Goal[] = [
  {
    id: 'g1',
    title: 'Food Budget Limit',
    categoryId: 'food',
    goalType: 'limit',
    targetAmount: 5000,
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    createdAt: '2024-03-01',
  },
  {
    id: 'g2',
    title: 'Freelance Income Target',
    categoryId: 'freelance',
    goalType: 'earn',
    targetAmount: 3000,
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    createdAt: '2024-03-01',
  },
  {
    id: 'g3',
    title: 'Travel Savings Plan',
    categoryId: 'travel',
    goalType: 'save',
    targetAmount: 2500,
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    createdAt: '2024-02-01',
  },
]

export function formatCurrency(amount: number, currency = 'BDT'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((category) => category.id === id)
}

export function getMonthlyData(transactions: Transaction[]) {
  const monthlyData: Record<string, { income: number; expense: number }> = {}
  
  transactions.forEach(t => {
    const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 }
    }
    if (t.type === 'income') {
      monthlyData[month].income += t.amount
    } else {
      monthlyData[month].expense += t.amount
    }
  })
  
  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    ...data,
  }))
}

export function getCategoryBreakdown(transactions: Transaction[], type: TransactionType, categories: Category[]) {
  const breakdown: Record<string, number> = {}
  
  transactions
    .filter(t => t.type === type)
    .forEach(t => {
      const category = categories.find(c => c.id === t.categoryId)
      const name = category?.name || 'Other'
      breakdown[name] = (breakdown[name] || 0) + t.amount
    })
  
  return Object.entries(breakdown).map(([name, value]) => ({
    name,
    value,
    fill: categories.find(c => c.name === name)?.color.replace('bg-', 'hsl(var(--chart-') || 'hsl(var(--chart-1))'
  }))
}

// Budget utilities
export function calculateSpentInBudget(transactions: Transaction[], budget: Budget): number {
  return transactions
    .filter(t => {
      const transDate = new Date(t.date)
      return (
        t.type === 'expense' &&
        t.categoryId === budget.categoryId &&
        transDate.getMonth() === budget.month &&
        transDate.getFullYear() === budget.year
      )
    })
    .reduce((sum, t) => sum + t.amount, 0)
}

export function getBudgetProgress(spent: number, limit: number): number {
  return Math.min((spent / limit) * 100, 100)
}

export function getBudgetStatus(spent: number, limit: number): 'ok' | 'warning' | 'exceeded' {
  const progress = getBudgetProgress(spent, limit)
  if (progress >= 100) return 'exceeded'
  if (progress >= 80) return 'warning'
  return 'ok'
}

// Goal utilities (category + date range based)
export function getGoalCurrentAmount(goal: Goal, transactions: Transaction[]): number {
  const start = new Date(goal.startDate)
  const end = new Date(goal.endDate)

  const scoped = transactions.filter((t) => {
    const date = new Date(t.date)
    return t.categoryId === goal.categoryId && date >= start && date <= end
  })

  if (goal.goalType === 'limit') {
    return scoped.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  }

  if (goal.goalType === 'earn') {
    return scoped.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  }

  const income = scoped.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const expense = scoped.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  return Math.max(0, income - expense)
}

export function getGoalProgress(current: number, target: number): number {
  if (target <= 0) return 0
  return Math.max(0, Math.min((current / target) * 100, 100))
}

export function getGoalStatus(
  goal: Goal,
  currentAmount: number,
): 'on-track' | 'near-limit' | 'exceeded' | 'completed' {
  if (goal.goalType === 'limit') {
    const usage = getGoalProgress(currentAmount, goal.targetAmount)
    if (usage > 100) return 'exceeded'
    if (usage >= 80) return 'near-limit'
    return 'on-track'
  }

  if (currentAmount >= goal.targetAmount || goal.completedAt) {
    return 'completed'
  }

  return 'on-track'
}
