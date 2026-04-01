"use client"

import React, { createContext, useContext, useState, useMemo } from "react"
import { startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears, isWithinInterval, format } from "date-fns"

type PeriodType = "monthly" | "yearly" | "custom"

interface DateRange {
  from: Date
  to: Date
}

interface PeriodContextType {
  periodType: PeriodType
  setPeriodType: (type: PeriodType) => void
  customRange: DateRange | null
  setCustomRange: (range: DateRange | null) => void
  getDateRange: () => DateRange
  getPreviousRange: () => DateRange
  isInRange: (date: string | Date) => boolean
  getRangeLabel: () => string
  resetToDefault: () => void
}

const PeriodContext = createContext<PeriodContextType | undefined>(undefined)

export function PeriodProvider({ children }: { children: React.ReactNode }) {
  const [periodType, setPeriodType] = useState<PeriodType>("monthly")
  const [customRange, setCustomRange] = useState<DateRange | null>(null)

  const getDateRange = (): DateRange => {
    const now = new Date()
    
    if (periodType === "custom" && customRange) {
      return customRange
    }
    
    if (periodType === "yearly") {
      return {
        from: startOfYear(now),
        to: endOfYear(now),
      }
    }
    
    // Default: monthly
    return {
      from: startOfMonth(now),
      to: endOfMonth(now),
    }
  }

  const getPreviousRange = (): DateRange => {
    const currentRange = getDateRange()
    
    if (periodType === "custom" && customRange) {
      // For custom range, get the same duration prior
      const duration = customRange.to.getTime() - customRange.from.getTime()
      return {
        from: new Date(customRange.from.getTime() - duration - 1),
        to: new Date(customRange.from.getTime() - 1),
      }
    }
    
    if (periodType === "yearly") {
      const lastYear = subYears(new Date(), 1)
      return {
        from: startOfYear(lastYear),
        to: endOfYear(lastYear),
      }
    }
    
    // Default: previous month
    const lastMonth = subMonths(new Date(), 1)
    return {
      from: startOfMonth(lastMonth),
      to: endOfMonth(lastMonth),
    }
  }

  const isInRange = (date: string | Date): boolean => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    const range = getDateRange()
    return isWithinInterval(dateObj, { start: range.from, end: range.to })
  }

  const getRangeLabel = (): string => {
    if (periodType === "custom" && customRange) {
      const sameYear = customRange.from.getFullYear() === customRange.to.getFullYear()
      const sameMonth = sameYear && customRange.from.getMonth() === customRange.to.getMonth()
      
      if (sameMonth) {
        return format(customRange.from, "MMMM yyyy")
      }
      if (sameYear) {
        return `${format(customRange.from, "MMM")} - ${format(customRange.to, "MMM yyyy")}`
      }
      return `${format(customRange.from, "MMM yyyy")} - ${format(customRange.to, "MMM yyyy")}`
    }
    
    if (periodType === "yearly") {
      return format(new Date(), "yyyy")
    }
    
    return format(new Date(), "MMMM yyyy")
  }

  const resetToDefault = () => {
    setPeriodType("monthly")
    setCustomRange(null)
  }

  const value = useMemo(() => ({
    periodType,
    setPeriodType,
    customRange,
    setCustomRange,
    getDateRange,
    getPreviousRange,
    isInRange,
    getRangeLabel,
    resetToDefault,
  }), [periodType, customRange])

  return (
    <PeriodContext.Provider value={value}>
      {children}
    </PeriodContext.Provider>
  )
}

export function usePeriod() {
  const context = useContext(PeriodContext)
  if (context === undefined) {
    throw new Error("usePeriod must be used within a PeriodProvider")
  }
  return context
}
