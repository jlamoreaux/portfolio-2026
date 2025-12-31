# Sanity CMS Setup Guide

## ✅ What's Already Done

Your Sanity setup is already in place with:
- ✅ Project ID: `oauuua7l`
- ✅ Dataset: `production` 
- ✅ Schemas defined for: Projects, Blog Posts, Uses Items, Categories
- ✅ Data service updated to fetch from Sanity with fallbacks
- ✅ Environment variables configured

## 🚀 Quick Start

### 1. Start the Sanity Studio
```bash
# Navigate to your project
cd /Users/jlmx/projects/dev-portfolio

# Start the Sanity Studio
npx sanity dev --port 3333
```

The studio will be available at: `http://localhost:3333`

### 2. Start Your Next.js App
```bash
# In another terminal
npm run dev
```

Your app will be at: `http://localhost:3000`

## 📝 Creating Content

### First Steps:
1. **Create Categories** (do this first as other content references them)
   - Go to Categories in the studio
   - Create categories like: "Web App", "API", "Mobile", etc.

2. **Create Projects**
   - Title, description, technologies
   - Upload project images
   - Link to live URLs and GitHub repos

3. **Create Blog Posts**
   - Rich text content with images and code blocks
   - SEO metadata
   - Link to categories

4. **Create Uses Items**
   - Tools, hardware, software you use
   - Product images and prices
   - Organize by category (Hardware, Software, etc.)

## 🔧 Configuration

### Environment Variables
Your `.env.local` should have:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID="oauuua7l"
NEXT_PUBLIC_SANITY_DATASET="production"
```

### Sanity Client
The client is configured in `/sanity/lib/client.ts` and automatically uses your environment variables.

## 📊 Data Flow

```
Sanity Studio → Sanity Cloud → Your Next.js App
     ↓              ↓              ↓
   Content      API/Database    Live Website
```

### Fallback System
If Sanity is empty or unreachable, the app automatically falls back to demo data from `/lib/fallback-data.ts`.

## 🛠 Commands

```bash
# Start Sanity Studio (CMS interface)
npx sanity dev --port 3333

# Deploy studio to Sanity hosting
npx sanity deploy

# Check project info
npx sanity projects list

# Manage datasets
npx sanity dataset list

# Export data (backup)
npx sanity dataset export production backup.tar.gz

# Import data
npx sanity dataset import backup.tar.gz production
```

## 🚨 Troubleshooting

### If Studio Won't Start
1. Check environment variables in `.env.local`
2. Verify you're authenticated: `npx sanity login`
3. Check project access: `npx sanity projects list`

### If App Shows Fallback Data
- Check Sanity Studio has content
- Verify environment variables
- Check browser console for errors
- Verify API token (if using one)

### Common Issues
1. **No Content Shows**: Create some content in the studio first
2. **Images Not Loading**: Check image URLs in Sanity, ensure they're uploaded properly
3. **Build Errors**: Check TypeScript types match Sanity schema

## 🎨 Content Types

### Project Schema
- Title, slug, descriptions
- Featured image
- Technologies array
- Category reference
- GitHub & live URLs
- Featured flag, display order

### Blog Post Schema  
- Title, slug, excerpt
- Rich text content with images/code
- Featured image
- Categories (multiple)
- Reading time, SEO metadata
- Published date

### Uses Item Schema
- Name, description, reasoning
- Product image, category
- URL, optional price
- Display order

### Category Schema
- Title, slug, description
- Color for UI theming

## 🔗 Useful Links
- [Sanity Studio](http://localhost:3333) (after running `npx sanity dev`)
- [Project Dashboard](https://www.sanity.io/manage/project/oauuua7l)
- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)

## 💡 Next Steps

1. Start the studio and create some initial content
2. Test that your app loads the content correctly
3. Deploy the studio: `npx sanity deploy`
4. Consider setting up webhooks for automatic rebuilds
5. Add more content types as needed

Your portfolio will automatically switch between Sanity content and fallback data based on availability!
