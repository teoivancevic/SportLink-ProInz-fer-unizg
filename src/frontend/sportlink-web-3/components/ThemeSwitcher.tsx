import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex w-full items-center gap-2 px-2 py-1.5">
      <span className="text-sm text-muted-foreground">Theme:</span>
      <div className="flex gap-1">
        <Button
          variant={theme === 'light' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTheme('light')}
          className="h-8 w-8"
        >
          <Sun className="h-4 w-4" />
          <span className="sr-only">Light Theme</span>
        </Button>
        <Button
          variant={theme === 'dark' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTheme('dark')}
          className="h-8 w-8"
        >
          <Moon className="h-4 w-4" />
          <span className="sr-only">Dark Theme</span>
        </Button>
        <Button
          variant={theme === 'system' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTheme('system')}
          className="h-8 w-8"
        >
          <Laptop className="h-4 w-4" />
          <span className="sr-only">System Theme</span>
        </Button>
      </div>
    </div>
  )
}