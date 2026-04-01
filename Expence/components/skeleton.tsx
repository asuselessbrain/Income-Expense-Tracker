import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-muted",
        className
      )}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-xl p-6 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="glass rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="h-[300px] flex items-end gap-2 pt-8">
        {[40, 65, 45, 80, 55, 70, 50, 85, 60, 75, 45, 90].map((height, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-lg"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export function TransactionSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="hidden md:block h-10 w-36 rounded-xl" />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      <div className="glass rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="space-y-2">
          <TransactionSkeleton />
          <TransactionSkeleton />
          <TransactionSkeleton />
          <TransactionSkeleton />
          <TransactionSkeleton />
        </div>
      </div>
    </div>
  )
}
