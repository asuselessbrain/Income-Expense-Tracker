"use client"

import { useCallback, useSyncExternalStore } from "react"

export type ToastType = "success" | "error" | "info" | "warning"

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
}

// Simple external store for toasts
let toasts: Toast[] = []
let listeners: Set<() => void> = new Set()

function emitChange() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return toasts
}

function addToast(toast: Omit<Toast, "id">) {
  const id = Math.random().toString(36).substring(2, 9)
  toasts = [...toasts, { ...toast, id }]
  emitChange()

  // Auto remove after 4 seconds
  setTimeout(() => {
    removeToast(id)
  }, 4000)
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id)
  emitChange()
}

export function useToastStore() {
  const currentToasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return {
    toasts: currentToasts,
    removeToast,
  }
}

export function useAppToast() {
  const toast = useCallback((toast: Omit<Toast, "id">) => addToast(toast), [])
  const dismiss = useCallback((id: string) => removeToast(id), [])
  const success = useCallback((title: string, description?: string) => 
    addToast({ type: "success", title, description }), [])
  const error = useCallback((title: string, description?: string) => 
    addToast({ type: "error", title, description }), [])
  const info = useCallback((title: string, description?: string) => 
    addToast({ type: "info", title, description }), [])
  const warning = useCallback((title: string, description?: string) => 
    addToast({ type: "warning", title, description }), [])

  return { toast, dismiss, success, error, info, warning }
}
