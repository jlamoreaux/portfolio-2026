/**
 * Agent / LLM discovery helpers (markdown content-negotiation + discovery links).
 * Pure functions only — safe to import from middleware.
 */

const MARKDOWN_PATHS = ["/", "/blog", "/projects", "/uses"];
const BLOG_POST_RE = /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/i;

export function isMarkdownPath(pathname: string): boolean {
	return MARKDOWN_PATHS.includes(pathname) || BLOG_POST_RE.test(pathname);
}

/** Parse an Accept header and report whether `mediaType` is acceptable (q > 0). */
export function acceptsMarkdown(
	acceptHeader: string,
	mediaType = "text/markdown",
): boolean {
	if (!acceptHeader) return false;
	const types = acceptHeader.split(",").map((t) => t.trim().toLowerCase());

	let mediaTypeQ: number | null = null;
	let wildcardQ = 0;

	for (const type of types) {
		const [media, ...params] = type.split(";").map((p) => p.trim());
		let q = 1;
		for (const param of params) {
			if (param.startsWith("q=")) {
				const qValue = Number.parseFloat(param.substring(2));
				if (!Number.isNaN(qValue)) q = qValue;
			}
		}
		if (media === mediaType) mediaTypeQ = q;
		if (media === "*/*") {
			wildcardQ = q;
		} else if (media.includes("*")) {
			const [mainType] = mediaType.split("/");
			const [acceptMainType] = media.split("/");
			if (acceptMainType === mainType || media === `${mainType}/*`) {
				if (mediaTypeQ === null) mediaTypeQ = q;
			}
		}
	}

	if (mediaTypeQ !== null) return mediaTypeQ > 0;
	return wildcardQ > 0;
}

export function discoveryLinkHeader(siteUrl: string): string {
	const base = siteUrl.replace(/\/$/, "");
	return [
		`<${base}/.well-known/api-catalog>; rel="api-catalog"`,
		`<${base}/sitemap.xml>; rel="sitemap"`,
		`<${base}/.well-known/agent-skills/index.json>; rel="https://agentskills.io/rel/skills-index"`,
		`<${base}/.well-known/mcp/server-card.json>; rel="https://modelcontextprotocol.io/rel/server-card"`,
	].join(", ");
}
