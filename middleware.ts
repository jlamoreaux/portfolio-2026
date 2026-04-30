import { NextRequest, NextResponse } from "next/server"

const MARKDOWN_PATHS = ["/", "/blog", "/projects", "/uses"]

/**
 * Parse Accept header and check if a media type is acceptable (q > 0)
 */
function isAcceptingMedia(acceptHeader: string, mediaType: string): boolean {
  if (!acceptHeader) return false

  const types = acceptHeader.split(",").map((t) => t.trim())

  let mediaTypeQ: number | null = null
  let wildcardQ = 0.0 // Only set when */* is explicitly present

  for (const type of types) {
    const [media, ...params] = type.split(";").map((p) => p.trim())

    // Extract q-value from parameters
    let q = 1.0
    for (const param of params) {
      if (param.startsWith("q=")) {
        const qValue = parseFloat(param.substring(2))
        if (!isNaN(qValue)) {
          q = qValue
        }
      }
    }

    // Check for exact match
    if (media === mediaType) {
      mediaTypeQ = q
    }

    // Check for wildcard matches
    if (media === "*/*") {
      wildcardQ = q
    } else if (media.includes("*")) {
      const [mainType] = mediaType.split("/")
      const [acceptMainType] = media.split("/")
      if (acceptMainType === mainType || media === `${mainType}/*`) {
        if (mediaTypeQ === null) {
          mediaTypeQ = q
        }
      }
    }
  }

  // If explicit media type found, use its q-value
  if (mediaTypeQ !== null) {
    return mediaTypeQ > 0
  }

  // Otherwise, use wildcard q-value
  return wildcardQ > 0
}

export function middleware(request: NextRequest) {
  const accept = request.headers.get("accept") || ""

  if (isAcceptingMedia(accept, "text/markdown")) {
    const { pathname } = request.nextUrl
    const isBlogPost = pathname.startsWith("/blog/") && pathname.length > 6
    const isMarkdownPath = MARKDOWN_PATHS.includes(pathname) || isBlogPost

    if (isMarkdownPath) {
      const url = request.nextUrl.clone()
      url.pathname = "/api/markdown"
      url.searchParams.set("path", pathname)
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/blog", "/blog/:path*", "/projects", "/uses"],
}
