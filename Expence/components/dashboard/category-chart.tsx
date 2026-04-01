"use client"

import { useMemo } from "react"
import { useFinance } from "@/components/finance-provider"
import { getCategoryById } from "@/lib/finance-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = [
  "hsl(160, 70%, 45%)",
  "hsl(0, 75%, 55%)",
  "hsl(220, 70%, 55%)",
  "hsl(45, 90%, 50%)",
  "hsl(280, 65%, 55%)",
]

export function CategoryChart() {
  const { transactions } = useFinance()

  const data = useMemo(() => {
    const expensesByCategory: Record<string, number> = {}
    
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const category = getCategoryById(t.categoryId)
        const name = category?.name || "Other"
        expensesByCategory[name] = (expensesByCategory[name] || 0) + t.amount
      })

    return Object.entries(expensesByCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [transactions])

  const isEmpty = data.length === 0

  return (
    <Card className="glass border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Expenses by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="h-75 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">No expenses yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Add expenses to see the breakdown</p>
            </div>
          </div>
        ) : (
          <div className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
                    padding: "12px",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ fontSize: "13px", lineHeight: "1.8" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
