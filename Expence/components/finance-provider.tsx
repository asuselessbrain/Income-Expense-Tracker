"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { Transaction, Category, Budget, Goal, sampleTransactions, defaultCategories, sampleBudgets, sampleGoals } from "@/lib/finance-data"

interface FinanceContextType {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  deleteTransaction: (id: string) => void
  currency: string
  setCurrency: (currency: string) => void
  categories: Category[]
  addCategory: (category: Omit<Category, "id">) => void
  updateCategory: (id: string, updates: Partial<Omit<Category, "id">>) => void
  deleteCategory: (id: string) => void
  getCategoryById: (id: string) => Category | undefined
  budgets: Budget[]
  addBudget: (budget: Omit<Budget, "id" | "createdAt">) => void
  updateBudget: (id: string, updates: Partial<Omit<Budget, "id" | "createdAt">>) => void
  deleteBudget: (id: string) => void
  goals: Goal[]
  addGoal: (goal: Omit<Goal, "id" | "createdAt">) => void
  updateGoal: (id: string, updates: Partial<Omit<Goal, "id" | "createdAt">>) => void
  deleteGoal: (id: string) => void
  completeGoal: (id: string) => void
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions)
  const [currency, setCurrency] = useState("BDT")
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [budgets, setBudgets] = useState<Budget[]>(sampleBudgets)
  const [goals, setGoals] = useState<Goal[]>(sampleGoals)

  const addTransaction = useCallback((transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    setTransactions((prev) => [newTransaction, ...prev])
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addCategory = useCallback((category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: `custom-${Date.now()}`,
    }
    setCategories((prev) => [...prev, newCategory])
  }, [])

  const updateCategory = useCallback((id: string, updates: Partial<Omit<Category, "id">>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    )
  }, [])

  const deleteCategory = useCallback((id: string) => {
    // Don't allow deleting if transactions use this category
    const hasTransactions = transactions.some((t) => t.categoryId === id)
    if (hasTransactions) {
      return false
    }
    setCategories((prev) => prev.filter((cat) => cat.id !== id))
    return true
  }, [transactions])

  const getCategoryById = useCallback((id: string) => {
    return categories.find((c) => c.id === id)
  }, [categories])

  // Budget methods
  const addBudget = useCallback((budget: Omit<Budget, "id" | "createdAt">) => {
    const newBudget: Budget = {
      ...budget,
      id: `budget-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setBudgets((prev) => [...prev, newBudget])
  }, [])

  const updateBudget = useCallback((id: string, updates: Partial<Omit<Budget, "id" | "createdAt">>) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    )
  }, [])

  const deleteBudget = useCallback((id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id))
  }, [])

  // Goal methods
  const addGoal = useCallback((goal: Omit<Goal, "id" | "createdAt">) => {
    const newGoal: Goal = {
      ...goal,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setGoals((prev) => [...prev, newGoal])
  }, [])

  const updateGoal = useCallback((id: string, updates: Partial<Omit<Goal, "id" | "createdAt">>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    )
  }, [])

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }, [])

  const completeGoal = useCallback((id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completedAt: new Date().toISOString() } : g))
    )
  }, [])

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        currency,
        setCurrency,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
        budgets,
        addBudget,
        updateBudget,
        deleteBudget,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        completeGoal,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider")
  }
  return context
}
