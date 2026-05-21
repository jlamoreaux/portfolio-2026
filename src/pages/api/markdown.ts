import type { APIRoute } from "astro";
import { extractPlainText, getEmDashEntry } from "emdash";
import { getBlogPosts, getProjects, getSiteConfig, getUses, formatDate } from "../../lib/site";

const BLOG_SLUG_RE = /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/i;

function isValidPath(path: string): boolean {
	return ["/", "/blog", "/projects", "/uses"].includes(path) || BLOG_SLUG_RE.test(path);
}

function bodyText(content: unknown, fallback = ""): string {
	try {
		const text = content ? extractPlainText(content as any) : "";
		return text || fallback;
	} catch {
		return fallback;
	}
}

export const GET: APIRoute = async ({ url, site }) => {
	const path = url.searchParams.get("path") || "/";
	if (!isValidPath(path)) {
		return new Response("Not found", { status: 404 });
	}
	const siteUrl = (site?.href ?? url.origin).replace(/\/$/, "");

	const md = (s: string) =>
		new Response(s, {
			headers: {
				"Content-Type": "text/markdown; charset=utf-8",
				"Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
				Vary: "Accept",
			},
		});

	try {
		if (BLOG_SLUG_RE.test(path)) {
			const slug = path.replace("/blog/", "");
			const { entry: post } = await getEmDashEntry("posts", slug);
			if (!post) return new Response("Not found", { status: 404 });
			const meta = `*${formatDate(post.data.publishedAt)}${post.data.reading_time ? ` · ${post.data.reading_time} min read` : ""}*`;
			return md(`# ${post.data.title}

${meta}

${post.data.excerpt || ""}

${bodyText(post.data.content)}

---

*View online: [${siteUrl}/blog/${slug}](${siteUrl}/blog/${slug})*
`);
		}

		const config = await getSiteConfig();
		const name = config?.title || "Portfolio";
		const role = config?.role_title || "Software Developer";

		if (path === "/blog") {
			const { posts } = await getBlogPosts();
			return md(`# Blog — ${name}

${posts
	.map(
		(p) =>
			`## [${p.title}](${siteUrl}/blog/${p.id})

${p.excerpt || ""}

*${formatDate(p.publishedAt)}${p.reading_time ? ` · ${p.reading_time} min read` : ""}*`,
	)
	.join("\n\n")}
`);
		}

		if (path === "/projects") {
			const { projects } = await getProjects();
			return md(`# Projects — ${name}

${projects
	.map(
		(p) =>
			`## ${p.title}

${bodyText(p.content, p.description)}

**Technologies:** ${Array.isArray(p.technologies) ? p.technologies.join(", ") : ""}${p.live_url ? `  \n**Live:** ${p.live_url}` : ""}${p.github_url ? `  \n**GitHub:** ${p.github_url}` : ""}`,
	)
	.join("\n\n")}
`);
		}

		if (path === "/uses") {
			const { items } = await getUses();
			return md(`# Uses — ${name}

${items
	.map(
		(i) =>
			`## ${i.title}${i.price ? ` (${i.price})` : ""}

${i.description || ""}

${i.reasoning ? `*Why:* ${i.reasoning}` : ""}${i.url ? `  \n**Link:** ${i.url}` : ""}`,
	)
	.join("\n\n")}
`);
		}

		// Home
		const [{ projects }, { posts }] = await Promise.all([getProjects(), getBlogPosts()]);
		return md(`# ${name} — ${role}

${config?.hero_description || ""}

**Location:** ${config?.location || "Remote"}
**Email:** ${config?.email || ""}

## Projects

${projects
	.slice(0, 6)
	.map(
		(p) =>
			`### ${p.title}

${p.description || ""}

**Technologies:** ${Array.isArray(p.technologies) ? p.technologies.join(", ") : ""}${p.live_url ? `  \n**Live:** ${p.live_url}` : ""}${p.github_url ? `  \n**GitHub:** ${p.github_url}` : ""}`,
	)
	.join("\n\n")}

## Recent Blog Posts

${posts
	.slice(0, 5)
	.map(
		(p) =>
			`### [${p.title}](${siteUrl}/blog/${p.id})

${p.excerpt || ""}

*${formatDate(p.publishedAt)}${p.reading_time ? ` · ${p.reading_time} min read` : ""}*`,
	)
	.join("\n\n")}

---

[View all projects](${siteUrl}/projects) · [Read the blog](${siteUrl}/blog) · [Uses](${siteUrl}/uses)
`);
	} catch {
		return new Response("# Error\n\nFailed to load content.", {
			status: 500,
			headers: { "Content-Type": "text/markdown; charset=utf-8" },
		});
	}
};
