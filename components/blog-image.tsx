"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface BlogImageProps {
  src: string
  alt: string
}

export function BlogImage({ src, alt }: BlogImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <figure className="my-8 flex flex-col items-center">
        <div className="relative max-w-2xl w-full">
          <img
            src={src}
            alt={alt}
            className="w-full h-auto rounded-lg cursor-zoom-in hover:opacity-90 transition-opacity"
            loading="lazy"
            onClick={() => setIsOpen(true)}
          />
        </div>
        {alt && (
          <figcaption className="text-center text-sm text-muted-foreground mt-3 italic">
            {alt}
          </figcaption>
        )}
      </figure>

      {/* Lightbox Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          {alt && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded">
              {alt}
            </p>
          )}
        </div>
      )}
    </>
  )
}
