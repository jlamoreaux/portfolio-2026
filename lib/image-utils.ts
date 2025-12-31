import type { SanityImage } from "./types"

export function getImageUrl(image: SanityImage | string, width?: number, height?: number): string {
  // If it's already a string URL, return it
  if (typeof image === "string") {
    return image
  }

  // For fallback data, return placeholder
  if (!image || !image.asset || image.asset._ref === "fallback") {
    const dimensions = width && height ? `${width}x${height}` : "400x300"
    return `/placeholder.svg?height=${height || 300}&width=${width || 400}`
  }

  // This would normally use Sanity's image URL builder
  // For now, return placeholder
  return `/placeholder.svg?height=${height || 300}&width=${width || 400}`
}
