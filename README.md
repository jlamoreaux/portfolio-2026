# Portfolio 2026 — Astro + EmDash + Cloudflare

A developer portfolio built with [Astro](https://astro.build), the
[EmDash](https://github.com/emdash-cms/emdash) CMS, and Tailwind CSS, deployed
to Cloudflare (D1 + R2 + Workers). This is a full rewrite of the previous
Next.js + Sanity site, preserving the design and feature set 1:1.

## Stack

- **Astro 6** (`output: "server"`) with the `@astrojs/cloudflare` adapter
- **EmDash CMS** — schema + content stored in **D1**, media in **R2**,
  admin UI at `/_emdash/admin`, content served via Astro Live Collections
- **Tailwind CSS v4** (design tokens ported from the original shadcn/ui theme)
- Native `.astro` components (no React UI; React is only used by the EmDash admin)

## Features (parity with the original)

- Home (hero, featured projects, blog, uses, contact), Projects (3D flip cards +
  category filter), Blog list + post pages (Portable Text), Uses, 404, RSS
- Dark/light/system theme, scroll progress, cursor trail, animated hero
  background, and the Konami-code terminal easter egg
- **Agent/LLM readiness**: `Accept: text/markdown` content negotiation,
  `/api/markdown`, `/api/health`, `/.well-known/api-catalog`,
  `/.well-known/agent-skills/index.json`, `/.well-known/mcp/server-card.json`,
  discovery `Link` headers, plus EmDash-native `/sitemap.xml` and `/robots.txt`

## Content model (EmDash collections)

| Collection      | Notes                                                            |
| --------------- | --------------------------------------------------------------- |
| `posts`         | Blog posts; `content` is Portable Text; `category` taxonomy      |
| `projects`      | `technologies` (json), `live_url`/`github_url`, `display_order`  |
| `uses`          | `use_category`, `reasoning`, `url`, `price`                      |
| `social_links`  | `icon`, `href`, `handle`, `color`, `is_primary`                  |
| `site_config`   | Single entry: hero/contact/footer/personal copy                 |
| `category`      | Taxonomy shared by posts + projects (colors in `src/lib/site.ts`)|

The schema and starter content live in [`seed/seed.json`](seed/seed.json).

## Local development

```bash
npm install
npm run dev          # astro dev (local D1/R2 via Cloudflare adapter)
```

Open `http://localhost:4321`. On first run EmDash applies the schema and
redirects to **`/_emdash/admin/setup`** to create your admin account.

> The starter `content` in `seed/seed.json` is opt-in. To load it locally:
> `npx emdash seed seed/seed.json --on-conflict=update`

Useful scripts:

```bash
npm run typecheck        # astro check
npm run build            # astro build (Cloudflare output)
npm run types            # regenerate emdash-env.d.ts from the live schema
npm run export-seed      # dump current DB schema + content to a seed file
```

## Deploying to Cloudflare

You need a Cloudflare account with Wrangler authenticated (`npx wrangler login`).

1. **Create the D1 database and R2 bucket** (names match `wrangler.jsonc`):

   ```bash
   npx wrangler d1 create jlmx-portfolio
   npx wrangler r2 bucket create jlmx-portfolio-media
   ```

   Put the returned `database_id` into `wrangler.jsonc` under the `DB` binding.

2. **Set the site URL** (used for canonical/OG/sitemap/JSON-LD/discovery):
   `EMDASH_SITE_URL` defaults to `https://jlmx.dev` in `astro.config.mjs`.
   Adjust there or via the env var if your domain differs.

3. **Apply the schema/content to remote D1** (Portable Text content transfers
   from `seed/seed.json`):

   ```bash
   npm run build
   npx wrangler deploy
   # apply the seed to the *remote* DB:
   npx emdash seed seed/seed.json --database "$(npx wrangler d1 info jlmx-portfolio --json | jq -r .uuid)" || \
     echo "Or run the EmDash setup wizard on the deployed URL, which seeds the schema automatically."
   ```

   The simplest path: deploy, open `https://<your-worker>.workers.dev/_emdash/admin/setup`,
   complete setup (schema seeds automatically), then add content in the admin or
   import via the migration script below.

4. **Custom domain** — `wrangler.jsonc` already maps `jlmx.dev` and
   `www.jlmx.dev`. Ensure the `jlmx.dev` zone exists in the account.

## Migrating real content from Sanity

The previous site's content lives in Sanity (project `oauuua7l`, dataset `dev`).
Run the migrator from a network that can reach `*.api.sanity.io` (e.g. your
laptop — it is blocked from CI sandboxes):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=oauuua7l \
NEXT_PUBLIC_SANITY_DATASET=dev \
# SANITY_READ_TOKEN=...   # only if the dataset is private
npm run convert:sanity

npx emdash seed seed/seed.json --validate
npx emdash seed seed/seed.json --on-conflict=update   # local, or apply to remote per above
```

This rewrites `seed/seed.json`'s `content` and `category` terms from Sanity
(Portable Text bodies + images via `$media`) while preserving the schema. See
the header of [`scripts/sanity-to-seed.mjs`](scripts/sanity-to-seed.mjs) for
limitations (publish dates and custom rich-text blocks may need review).

## Project structure

```
astro.config.mjs            # Cloudflare adapter + emdash(d1, r2) + Tailwind
wrangler.jsonc              # D1/R2/Worker bindings + jlmx.dev routes
seed/seed.json             # schema + starter content
src/
  live.config.ts            # EmDash live-collection loader (boilerplate)
  middleware.ts             # Accept: text/markdown negotiation + Link headers
  worker.ts                 # Cloudflare entrypoint (+ plugin sandbox bridge)
  layouts/Base.astro        # head/SEO, header, footer, effects, theme
  components/                # Header, Footer, cards, Icon, effects, sections
  pages/                     # index, projects, blog, uses, 404, rss, api/*, .well-known/*
  styles/global.css          # Tailwind v4 + ported design tokens
```

## License

MIT.
