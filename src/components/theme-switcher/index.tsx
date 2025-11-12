'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(id)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center gap-2 px-4 py-2 rounded-[--radius-apple-md] bg-surface hover:bg-surface-hover 
                 border border-border text-text-primary transition-all shadow-md"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-5 h-5" />
          <span className="font-medium">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-5 h-5" />
          <span className="font-medium">Dark</span>
        </>
      )}
    </button>
  )
}