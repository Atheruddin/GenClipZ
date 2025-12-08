"use client"

import { useEffect, useState } from "react"

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    const mouseEnter = () => setCursorVariant("hover")
    const mouseLeave = () => setCursorVariant("default")

    window.addEventListener("mousemove", mouseMove)

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll("button, a, input, textarea")
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", mouseEnter)
      el.addEventListener("mouseleave", mouseLeave)
    })

    return () => {
      window.removeEventListener("mousemove", mouseMove)
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", mouseEnter)
        el.removeEventListener("mouseleave", mouseLeave)
      })
    }
  }, [])

  const variants = {
    default: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      scale: 1,
    },
    hover: {
      x: mousePosition.x - 15,
      y: mousePosition.y - 15,
      scale: 1.5,
    },
  }

  return (
    <>
      <div
        className="custom-cursor"
        style={{
          left: `${variants[cursorVariant as keyof typeof variants].x}px`,
          top: `${variants[cursorVariant as keyof typeof variants].y}px`,
          transform: `scale(${variants[cursorVariant as keyof typeof variants].scale})`,
        }}
      />
      <div
        className="custom-cursor-dot"
        style={{
          left: `${mousePosition.x - 2}px`,
          top: `${mousePosition.y - 2}px`,
        }}
      />
    </>
  )
}
