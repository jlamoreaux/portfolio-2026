import { NextRequest, NextResponse } from "next/server"

const MARKDOWN_PATHS = ["/", "/blog", "/projects", "/uses"]

export function middleware(request: NextRequest) {
  const accept = request.headers.get("accept") || ""

  if (accept.includes("text/markdown")) {
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
