import type React from "react"

export const metadata = {
  title: "Sanity Studio",
  description: "Content management studio",
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="h-screen w-screen">{children}</div>
}
