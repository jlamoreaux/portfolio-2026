# AI Developer Portfolio with Sanity CMS

A modern, memorable developer portfolio website built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, and Sanity CMS.

## Features

- 🎨 Modern design with rust/orange color scheme
- 🚀 Next.js 15 with App Router and TypeScript
- 📱 Fully responsive design
- 🎭 Smooth animations with Framer Motion
- 📝 Content management with Sanity CMS
- 🌙 Dark/light mode support
- 🎮 Easter eggs (Konami code terminal)
- ⚡ Optimized for performance and SEO

## Getting Started

### 1. Clone the repository

\`\`\`bash
git clone <your-repo-url>
cd ai-developer-portfolio
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set up Sanity CMS

1. Create a new Sanity project at [sanity.io](https://sanity.io)
2. Copy your project ID and dataset name
3. Create a `.env.local` file:

\`\`\`env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
\`\`\`

### 4. Seed initial data

\`\`\`bash
npx tsx scripts/seed-data.ts
\`\`\`

### 5. Run the development server

\`\`\`bash
npm run dev
\`\`\`

### 6. Access Sanity Studio

Visit `http://localhost:3000/studio` to manage your content.

## Error Handling & Resilience

This portfolio is designed to be resilient and will continue to work even when Sanity CMS is unavailable:

### Graceful Degradation
- **Fallback Data**: If Sanity is down, the site displays cached/fallback content
- **Status Banner**: Users are informed when CMS is unavailable
- **Error Boundaries**: Individual sections fail gracefully without breaking the entire site
- **Health Monitoring**: Built-in health check endpoint at `/api/health`

### What Happens When Sanity is Down?
1. **Automatic Fallback**: Site switches to pre-defined fallback data
2. **User Notification**: Subtle banner informs users about the situation
3. **Retry Mechanism**: Users can attempt to reload fresh data
4. **Continued Functionality**: All interactive features continue to work

### Monitoring
- Client-side error tracking for debugging
- Server-side error logging
- Health check API for monitoring services
- Graceful timeout handling (8-second timeout)

### Configuration States
- **Fully Configured**: Sanity works normally
- **Partially Configured**: Missing some data, uses fallbacks
- **Not Configured**: No Sanity credentials, uses all fallback data
- **Connection Issues**: Sanity configured but unreachable

## Content Management

### Projects
- Add your projects with images, descriptions, and tech stacks
- Categorize projects (AI/ML, Full-Stack, DevOps)
- Set display order and featured status

### Blog Posts
- Write blog posts with rich text content
- Add featured images and categories
- Set reading time and publication date

### Uses Items
- Showcase your tools and equipment
- Organize by category (Hardware, Software, etc.)
- Include pricing and reasoning

### Categories
- Create and manage content categories
- Assign colors for visual organization

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables

\`\`\`env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
\`\`\`

## Customization

### Colors
Update the color scheme in `tailwind.config.ts`:

\`\`\`ts
colors: {
  primary: {
    DEFAULT: "#EA580C", // Rust/Orange
    // ... other shades
  },
  accent: {
    DEFAULT: "#D97706", // Amber
    // ... other shades
  },
}
\`\`\`

### Content
All content is managed through Sanity Studio at `/studio`.

### Animations
Modify animations in component files using Framer Motion.

## Performance

- Images are optimized with Next.js Image component
- Content is cached with ISR (revalidates every hour)
- Lazy loading for better performance
- Optimized for Core Web Vitals

## SEO

- Dynamic metadata generation
- OpenGraph and Twitter cards
- Semantic HTML structure
- Proper heading hierarchy

## License

MIT License - feel free to use this for your own portfolio!
