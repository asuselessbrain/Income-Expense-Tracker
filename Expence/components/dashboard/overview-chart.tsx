"use client"

import { useMemo } from "react"
import { useFinance } from "@/components/finance-provider"
import { usePeriod } from "@/components/period-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export function OverviewChart() {
  const { transactions } = useFinance()
  const { period } = usePeriod()

  const data = useMemo(() => {
    const grouped: Record<string, { income: number; expense: number }> = {}
    
    transactions.forEach((t) => {
      const date = new Date(t.date)
      const key = period === "monthly"
        ? date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
        : date.getFullYear().toString()
      
      if (!grouped[key]) {
        grouped[key] = { income: 0, expense: 0 }
      }
      if (t.type === "income") {
        grouped[key].income += t.amount
      } else {
        grouped[key].expense += t.amount
      }
    })

    return Object.entries(grouped).map(([name, data]) => ({
      name,
      ...data,
    }))
  }, [transactions, period])

  const isEmpty = data.length === 0

  return (
    <Card className="glass border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Overview</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isEmpty ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">No data available</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Add transactions to see the chart</p>
            </div>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barGap={8}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
                    padding: "12px",
                  }}
                  labelStyle={{ fontWeight: 600, marginBottom: "4px" }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="hsl(145, 80%, 45%)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="hsl(0, 75%, 55%)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
