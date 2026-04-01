import { useToast } from "@/components/ui/use-toast"

export function useNotifications() {
  const { toast } = useToast()

  const notifySuccess = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
    })
  }

  const notifyError = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    })
  }

  const notifyWarning = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
    })
  }

  const notifyInfo = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
    })
  }

  const notifyTransactionAdded = (amount: string, category: string) => {
    notifySuccess("Transaction Added", `${category} - ${amount}`)
  }

  const notifyBudgetExceeded = (category: string) => {
    notifyWarning("Budget Exceeded", `${category} budget has been exceeded!`)
  }

  const notifyGoalCompleted = (goalTitle: string) => {
    notifySuccess("🎉 Goal Completed!", `Congratulations on reaching "${goalTitle}"!`)
  }

  const notifyGoalNearCompletion = (goalTitle: string, percentage: number) => {
    notifyInfo("Goal Progress", `${goalTitle} is ${percentage}% complete!`)
  }

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifyTransactionAdded,
    notifyBudgetExceeded,
    notifyGoalCompleted,
    notifyGoalNearCompletion,
  }
}
