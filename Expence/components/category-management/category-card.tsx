"use client"

import { Category } from "@/lib/finance-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2 } from "lucide-react"
import { CategoryIcon } from "@/components/category-icon"

interface CategoryCardProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
  isDefault?: boolean
}

export function CategoryCard({
  category,
  onEdit,
  onDelete,
  isDefault = false,
}: CategoryCardProps) {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow relative">
      <div className="flex flex-col items-center text-center gap-3">
        <CategoryIcon icon={category.icon} size="md" className={category.color} />
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{category.name}</h3>
          <p className="text-xs text-muted-foreground capitalize">
            {category.type}
          </p>
        </div>
        <div className="flex gap-2 w-full justify-center">
          {!isDefault && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(category)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(category.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
          {isDefault && (
            <span className="text-xs bg-secondary/50 text-muted-foreground px-2 py-1 rounded">
              Default
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}
