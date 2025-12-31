"use client"

import { useEffect } from "react"

export function ClientErrorMonitoring() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Only log in development
      if (process.env.NODE_ENV === "development") {
        console.error("Client error:", {
          message: event.message,
          source: event.filename,
          line: event.lineno,
          column: event.colno,
        })
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (process.env.NODE_ENV === "development") {
        console.error("Unhandled promise rejection:", event.reason)
      }
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return null
}
