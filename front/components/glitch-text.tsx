"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface GlitchTextProps {
  text: string
  className?: string
}

export function GlitchText({ text, className }: GlitchTextProps) {
  const [glitchText, setGlitchText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"

    const startGlitch = () => {
      setIsGlitching(true)
      let iterations = 0

      const interval = setInterval(() => {
        setGlitchText(
          text
            .split("")
            .map((char, index) => {
              if (index < iterations) {
                return text[index]
              }
              return glitchChars[Math.floor(Math.random() * glitchChars.length)]
            })
            .join(""),
        )

        if (iterations >= text.length) {
          clearInterval(interval)
          setGlitchText(text)
          setIsGlitching(false)
        }

        iterations += 1 / 3
      }, 30)
    }

    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.05) {
        // 5% chance to glitch (reduced frequency)
        startGlitch()
      }
    }, 3000)

    return () => {
      clearInterval(glitchInterval)
    }
  }, [text])

  return (
    <span
      className={cn("relative inline-block", isGlitching && "animate-pulse", className)}
      style={{
        textShadow: isGlitching ? "0.05em 0 0 #00ffff, -0.03em -0.04em 0 #ff00ff, 0.025em 0.04em 0 #ffff00" : "none",
      }}
    >
      {glitchText}
    </span>
  )
}
