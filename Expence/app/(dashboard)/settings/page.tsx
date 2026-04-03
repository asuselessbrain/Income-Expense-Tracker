"use client"

import { useState } from "react"
import { useTheme } from "@/components/theme-provider"
import { useFinance } from "@/components/finance-provider"
import { CategoryManager } from "@/components/category-manager"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sun,
  Moon,
  Monitor,
  User,
  DollarSign,
  Tags,
  Check,
  Download,
} from "lucide-react"
import { exportTransactionsToCSV, exportSummaryToCSV } from "@/lib/export"

const currencies = [
  { code: "BDT", name: "Bangladeshi Taka", symbol: "Tk" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
]

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { currency, setCurrency, transactions, categories } = useFinance()
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
  })

  const handleExportTransactions = () => {
    exportTransactionsToCSV(transactions, categories, `transactions_${new Date().toISOString().split("T")[0]}.csv`)
  }

  const handleExportSummary = () => {
    exportSummaryToCSV(transactions, categories, `summary_${new Date().toISOString().split("T")[0]}.csv`)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your preferences and account
        </p>
      </header>

      {/* Profile Section */}
      <Card className="glass border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="" />
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card className="glass border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Sun className="h-4 w-4" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select your preferred theme
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
                { value: "system", label: "System", icon: Monitor },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                    theme === option.value
                      ? "bg-primary/10 ring-2 ring-primary"
                      : "bg-secondary/50 hover:bg-secondary"
                  }`}
                >
                  <option.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{option.label}</span>
                  {theme === option.value && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Section */}
      <Card className="glass border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Currency
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <Label>Default Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    <span className="flex items-center gap-2">
                      <span className="font-mono">{curr.symbol}</span>
                      <span>
                        {curr.name} ({curr.code})
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Categories Section - Now with full CRUD */}
      <Card className="glass border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Tags className="h-4 w-4" />
            Manage Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <CategoryManager />
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="glass border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Export Transactions</p>
                <p className="text-xs text-muted-foreground">
                  Download all transactions as CSV
                </p>
              </div>
              <Button 
                variant="secondary" 
                className="rounded-xl"
                onClick={handleExportTransactions}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-sm font-medium">Export Summary</p>
                <p className="text-xs text-muted-foreground">
                  Download financial summary with category breakdown
                </p>
              </div>
              <Button 
                variant="secondary" 
                className="rounded-xl"
                onClick={handleExportSummary}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Summary
              </Button>
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-sm font-medium text-destructive">
                  Reset Data
                </p>
                <p className="text-xs text-muted-foreground">
                  Delete all transactions
                </p>
              </div>
              <Button variant="destructive" className="rounded-xl">
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="glass border-0">
        <CardContent className="p-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>FinTrack v1.0.0</p>
            <p className="mt-1">Built with Next.js, Tailwind CSS & shadcn/ui</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
