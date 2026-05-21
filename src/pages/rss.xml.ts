import type { APIRoute } from "astro";
import { getEmDashCollection, getSiteSettings } from "emdash";

const XML_ESCAPE = [
	[/&/g, "&amp;"],
	[/</g, "&lt;"],
	[/>/g, "&gt;"],
	[/"/g, "&quot;"],
	[/'/g, "&apos;"],
] as const;

function escapeXml(str: string): string {
	let out = str;
	for (const [pattern, replacement] of XML_ESCAPE) out = out.replace(pattern, replacement);
	return out;
}

export const GET: APIRoute = async ({ site, url }) => {
	const siteUrl = (site?.toString() || url.origin).replace(/\/$/, "");
	const settings = await getSiteSettings();
	const siteTitle = settings?.title || "Blog";
	const siteDescription = settings?.tagline || "Thoughts on software development";

	const { entries: posts } = await getEmDashCollection("posts", {
		orderBy: { published_at: "desc" },
		limit: 20,
	});

	const items = posts
		.map((post) => {
			const postUrl = `${siteUrl}/blog/${post.id}`;
			const pubDate = post.data.publishedAt
				? post.data.publishedAt.toUTCString()
				: new Date().toUTCString();
			return `    <item>
      <title>${escapeXml(post.data.title || "Untitled")}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.data.excerpt || "")}</description>
    </item>`;
		})
		.join("\n");

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <description>${escapeXml(siteDescription)}</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

	return new Response(rss, {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
