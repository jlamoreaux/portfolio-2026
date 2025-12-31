"use client"

import { useEffect } from "react"

interface ErrorEvent {
  message: string
  source: string
  timestamp: Date
  userAgent: string
  url: string
}

export function useErrorMonitoring() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const errorData = {
        message: event.message,
        source: event.source,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }

      // Log to console in development
      if (process.env.NODE_ENV === "development") {
        console.error("Client error:", errorData)
      }

      // In production, you might want to send this to an error tracking service
      // like Sentry, LogRocket, or a custom endpoint
      if (process.env.NODE_ENV === "production") {
        // Example: Send to your error tracking service
        // fetch('/api/errors', {
        //   method: 'POST',
        //   body: JSON.stringify(errorData),
        //   headers: { 'Content-Type': 'application/json' }
        // }).catch(() => {}) // Fail silently
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason)

      if (process.env.NODE_ENV === "production") {
        // Track promise rejections
        // This could indicate Sanity connection issues
      }
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])
}
