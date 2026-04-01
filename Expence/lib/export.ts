import { Transaction, Category, formatCurrency, formatDate } from "@/lib/finance-data"

/**
 * Convert transactions to CSV format and download
 */
export function exportTransactionsToCSV(
  transactions: Transaction[],
  categories: Category[],
  filename = "transactions.csv"
) {
  // Create CSV headers
  const headers = ["Date", "Type", "Category", "Amount", "Note"]

  // Create CSV rows
  const rows = transactions.map((t) => {
    const category = categories.find((c) => c.id === t.categoryId)
    return [
      formatDate(t.date),
      t.type,
      category?.name || "Unknown",
      t.amount,
      t.note || "",
    ]
  })

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma
          const cellStr = String(cell)
          if (cellStr.includes(",") || cellStr.includes('"')) {
            return `"${cellStr.replace(/"/g, '""')}"`
          }
          return cellStr
        })
        .join(",")
    ),
  ].join("\n")

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * Export transactions filtered by date range
 */
export function exportTransactionsByDateRange(
  transactions: Transaction[],
  categories: Category[],
  startDate: Date,
  endDate: Date
) {
  const filtered = transactions.filter((t) => {
    const date = new Date(t.date)
    return date >= startDate && date <= endDate
  })

  const filename = `transactions_${startDate.toISOString().split("T")[0]}_${endDate.toISOString().split("T")[0]}.csv`
  exportTransactionsToCSV(filtered, categories, filename)
}

/**
 * Export summary statistics
 */
export function exportSummaryToCSV(
  transactions: Transaction[],
  categories: Category[],
  filename = "summary.csv"
) {
  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  // Category breakdown
  const categoryData: Record<string, { income: number; expense: number }> = {}

  transactions.forEach((t) => {
    const category = categories.find((c) => c.id === t.categoryId)
    const categoryName = category?.name || "Unknown"

    if (!categoryData[categoryName]) {
      categoryData[categoryName] = { income: 0, expense: 0 }
    }

    if (t.type === "income") {
      categoryData[categoryName].income += t.amount
    } else {
      categoryData[categoryName].expense += t.amount
    }
  })

  // Create CSV content
  const lines = [
    "Financial Summary Report",
    "",
    "Overall Summary,Amount",
    `Total Income,${totalIncome.toFixed(2)}`,
    `Total Expense,${totalExpense.toFixed(2)}`,
    `Balance,${balance.toFixed(2)}`,
    "",
    "Category Breakdown,Income,Expense",
    ...Object.entries(categoryData).map(
      ([name, data]) =>
        `${name},${data.income.toFixed(2)},${data.expense.toFixed(2)}`
    ),
  ]

  const csvContent = lines.join("\n")

  // Download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
