import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site, url }) => {
	const siteUrl = (site?.href ?? url.origin).replace(/\/$/, "");
	const catalog = {
		linkset: [
			{
				anchor: siteUrl,
				"service-doc": [{ href: `${siteUrl}/api/health`, type: "application/json" }],
				status: [{ href: `${siteUrl}/api/health`, type: "application/json" }],
				sitemap: [{ href: `${siteUrl}/sitemap.xml`, type: "application/xml" }],
			},
		],
	};
	return new Response(JSON.stringify(catalog, null, 2), {
		headers: {
			"Content-Type": "application/linkset+json",
			"Access-Control-Allow-Origin": "*",
			"Cache-Control": "public, max-age=86400",
		},
	});
};
