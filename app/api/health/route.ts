import { NextResponse } from "next/server"
import { client } from "@/lib/sanity"

export async function GET() {
  try {
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
      return NextResponse.json(
        {
          status: "warning",
          message: "Sanity not configured",
          sanity: false,
          timestamp: new Date().toISOString(),
        },
        { status: 200 },
      )
    }

    // Test Sanity connection with a simple query
    const testQuery = '*[_type == "project"][0...1]{_id}'
    await client.fetch(testQuery)

    return NextResponse.json({
      status: "healthy",
      message: "All systems operational",
      sanity: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check failed:", error)

    return NextResponse.json(
      {
        status: "degraded",
        message: "Sanity CMS unavailable - using cached content",
        sanity: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    ) // Return 200 so the site doesn't appear down
  }
}
