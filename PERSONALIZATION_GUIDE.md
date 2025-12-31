# Portfolio Personalization Guide

This guide will help you customize your portfolio with your personal information.

## Files Updated

The following JSON files in the `/data` directory have been updated with placeholder content:

### 1. `/data/site-config.json`
Contains your personal information, hero section content, and contact details.

**Fields to customize:**
- `personal.name`: Your full name
- `personal.title`: Your professional title
- `personal.email`: Your email address
- `personal.location`: Your city/location
- `personal.company`: Your current company
- `personal.role`: Your current role
- `personal.previousRole`: Your previous role
- `personal.avatar`: Path to your profile image
- `hero.title.line1`: First line of hero title
- `hero.title.line2`: Second line of hero title
- `hero.description`: Your personal description
- `hero.technologies`: Array of technologies you work with
- `contact.availability.message`: Your availability status
- `contact.bestTopics`: Topics you're interested in discussing

### 2. `/data/social-links.json`
Your social media and contact links.

**Fields to customize:**
- Update `href` fields with your actual social media URLs
- Update `handle` fields with your usernames
- Modify `description` fields as needed

### 3. `/data/sections.json`
Section titles and descriptions for different parts of your site.

**Fields to customize:**
- `work.description`: Description of your work section
- `blog.description`: Description of your blog section
- `uses.lastUpdated`: When you last updated your tools list

### 4. `/data/navigation.json`
Navigation menu items and descriptions.

**Fields to customize:**
- `description` fields for each navigation item

## Components Updated

### `/app/layout.tsx` and `/app/page.tsx`
Updated metadata and page titles to use generic content.

### `/components/konami-terminal.tsx`
Updated the Easter egg terminal with generic developer information.

## Steps to Personalize

1. **Replace placeholder text:**
   - Go through each JSON file and replace "Your Name", "Your Company", etc. with your actual information
   - Update email addresses, social media handles, and URLs

2. **Add your profile image:**
   - Add your profile image to the `/public` directory
   - Update the `avatar` path in `site-config.json`

3. **Customize technologies:**
   - Update the `technologies` array in `site-config.json` with your tech stack

4. **Update metadata:**
   - The layout.tsx file contains SEO metadata - update the URL, Twitter handle, etc.

5. **Test the changes:**
   - Run `npm run dev` to see your changes
   - Check that all sections display your information correctly

6. **Optional: Update the terminal Easter egg:**
   - Press Up, Up, Down, Down, Left, Right, Left, Right, B, A to open the terminal
   - The commands can be customized in the `konami-terminal.tsx` component

## Tips

- Keep descriptions concise but informative
- Ensure all URLs are valid and working
- Test social media links to make sure they point to your profiles
- Consider your target audience when writing descriptions
- Make sure your email address is correct for the contact form

## Files That Use This Data

The JSON configuration is imported and used by:
- `lib/config.ts` - Main configuration service
- `components/hero-section.tsx` - Hero section
- `components/header.tsx` - Navigation header
- `components/contact-section.tsx` - Contact section
- `components/footer.tsx` - Footer
- And other components throughout the site

All hardcoded placeholder content has been replaced with data from these JSON files, so updating the JSON files will automatically update the entire site.
