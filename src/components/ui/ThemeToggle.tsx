'use client'

import { useTheme } from '@/context/themeContext'
import { Moon, Sun } from 'lucide-react'
import { Button } from './button'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      className="w-20 relative h-10 bg-accent transition-colors duration-300 rounded-full"
      aria-label={isLight ? 'Activar modo oscuro' : 'Activar modo claro'}
    >
      <div className="absolute inset-0 flex items-center px-1">
        <div 
          className={`
            relative w-full h-8 rounded-full 
            bg-background-primary
            transition-colors duration-300
          `}
        >
          <div className={`
            absolute top-1 h-6 w-6 rounded-full
            transform transition-all duration-300 ease-in-out
            flex items-center justify-center
            ${isLight ? 'left-1 bg-accent' : 'left-[calc(100%-1.75rem)] bg-accent'}
          `}>
            {isLight ? (
              <Sun className="h-4 w-4 text-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-foreground" />
            )}
          </div>
        </div>
      </div>
    </Button>
  )
}
