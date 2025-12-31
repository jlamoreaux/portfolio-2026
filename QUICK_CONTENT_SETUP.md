# 🚀 Quick Content Setup Guide

## Start the Sanity Studio

```bash
npx sanity dev --port 3333
```

Then visit: **http://localhost:3333**

## Create Content in This Order:

### 1. Create Categories First 📁
Go to "Categories" and create:

**Web Applications**
- Title: `Web Applications`
- Slug: `web-applications` (auto-generated)
- Description: `Full-stack web applications built with modern frameworks`
- Color: `Blue`

**APIs & Backend**
- Title: `APIs & Backend`  
- Slug: `apis-backend`
- Description: `RESTful APIs and backend services`
- Color: `Green`

**Developer Tools**
- Title: `Developer Tools`
- Slug: `developer-tools`  
- Description: `Tools and utilities for developers`
- Color: `Purple`

### 2. Create a Sample Project 💼
Go to "Projects" and create:

**Portfolio Website**
- Title: `Portfolio Website`
- Slug: `portfolio-website`
- Short Description: `A modern, responsive portfolio website built with Next.js and Tailwind CSS.`
- Long Description: `This portfolio website showcases my work and skills using cutting-edge web technologies. Built with Next.js for optimal performance and SEO, styled with Tailwind CSS for rapid development, and integrated with Sanity CMS for content management.`
- Technologies: `Next.js`, `React`, `TypeScript`, `Tailwind CSS`, `Sanity CMS`
- Category: Select "Web Applications"
- Live URL: `https://yourname.dev`
- GitHub URL: `https://github.com/yourusername/portfolio`
- Featured Project: ✅ Yes
- Display Order: `1`

### 3. Create a Sample Blog Post 📝
Go to "Blog Posts" and create:

**Getting Started with Next.js and TypeScript**
- Title: `Getting Started with Next.js and TypeScript`
- Slug: `getting-started-nextjs-typescript`
- Excerpt: `Learn how to set up a modern web application using Next.js with TypeScript for better developer experience and type safety.`
- Content: Write a few paragraphs about Next.js and TypeScript
- Categories: Select "Web Applications"
- Reading Time: `5`
- Featured Post: ✅ Yes
- SEO Meta Title: `Next.js TypeScript Tutorial - Complete Guide`
- SEO Meta Description: `Complete guide to setting up Next.js with TypeScript including best practices and tips.`

### 4. Create Sample Uses Items 🛠
Go to "Uses Items" and create a few:

**MacBook Pro M1**
- Name: `MacBook Pro M1`
- Description: `14-inch MacBook Pro with M1 Pro chip`
- Why I Use This: `Incredible performance for development work, excellent battery life, and the M1 chip handles everything I throw at it.`
- Category: `Hardware`
- URL: `https://apple.com/macbook-pro`
- Price: `$1,999`
- Display Order: `1`

**Visual Studio Code**
- Name: `Visual Studio Code`
- Description: `Lightweight but powerful source code editor`
- Why I Use This: `Great extension ecosystem, excellent TypeScript support, and perfect integration with Git and debugging tools.`
- Category: `Software`
- URL: `https://code.visualstudio.com`
- Price: `Free`
- Display Order: `1`

## Test Your Site

After creating some content:

1. **Start your Next.js app**: `npm run dev`
2. **Visit**: http://localhost:3000
3. **Check**: Your content should now load from Sanity instead of showing demo data

## ✅ Success Indicators

- ✅ Status banner should say "Connected to Sanity CMS"
- ✅ Your real projects/posts appear on the site
- ✅ Images you uploaded in Sanity display correctly
- ✅ Content updates in Sanity appear immediately on your site

## 🎉 You're Done!

Your portfolio now has:
- A professional CMS for managing content
- Automatic fallbacks if content is missing
- Real-time updates when you change content
- Professional image handling and optimization

## Next Steps

1. **Add more content** - projects, blog posts, tools
2. **Upload images** - replace placeholder images with real ones
3. **Customize** - update the JSON config files with your personal info
4. **Deploy** - when ready, deploy both your site and Sanity studio

Need help? Check `SANITY_SETUP_GUIDE.md` for detailed troubleshooting and advanced features!
