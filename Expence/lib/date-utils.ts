/**
 * Date utility functions for financial calculations
 */

export function getMonthStart(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function getMonthEnd(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export function getYearStart(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), 0, 1)
}

export function getYearEnd(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), 11, 31)
}

export function getPreviousMonthStart(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1)
}

export function getPreviousMonthEnd(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 0)
}

export function getPreviousYearStart(date: Date = new Date()): Date {
  return new Date(date.getFullYear() - 1, 0, 1)
}

export function getPreviousYearEnd(date: Date = new Date()): Date {
  return new Date(date.getFullYear() - 1, 11, 31)
}

export function getMonthsBetween(startDate: Date, endDate: Date): number {
  return (
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth())
  )
}

export function isSamMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  )
}

export function isSameYear(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear()
}

export function getDaysInMonth(date: Date = new Date()): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export function getMonthName(date: Date = new Date()): string {
  return date.toLocaleString("en-US", { month: "long" })
}

export function getYear(date: Date = new Date()): number {
  return date.getFullYear()
}
