#!/usr/bin/env node
/**
 * Sanity -> EmDash seed migrator.
 *
 * Reads content from a live Sanity dataset over the public HTTP API and rewrites
 * the `content` (and category taxonomy terms) of seed/seed.json, preserving the
 * curated schema (collections/fields/menus/settings) already defined there.
 *
 * Run from a network that can reach *.api.sanity.io (e.g. your laptop), then
 * validate + apply:
 *
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=oauuua7l \
 *   NEXT_PUBLIC_SANITY_DATASET=dev \
 *   SANITY_READ_TOKEN=optional_token_for_private_datasets \
 *   node scripts/sanity-to-seed.mjs
 *
 *   npx emdash seed seed/seed.json --validate
 *   npx emdash seed seed/seed.json --on-conflict=update   # local
 *   # ...or import into a deployed instance per the README runbook.
 *
 * Notes / limitations:
 * - Original publish dates are not carried over (EmDash sets publishedAt when an
 *   entry is published). Re-publish with desired dates in the admin if needed.
 * - Portable Text blocks pass through; custom image blocks are resolved to URLs.
 *   Review rich-text-heavy posts after import.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "oauuua7l";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "dev";
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const TOKEN = process.env.SANITY_READ_TOKEN || "";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SEED_PATH = join(__dirname, "..", "seed", "seed.json");

async function groq(query) {
	const url = new URL(
		`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`,
	);
	url.searchParams.set("query", query);
	const headers = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};
	const res = await fetch(url, { headers });
	if (!res.ok) throw new Error(`Sanity query failed (${res.status}): ${await res.text()}`);
	return (await res.json()).result;
}

/** Resolve a Sanity image asset _ref to a CDN URL. */
function imageUrl(ref) {
	if (!ref || typeof ref !== "string") return null;
	// image-<id>-<width>x<height>-<ext>
	const m = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
	if (!m) return null;
	const [, id, dims, ext] = m;
	return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dims}.${ext}`;
}

function media(image, filenameBase) {
	const ref = image?.asset?._ref;
	const url = imageUrl(ref);
	if (!url) return undefined;
	return {
		$media: { url, alt: image?.alt || filenameBase, filename: `${filenameBase}.${url.split(".").pop()}` },
	};
}

const slugOf = (v) => (typeof v === "string" ? v : v?.current) || "";

/** Resolve image blocks inside Portable Text to URLs; pass everything else through. */
function portableText(blocks) {
	if (!Array.isArray(blocks)) return undefined;
	return blocks.map((b) => {
		if (b?._type === "image") {
			return { _type: "image", _key: b._key, url: imageUrl(b?.asset?._ref), alt: b.alt || "" };
		}
		return b;
	});
}

async function main() {
	console.log(`Reading Sanity ${PROJECT_ID}/${DATASET} ...`);
	const [settings, projects, posts, uses, socials, categories] = await Promise.all([
		groq(`*[_type=="siteSettings"][0]`),
		groq(`*[_type=="project"]|order(order asc, publishedAt desc){...,category->{title,slug}}`),
		groq(`*[_type=="blogPost"]|order(publishedAt desc){...,categories[]->{title,slug}}`),
		groq(`*[_type=="usesItem"]|order(category asc, order asc)`),
		groq(`*[_type=="socialLink"]|order(order asc)`),
		groq(`*[_type=="category"]|order(title asc)`),
	]);

	const seed = JSON.parse(await readFile(SEED_PATH, "utf-8"));

	// Category taxonomy terms
	if (Array.isArray(categories) && categories.length) {
		const terms = categories.map((c) => ({
			slug: slugOf(c.slug),
			label: c.title,
			description: c.description || undefined,
		}));
		const tax = seed.taxonomies?.find((t) => t.name === "category");
		if (tax) tax.terms = terms;
	}

	// Site settings (single entry)
	if (settings) {
		seed.settings = {
			title: settings.name || seed.settings?.title,
			tagline: settings.title || seed.settings?.tagline,
		};
		seed.content.site_config = [
			{
				id: "site-config-main",
				slug: "main",
				status: "published",
				data: {
					title: settings.name || "",
					role_title: settings.title || "",
					email: settings.email || "",
					location: settings.location || "",
					company: settings.company || "",
					role: settings.role || "",
					previous_role: settings.previousRole || "",
					...(media(settings.avatar, "avatar") ? { avatar: media(settings.avatar, "avatar") } : {}),
					hero_title_line1: settings.heroTitleLine1 || "",
					hero_title_line2: settings.heroTitleLine2 || "",
					hero_description: settings.heroDescription || "",
					hero_primary_cta: settings.heroPrimaryCta || "View Projects",
					hero_primary_cta_href: settings.heroPrimaryCtaHref || "/projects",
					hero_secondary_cta: settings.heroSecondaryCta || "Read Blog",
					hero_secondary_cta_href: settings.heroSecondaryCtaHref || "/blog",
					technologies: settings.technologies || [],
					availability_status: settings.availabilityStatus || "available",
					availability_message: settings.availabilityMessage || "",
					response_time: settings.responseTime || "",
					best_topics: settings.bestTopics || [],
					contact_cta_title: settings.contactCtaTitle || "",
					contact_cta_description: settings.contactCtaDescription || "",
					copyright_text: settings.copyrightText || "",
					built_with_text: settings.builtWithText || "Built with Astro, EmDash, and Tailwind CSS",
				},
			},
		];
	}

	seed.content.projects = (projects || []).map((p, i) => {
		const slug = slugOf(p.slug);
		const img = media(p.image, slug || `project-${i}`);
		const cat = slugOf(p.category?.slug);
		return {
			id: `project-${slug || i}`,
			slug,
			status: "published",
			data: {
				title: p.title || "",
				description: p.description || "",
				content: portableText(p.longDescription ? [{ _type: "block", style: "normal", _key: "k0", children: [{ _type: "span", _key: "s0", text: p.longDescription }] }] : p.content),
				...(img ? { featured_image: img } : {}),
				technologies: p.technologies || [],
				live_url: p.liveUrl || "",
				github_url: p.githubUrl || "",
				featured: !!p.featured,
				display_order: typeof p.order === "number" ? p.order : i,
			},
			...(cat ? { taxonomies: { category: [cat] } } : {}),
		};
	});

	seed.content.posts = (posts || []).map((p, i) => {
		const slug = slugOf(p.slug);
		const img = media(p.image, slug || `post-${i}`);
		const cats = (p.categories || []).map((c) => slugOf(c.slug)).filter(Boolean);
		return {
			id: `post-${slug || i}`,
			slug,
			status: "published",
			data: {
				title: p.title || "",
				excerpt: p.excerpt || "",
				...(img ? { featured_image: img } : {}),
				content: portableText(p.content),
				reading_time: typeof p.readingTime === "number" ? p.readingTime : undefined,
				featured: !!p.featured,
			},
			...(cats.length ? { taxonomies: { category: cats } } : {}),
		};
	});

	seed.content.uses = (uses || []).map((u, i) => {
		const slug = slugOf(u.slug) || (u.name || `use-${i}`).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
		const img = media(u.image, slug);
		return {
			id: `uses-${slug}`,
			slug,
			status: "published",
			data: {
				title: u.name || "",
				description: u.description || "",
				reasoning: u.reasoning || "",
				...(img ? { featured_image: img } : {}),
				use_category: u.category || "",
				url: u.url || "",
				price: u.price || "",
				display_order: typeof u.order === "number" ? u.order : i,
			},
		};
	});

	seed.content.social_links = (socials || []).map((s, i) => {
		const slug = (s.name || `social-${i}`).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
		return {
			id: `social-${slug}`,
			slug,
			status: "published",
			data: {
				title: s.name || "",
				icon: s.icon || "Globe",
				href: s.href || "",
				handle: s.handle || "",
				description: s.description || "",
				color: s.color || "",
				is_primary: s.primary !== false,
				display_order: typeof s.order === "number" ? s.order : i,
			},
		};
	});

	await writeFile(SEED_PATH, `${JSON.stringify(seed, null, "\t")}\n`);
	console.log(
		`Wrote ${SEED_PATH}\n` +
			`  projects: ${seed.content.projects.length}\n` +
			`  posts:    ${seed.content.posts.length}\n` +
			`  uses:     ${seed.content.uses.length}\n` +
			`  social:   ${seed.content.social_links.length}\n` +
			`Next: npx emdash seed seed/seed.json --validate`,
	);
}

main().catch((err) => {
	console.error(err.message || err);
	process.exit(1);
});
