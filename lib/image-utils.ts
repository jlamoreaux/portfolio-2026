import type { SanityImage } from "./types"
import { urlFor } from "./sanity"

export function getImageUrl(image: SanityImage | string | null | undefined, width?: number, height?: number): string {
  // If it's already a string URL, return it
  if (typeof image === "string") {
    return image
  }

  // For fallback data or missing images, return placeholder
  if (!image || !image.asset || image.asset._ref === "fallback") {
    return `/placeholder.svg?height=${height || 300}&width=${width || 400}`
  }

  // Use urlFor to build optimized image URL with crop/hotspot support
  let builder = urlFor(image)

  if (width) {
    builder = builder.width(width)
  }
  if (height) {
    builder = builder.height(height)
  }

  return builder.fit('crop').auto('format').url()
}
