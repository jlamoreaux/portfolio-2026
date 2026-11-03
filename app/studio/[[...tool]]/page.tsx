'use client'

/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import dynamic from 'next/dynamic'

// Sanity Studio v6 pulls in @sanity/client v8, whose Node build bundles undici.
// undici touches globals (MessagePort, FinalizationRegistry) at module load that
// the Workers runtime doesn't expose at this compatibility date, so SSR of this
// route crashes on Cloudflare. The Studio is a client-only SPA, so skip SSR.
const Studio = dynamic(
  async () => {
    const [{ NextStudio }, { default: config }] = await Promise.all([
      import('next-sanity/studio'),
      import('../../../sanity.config'),
    ])
    return function StudioWithConfig() {
      return <NextStudio config={config} />
    }
  },
  { ssr: false },
)

export default function StudioPage() {
  return <Studio />
}
