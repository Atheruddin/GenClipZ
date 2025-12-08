"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 border border-purple-300 dark:border-purple-500/30 bg-purple-100 dark:bg-purple-500/10 backdrop-blur-sm"
      >
        <Sun className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  const handleToggle = () => {
    // Add a small delay to ensure smooth transition
    document.documentElement.style.transition = "none"
    setTheme(isDark ? "light" : "dark")

    // Re-enable transitions after theme change
    setTimeout(() => {
      document.documentElement.style.transition = ""
    }, 50)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="w-10 h-10 relative overflow-hidden transition-all duration-700 border border-purple-300 dark:border-purple-500/30 bg-purple-100 dark:bg-purple-500/10 hover:bg-purple-200 dark:hover:bg-purple-500/20 backdrop-blur-sm group hover-lift"
    >
      {/* Morphing background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/30 via-orange-300/30 to-red-300/30 dark:from-blue-600/30 dark:via-purple-600/30 dark:to-indigo-600/30 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-md transform group-hover:scale-110"></div>

      {/* Sun icon with rays - positioned in center */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
          isDark ? "rotate-180 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      >
        <div className="relative">
          <Sun className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />

          {/* Animated sun rays */}
          <div className="absolute inset-0 opacity-60">
            <div className="absolute w-0.5 h-1.5 bg-yellow-500 rounded-full -top-3 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
            <div
              className="absolute w-0.5 h-1.5 bg-yellow-500 rounded-full -bottom-3 left-1/2 transform -translate-x-1/2 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute w-1.5 h-0.5 bg-yellow-500 rounded-full -left-3 top-1/2 transform -translate-y-1/2 animate-pulse"
              style={{ animationDelay: "0.25s" }}
            ></div>
            <div
              className="absolute w-1.5 h-0.5 bg-yellow-500 rounded-full -right-3 top-1/2 transform -translate-y-1/2 animate-pulse"
              style={{ animationDelay: "0.75s" }}
            ></div>

            {/* Diagonal rays */}
            <div
              className="absolute w-0.5 h-1 bg-yellow-500 rounded-full -top-2 -left-2 transform rotate-45 animate-pulse"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="absolute w-0.5 h-1 bg-yellow-500 rounded-full -top-2 -right-2 transform -rotate-45 animate-pulse"
              style={{ animationDelay: "0.6s" }}
            ></div>
            <div
              className="absolute w-0.5 h-1 bg-yellow-500 rounded-full -bottom-2 -left-2 transform -rotate-45 animate-pulse"
              style={{ animationDelay: "0.35s" }}
            ></div>
            <div
              className="absolute w-0.5 h-1 bg-yellow-500 rounded-full -bottom-2 -right-2 transform rotate-45 animate-pulse"
              style={{ animationDelay: "0.85s" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Moon icon with stars - positioned in center */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-180 scale-0 opacity-0"
        }`}
      >
        <div className="relative">
          <Moon className="h-5 w-5 text-blue-400 dark:text-blue-300" />

          {/* Twinkling stars */}
          <div className="absolute inset-0 opacity-80">
            <div
              className="absolute w-1 h-1 bg-blue-300 rounded-full -top-2 -left-2 animate-ping"
              style={{ animationDuration: "2s" }}
            ></div>
            <div
              className="absolute w-0.5 h-0.5 bg-purple-300 rounded-full -top-1 -right-2 animate-ping"
              style={{ animationDuration: "3s", animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute w-1 h-1 bg-indigo-300 rounded-full -bottom-2 -right-1 animate-ping"
              style={{ animationDuration: "2.5s", animationDelay: "1s" }}
            ></div>
            <div
              className="absolute w-0.5 h-0.5 bg-cyan-300 rounded-full -bottom-1 -left-2 animate-ping"
              style={{ animationDuration: "2.8s", animationDelay: "1.5s" }}
            ></div>
            <div
              className="absolute w-0.5 h-0.5 bg-white rounded-full top-0 right-0 animate-ping"
              style={{ animationDuration: "2.2s", animationDelay: "0.8s" }}
            ></div>
          </div>

          {/* Crescent glow */}
          <div
            className="absolute inset-0 bg-blue-400/20 rounded-full blur-sm animate-pulse"
            style={{ animationDuration: "4s" }}
          ></div>
        </div>
      </div>

      {/* Click ripple effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 group-active:opacity-100 group-active:animate-ping rounded-md transition-all duration-300"></div>

      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
