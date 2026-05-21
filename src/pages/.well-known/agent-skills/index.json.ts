import type { APIRoute } from "astro";

async function sha256hex(content: string): Promise<string> {
	const data = new TextEncoder().encode(content);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(hashBuffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

async function fetchText(origin: string, path: string): Promise<string> {
	const res = await fetch(new URL(path, origin));
	return res.ok ? await res.text() : "";
}

export const GET: APIRoute = async ({ site, url }) => {
	const siteUrl = (site?.href ?? url.origin).replace(/\/$/, "");

	// Hash the published markdown skill files (served statically from /public).
	const [portfolioContent, healthContent] = await Promise.all([
		fetchText(url.origin, "/.well-known/agent-skills/portfolio.md"),
		fetchText(url.origin, "/.well-known/agent-skills/health.md"),
	]);
	const [portfolioHash, healthHash] = await Promise.all([
		sha256hex(portfolioContent),
		sha256hex(healthContent),
	]);

	const index = {
		$schema: "https://agentskills.io/schema/v0.2.0/index.json",
		skills: [
			{
				name: "get-portfolio-markdown",
				type: "skill-file",
				description:
					"Fetch any page of this portfolio as clean Markdown via Accept: text/markdown content negotiation.",
				url: `${siteUrl}/.well-known/agent-skills/portfolio.md`,
				sha256: portfolioHash,
			},
			{
				name: "health-check",
				type: "skill-file",
				description: "Check site and CMS operational status via GET /api/health.",
				url: `${siteUrl}/.well-known/agent-skills/health.md`,
				sha256: healthHash,
			},
		],
	};

	return new Response(JSON.stringify(index, null, 2), {
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
