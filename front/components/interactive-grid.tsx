"use client"

import { useEffect, useRef, useState } from "react"

export function InteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
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
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gridSize = 50
      const maxDistance = 150

      // Draw grid lines
      ctx.strokeStyle = "rgba(147, 51, 234, 0.1)"
      ctx.lineWidth = 1

      for (let x = 0; x <= canvas.width; x += gridSize) {
        for (let y = 0; y <= canvas.height; y += gridSize) {
          const distance = Math.sqrt(Math.pow(mousePos.x - x, 2) + Math.pow(mousePos.y - y, 2))

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance
            ctx.strokeStyle = `rgba(147, 51, 234, ${opacity * 0.3})`

            // Draw connecting lines to nearby points
            ctx.beginPath()
            ctx.arc(x, y, 2, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(147, 51, 234, ${opacity * 0.5})`
            ctx.fill()
          }
        }
      }

      animationRef.current = requestAnimationFrame(drawGrid)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handleMouseMove)
    drawGrid()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePos])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
}
