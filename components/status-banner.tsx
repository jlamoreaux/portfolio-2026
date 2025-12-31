"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X, RefreshCw } from "lucide-react"

interface StatusBannerProps {
  isUsingFallback: boolean
  errors: string[]
}

export function StatusBanner({ isUsingFallback, errors }: StatusBannerProps) {
  const [isVisible, setIsVisible] = useState(isUsingFallback)

  if (!isUsingFallback || !isVisible) return null

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-20 left-0 right-0 z-40 px-4"
      >
        <div className="max-w-4xl mx-auto bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <div className="flex-1">
                <span className="font-medium text-yellow-800 dark:text-yellow-200">
                  Content Management System Unavailable
                </span>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Displaying cached content. Some information may be outdated.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="text-yellow-800 border-yellow-300 hover:bg-yellow-100 dark:text-yellow-200 dark:border-yellow-700 dark:hover:bg-yellow-800/20 bg-transparent"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
