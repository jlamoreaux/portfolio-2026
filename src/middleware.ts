import { defineMiddleware } from "astro:middleware";
import { acceptsMarkdown, discoveryLinkHeader, isMarkdownPath } from "./lib/agent";

/**
 * Markdown content-negotiation for agents/LLMs. When a discovery-eligible page
 * is requested with `Accept: text/markdown`, return the page as Markdown
 * (delegated to /api/markdown, where the CMS query context is available).
 * Otherwise, advertise discovery endpoints via the `Link` header.
 */
export const onRequest = defineMiddleware(async (context, next) => {
	const { request, url } = context;
	const path = url.pathname;

	// Don't decorate the emdash admin/API surface.
	if (path.startsWith("/_emdash")) return next();

	const siteUrl = (context.site?.href ?? url.origin).replace(/\/$/, "");

	if (
		request.method === "GET" &&
		isMarkdownPath(path) &&
		acceptsMarkdown(request.headers.get("accept") || "")
	) {
		const mdUrl = new URL(
			`/api/markdown?path=${encodeURIComponent(path)}`,
			url.origin,
		);
		const res = await fetch(mdUrl);
		if (res.ok) {
			return new Response(await res.text(), {
				headers: {
					"Content-Type": "text/markdown; charset=utf-8",
					"Content-Location": `/api/markdown?path=${encodeURIComponent(path)}`,
					"Cache-Control": "private, no-store, max-age=0",
					"CDN-Cache-Control": "no-store",
					"Cloudflare-CDN-Cache-Control": "no-store",
					Link: discoveryLinkHeader(siteUrl),
					Vary: "Accept",
				},
			});
		}
	}

	const response = await next();
	response.headers.set("Link", discoveryLinkHeader(siteUrl));
	response.headers.append("Vary", "Accept");
	return response;
});
