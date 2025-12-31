"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Particle {
  id: number
  x: number
  y: number
}

export function CursorTrail() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    let particleId = 0

    const handleMouseMove = (e: MouseEvent) => {
      const newParticle: Particle = {
        id: particleId++,
        x: e.clientX,
        y: e.clientY,
      }

      setParticles((prev) => [...prev.slice(-10), newParticle])
    }

    window.addEventListener("mousemove", handleMouseMove)

    const cleanup = setInterval(() => {
      setParticles((prev) => prev.slice(-5))
    }, 100)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearInterval(cleanup)
    }
  }, [isClient])

  if (!isClient) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle, index) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-primary/30 rounded-full"
          initial={{
            x: particle.x - 4,
            y: particle.y - 4,
            scale: 1,
            opacity: 0.6,
          }}
          animate={{
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}
