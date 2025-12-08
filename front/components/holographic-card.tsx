"use client"

import type React from "react"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface HolographicCardProps {
  children: React.ReactNode
  className?: string
}

export function HolographicCard({ children, className }: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setMousePosition({ x, y })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setMousePosition({ x: 0, y: 0 })
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-xl transition-all duration-300",
        "before:absolute before:inset-0 before:rounded-xl before:p-[1px]",
        "before:bg-gradient-to-r before:from-purple-500/50 before:via-cyan-500/50 before:to-purple-500/50",
        "before:opacity-0 before:transition-opacity before:duration-300",
        isHovered && "before:opacity-100",
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: isHovered
          ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`
          : undefined,
      }}
    >
      <div className="relative z-10 h-full w-full rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {children}
      </div>

      {/* Holographic shine effect */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300",
          "bg-gradient-to-r from-transparent via-white/20 to-transparent",
          "transform -skew-x-12 translate-x-[-100%]",
          isHovered && "opacity-100 animate-[shimmer_1.5s_ease-in-out]",
        )}
        style={{
          transform: isHovered
            ? `translateX(${(mousePosition.x / (cardRef.current?.offsetWidth || 1)) * 200 - 100}%) skewX(-12deg)`
            : "translateX(-100%) skewX(-12deg)",
        }}
      />
    </div>
  )
}
