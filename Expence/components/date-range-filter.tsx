"use client"

import { useState } from "react"
import { usePeriod } from "@/components/period-provider"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, X, ChevronDown } from "lucide-react"
import type { DateRange } from "react-day-picker"

export function DateRangeFilter() {
  const { periodType, setPeriodType, customRange, setCustomRange, getRangeLabel, resetToDefault } = usePeriod()
  const [isOpen, setIsOpen] = useState(false)
  const [tempRange, setTempRange] = useState<DateRange | undefined>(
    customRange ? { from: customRange.from, to: customRange.to } : undefined
  )

  const handlePeriodChange = (value: string) => {
    if (value === "custom") {
      setPeriodType("custom")
      setIsOpen(true)
    } else {
      setPeriodType(value as "monthly" | "yearly")
      setCustomRange(null)
    }
  }

  const handleApplyRange = () => {
    if (tempRange?.from && tempRange?.to) {
      setCustomRange({ from: tempRange.from, to: tempRange.to })
      setIsOpen(false)
    }
  }

  const handleReset = () => {
    resetToDefault()
    setTempRange(undefined)
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Tabs
        value={periodType}
        onValueChange={handlePeriodChange}
      >
        <TabsList className="h-9 rounded-xl">
          <TabsTrigger value="monthly" className="text-xs px-4 rounded-lg">
            Monthly
          </TabsTrigger>
          <TabsTrigger value="yearly" className="text-xs px-4 rounded-lg">
            Yearly
          </TabsTrigger>
          <TabsTrigger value="custom" className="text-xs px-4 rounded-lg">
            Custom
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {periodType === "custom" && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal rounded-xl h-9 gap-2",
                !customRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {customRange ? (
                <span className="text-xs">
                  {format(customRange.from, "MMM d, yyyy")} - {format(customRange.to, "MMM d, yyyy")}
                </span>
              ) : (
                <span className="text-xs">Select date range</span>
              )}
              <ChevronDown className="h-3 w-3 ml-auto opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4 space-y-4">
              <div className="text-sm font-medium">Select Date Range</div>
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={tempRange?.from}
                selected={tempRange}
                onSelect={setTempRange}
                numberOfMonths={2}
                className="rounded-xl"
              />
              <div className="flex items-center justify-between border-t pt-4">
                <div className="text-xs text-muted-foreground">
                  {tempRange?.from && tempRange?.to ? (
                    <>
                      {format(tempRange.from, "MMM d, yyyy")} - {format(tempRange.to, "MMM d, yyyy")}
                    </>
                  ) : (
                    "Select start and end dates"
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleApplyRange}
                    disabled={!tempRange?.from || !tempRange?.to}
                    className="rounded-lg"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Range indicator badge */}
      <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg">
        <span>{getRangeLabel()}</span>
        {(periodType !== "monthly" || customRange) && (
          <button
            onClick={handleReset}
            className="hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  )
}
