"use client"

import { useEffect, useRef } from "react"

interface Point {
  x: number
  y: number
  timestamp: number
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointsRef = useRef<Point[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      })

      // Keep trail for 400ms - nice balance
      const now = Date.now()
      pointsRef.current = pointsRef.current.filter((point) => now - point.timestamp < 400)
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const points = pointsRef.current
      if (points.length < 2) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      const now = Date.now()

      // Draw trail with balanced visibility
      for (let i = 1; i < points.length; i++) {
        const point = points[i]
        const prevPoint = points[i - 1]
        const age = now - point.timestamp
        const opacity = Math.max(0, 1 - age / 400)

        if (opacity <= 0) continue

        ctx.beginPath()
        ctx.moveTo(prevPoint.x, prevPoint.y)
        ctx.lineTo(point.x, point.y)

        // Balanced gradient - visible but not overwhelming
        const gradient = ctx.createLinearGradient(prevPoint.x, prevPoint.y, point.x, point.y)
        gradient.addColorStop(0, `rgba(147, 51, 234, ${opacity * 0.15})`) // Increased visibility
        gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity * 0.25})`) // Increased visibility

        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.5 // Slightly thicker for visibility
        ctx.lineCap = "round"
        ctx.stroke()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handleMouseMove)
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: "normal" }} // Back to normal for better visibility
    />
  )
}
