"use client"

import { cn } from "@/lib/utils"
import {
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  Plus,
  Utensils,
  Car,
  ShoppingBag,
  Film,
  Receipt,
  Heart,
  GraduationCap,
  Plane,
  MoreHorizontal,
  Circle,
  Home,
  Wifi,
  Phone,
  Music,
  Book,
  Camera,
  Coffee,
  Gamepad2,
  Dumbbell,
  Shirt,
  Baby,
  Dog,
  Leaf,
  Wrench,
  Banknote,
  CreditCard,
  PiggyBank,
  Wallet,
  type LucideIcon,
} from "lucide-react"

export const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  Plus,
  Utensils,
  Car,
  ShoppingBag,
  Film,
  Receipt,
  Heart,
  GraduationCap,
  Plane,
  MoreHorizontal,
  Circle,
  Home,
  Wifi,
  Phone,
  Music,
  Book,
  Camera,
  Coffee,
  Gamepad2,
  Dumbbell,
  Shirt,
  Baby,
  Dog,
  Leaf,
  Wrench,
  Banknote,
  CreditCard,
  PiggyBank,
  Wallet,
}

interface CategoryIconProps {
  icon: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function CategoryIcon({
  icon,
  className,
  size = "md",
}: CategoryIconProps) {
  const Icon = iconMap[icon] || Circle

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl",
        sizeClasses[size],
        className
      )}
    >
      <Icon className={cn("text-white", iconSizes[size])} />
    </div>
  )
}

// Export a simple icon renderer for icon picker
export function IconRenderer({ icon, className }: { icon: string; className?: string }) {
  const Icon = iconMap[icon] || Circle
  return <Icon className={cn("h-5 w-5", className)} />
}
