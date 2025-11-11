'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only render after component mounts on client
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(id)
  }, [])

  if (!mounted) {
    return null // Don't render anything on server
  }

  const themeLabels: Record<string, string> = {
    light: '☀️ Light',
    dark: '🌙 Dark',
    productivity: '⚡ Productivity',
    calm: '🧘 Calm',
  }

  return (
    <div className="flex gap-2 p-4 flex-wrap">
      {themes.map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`px-4 py-2 rounded-lg transition-all font-medium ${
            theme === t
              ? 'bg-primary text-white shadow-lg'
              : 'bg-surface hover:bg-surface-hover text-text-primary border border-border'
          }`}
        >
          {themeLabels[t] || t}
        </button>
      ))}
    </div>
  )
}