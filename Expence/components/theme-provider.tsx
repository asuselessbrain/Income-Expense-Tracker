'use client'

import * as React from 'react'

type Theme = 'light' | 'dark' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  attribute?: 'class'
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyThemeClass(nextTheme: Theme) {
  const root = document.documentElement
  const resolved = nextTheme === 'system' ? getSystemTheme() : nextTheme
  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  attribute = 'class',
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<'light' | 'dark'>('light')

  React.useEffect(() => {
    if (attribute !== 'class') return

    const storedTheme = window.localStorage.getItem('theme') as Theme | null
    const initialTheme = storedTheme ?? defaultTheme
    const safeTheme = !enableSystem && initialTheme === 'system' ? 'light' : initialTheme

    setThemeState(safeTheme)
    const currentResolved = safeTheme === 'system' ? getSystemTheme() : safeTheme
    setResolvedTheme(currentResolved)
    applyThemeClass(safeTheme)
  }, [attribute, defaultTheme, enableSystem])

  React.useEffect(() => {
    if (!enableSystem || theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      const currentResolved = getSystemTheme()
      setResolvedTheme(currentResolved)
      applyThemeClass('system')
    }

    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [enableSystem, theme])

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      const safeTheme = !enableSystem && nextTheme === 'system' ? 'light' : nextTheme
      setThemeState(safeTheme)
      window.localStorage.setItem('theme', safeTheme)
      const currentResolved = safeTheme === 'system' ? getSystemTheme() : safeTheme
      setResolvedTheme(currentResolved)
      applyThemeClass(safeTheme)
    },
    [enableSystem]
  )

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [resolvedTheme, setTheme, theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
