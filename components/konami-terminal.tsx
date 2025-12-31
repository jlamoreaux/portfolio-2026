"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
]

interface TerminalLine {
  id: number
  text: string
  type: "input" | "output" | "error"
}

const commands = {
  help: "Available commands: help, about, skills, projects, clear, matrix, joke, coffee",
  about: "Your Name - Software Developer creating innovative solutions",
  skills: "JavaScript, TypeScript, React, Next.js, Node.js, Python, PostgreSQL, Docker",
  projects: "Full-stack web applications, API development, responsive UIs, and more!",
  clear: "CLEAR_TERMINAL",
  matrix: "MATRIX_MODE",
  joke: "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
  coffee: "☕ Brewing coffee... Please wait... ☕ Coffee ready! Time to code!",
  ls: "portfolio.js  blog.md  projects/  skills.json  coffee.exe",
  pwd: "/home/developer/portfolio",
  whoami: "developer - Software Engineer",
  date: new Date().toLocaleString(),
  echo: (args: string) => args || "",
}

export function KonamiTerminal() {
  const [isOpen, setIsOpen] = useState(false)
  const [keySequence, setKeySequence] = useState<string[]>([])
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 0, text: "Welcome to the secret terminal! 🚀", type: "output" },
    { id: 1, text: 'Type "help" for available commands', type: "output" },
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [lineId, setLineId] = useState(2)
  const [matrixMode, setMatrixMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen) return

      const newSequence = [...keySequence, event.code].slice(-KONAMI_CODE.length)
      setKeySequence(newSequence)

      if (newSequence.length === KONAMI_CODE.length && newSequence.every((key, index) => key === KONAMI_CODE[index])) {
        setIsOpen(true)
        setKeySequence([])
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [keySequence, isOpen])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (matrixMode) {
      const timer = setTimeout(() => setMatrixMode(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [matrixMode])

  const handleCommand = (input: string) => {
    const [cmd, ...args] = input.trim().toLowerCase().split(" ")
    const argsString = args.join(" ")

    setLines((prev) => [...prev, { id: lineId, text: `$ ${input}`, type: "input" }])
    setLineId((prev) => prev + 1)

    if (cmd === "") return

    if (commands[cmd as keyof typeof commands]) {
      const result = commands[cmd as keyof typeof commands]

      if (result === "CLEAR_TERMINAL") {
        setLines([])
        setLineId(0)
        return
      }

      if (result === "MATRIX_MODE") {
        setMatrixMode(true)
        setLines((prev) => [...prev, { id: lineId + 1, text: "Entering the Matrix... 🕶️", type: "output" }])
        setLineId((prev) => prev + 2)
        return
      }

      const output = typeof result === "function" ? result(argsString) : result
      setLines((prev) => [...prev, { id: lineId + 1, text: output, type: "output" }])
    } else {
      setLines((prev) => [...prev, { id: lineId + 1, text: `Command not found: ${cmd}`, type: "error" }])
    }

    setLineId((prev) => prev + 2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentInput.trim()) {
      handleCommand(currentInput)
      setCurrentInput("")
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`w-full max-w-4xl h-[600px] rounded-lg overflow-hidden ${
              matrixMode ? "bg-black border-green-500" : "bg-gray-900 border-gray-700"
            } border-2 shadow-2xl`}
          >
            {/* Terminal Header */}
            <div
              className={`flex items-center justify-between p-3 ${
                matrixMode ? "bg-green-900/50" : "bg-gray-800"
              } border-b border-gray-700`}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className={`ml-4 text-sm font-mono ${matrixMode ? "text-green-400" : "text-gray-300"}`}>
                  dev@portfolio:~$
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Terminal Content */}
            <div
              className={`p-4 h-[calc(100%-60px)] overflow-y-auto font-mono text-sm ${
                matrixMode ? "text-green-400 bg-black" : "text-green-400 bg-gray-900"
              }`}
            >
              {matrixMode && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="matrix-rain">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="matrix-column"
                        style={{
                          left: `${i * 5}%`,
                          animationDelay: `${Math.random() * 2}s`,
                        }}
                      >
                        {Array.from({ length: 20 }).map((_, j) => (
                          <span key={j} className="matrix-char">
                            {String.fromCharCode(0x30a0 + Math.random() * 96)}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {lines.map((line) => (
                  <div
                    key={line.id}
                    className={`${
                      line.type === "input"
                        ? "text-white"
                        : line.type === "error"
                          ? "text-red-400"
                          : matrixMode
                            ? "text-green-300"
                            : "text-green-400"
                    }`}
                  >
                    {line.text}
                  </div>
                ))}
              </div>

              {/* Input Line */}
              <form onSubmit={handleSubmit} className="flex items-center mt-2">
                <span className={matrixMode ? "text-green-300" : "text-white"}>$ </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  className={`flex-1 bg-transparent outline-none ml-2 ${matrixMode ? "text-green-300" : "text-white"}`}
                  placeholder="Type a command..."
                />
                <span className={`animate-pulse ${matrixMode ? "text-green-300" : "text-white"}`}>|</span>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
