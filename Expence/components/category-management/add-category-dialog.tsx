"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { CategoryForm } from "@/components/category-management/category-form"

export function AddCategoryDialog() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-xl shadow-lg shadow-primary/25">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <CategoryForm />
      </DialogContent>
    </Dialog>
  )
}
