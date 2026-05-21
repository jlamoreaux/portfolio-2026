import { getEmDashCollection, getEntryTerms, getMenu } from "emdash";

/** The single site_config entry holding hero/contact/footer/personal copy. */
export async function getSiteConfig() {
	const { entries } = await getEmDashCollection("site_config", { limit: 1 });
	return entries[0]?.data ?? null;
}

/** Blog posts (newest first) with their category labels resolved. */
export async function getBlogPosts() {
	const { entries, cacheHint } = await getEmDashCollection("posts", {
		orderBy: { published_at: "desc" },
	});
	const posts = await Promise.all(
		entries.map(async (e) => {
			const terms = await getEntryTerms("posts", e.data.id, "category");
			return { ...e.data, id: e.id, categories: terms.map((t) => t.label) };
		}),
	);
	return { posts, cacheHint };
}

/** Projects (by display order) with category slug + label resolved. */
export async function getProjects() {
	const { entries, cacheHint } = await getEmDashCollection("projects", {
		orderBy: { display_order: "asc" },
	});
	const projects = await Promise.all(
		entries.map(async (e) => {
			const terms = await getEntryTerms("projects", e.data.id, "category");
			return {
				...e.data,
				id: e.id,
				categories: terms.map((t) => ({ slug: t.slug, label: t.label })),
			};
		}),
	);
	return { projects, cacheHint };
}

/** Uses items ordered for display. */
export async function getUses() {
	const { entries, cacheHint } = await getEmDashCollection("uses", {
		orderBy: { display_order: "asc" },
	});
	return { items: entries.map((e) => ({ ...e.data, id: e.id })), cacheHint };
}

/** Social links ordered for display, with footer-only filtering available. */
export async function getSocialLinks() {
	const { entries } = await getEmDashCollection("social_links", {
		orderBy: { display_order: "asc" },
	});
	return entries.map((e) => e.data);
}

/** Primary navigation menu, with a static fallback if the menu is missing. */
export async function getPrimaryNav(): Promise<
	Array<{ label: string; href: string; target?: string }>
> {
	const menu = await getMenu("primary");
	if (menu?.items?.length) {
		return menu.items.map((i) => ({ label: i.label, href: i.url, target: i.target }));
	}
	return [
		{ label: "Work", href: "/projects" },
		{ label: "Blog", href: "/blog" },
		{ label: "Uses", href: "/uses" },
		{ label: "Connect", href: "/#contact" },
	];
}

/** Category slug -> Tailwind background color (taxonomy terms can't hold color). */
export const CATEGORY_COLORS: Record<string, string> = {
	"ai-ml": "bg-orange-600",
	"full-stack": "bg-blue-500",
	devops: "bg-amber-500",
	career: "bg-purple-500",
	tutorial: "bg-green-500",
};

/** Uses-page category metadata (icon + accent color), ported from sections.json. */
export const USES_CATEGORIES = [
	{ name: "Hardware", icon: "Monitor", color: "bg-blue-500" },
	{ name: "Software", icon: "Code", color: "bg-amber-500" },
	{ name: "Development Tools", icon: "Wrench", color: "bg-orange-600" },
	{ name: "Office Setup", icon: "Coffee", color: "bg-orange-400" },
] as const;

export function formatDate(value: Date | string | null | undefined): string {
	if (!value) return "";
	const d = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(d.getTime())) return "";
	return d.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}
