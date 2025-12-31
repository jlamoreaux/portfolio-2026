#!/usr/bin/env node

/**
 * Sample Content Creation Script for Sanity
 * 
 * This script creates sample content in your Sanity dataset to get you started.
 * Run with: node scripts/create-sample-content.mjs
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'oauuua7l',
  dataset: 'dev',
  useCdn: false,
  apiVersion: '2025-08-06',
  token: process.env.SANITY_PROJECT_TOKEN, // You'll need to set this in your .env file
})

const sampleCategories = [
  {
    _type: 'category',
    _id: 'web-apps',
    title: 'Web Applications',
    slug: { current: 'web-applications' },
    description: 'Full-stack web applications built with modern frameworks',
    color: 'bg-blue-500'
  },
  {
    _type: 'category',
    _id: 'apis',
    title: 'APIs & Backend',
    slug: { current: 'apis-backend' },
    description: 'RESTful APIs and backend services',
    color: 'bg-amber-500'
  },
  {
    _type: 'category',
    _id: 'tools',
    title: 'Developer Tools',
    slug: { current: 'developer-tools' },
    description: 'Tools and utilities for developers',
    color: 'bg-orange-600'
  },
  {
    _type: 'category',
    _id: 'ai-ml',
    title: 'AI & Machine Learning',
    slug: { current: 'ai-machine-learning' },
    description: 'Artificial Intelligence and ML projects',
    color: 'bg-orange-500'
  }
]

const sampleProjects = [
  {
    _type: 'project',
    title: 'Portfolio Website',
    slug: { current: 'portfolio-website' },
    description: 'A modern, responsive portfolio website built with Next.js and Tailwind CSS.',
    longDescription: 'This portfolio website showcases my work and skills using cutting-edge web technologies. Built with Next.js for optimal performance and SEO, styled with Tailwind CSS for rapid development, and integrated with Sanity CMS for content management.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Sanity CMS'],
    category: { _ref: 'web-apps' },
    liveUrl: 'https://yourname.dev',
    githubUrl: 'https://github.com/yourusername/portfolio',
    featured: true,
    order: 1,
    publishedAt: new Date().toISOString(),
  },
  {
    _type: 'project',
    title: 'Task Management API',
    slug: { current: 'task-management-api' },
    description: 'RESTful API for task management with user authentication and real-time updates.',
    longDescription: 'A comprehensive task management API built with Node.js and Express. Features include user authentication, CRUD operations for tasks, team collaboration, and real-time updates using WebSockets. The API is fully documented with OpenAPI/Swagger.',
    technologies: ['Node.js', 'Express.js', 'PostgreSQL', 'JWT', 'Socket.io'],
    category: { _ref: 'apis' },
    liveUrl: 'https://api.taskmanager.dev',
    githubUrl: 'https://github.com/yourusername/task-api',
    featured: true,
    order: 2,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
  },
  {
    _type: 'project',
    title: 'Code Snippet Manager',
    slug: { current: 'code-snippet-manager' },
    description: 'A developer tool for organizing and sharing code snippets with syntax highlighting.',
    longDescription: 'A web application that helps developers organize, search, and share code snippets. Features include syntax highlighting for multiple languages, tagging system, private/public snippets, and team collaboration features.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Prism.js', 'Material-UI'],
    category: { _ref: 'tools' },
    liveUrl: 'https://codesnippets.dev',
    githubUrl: 'https://github.com/yourusername/snippet-manager',
    featured: false,
    order: 3,
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
  }
]

const sampleBlogPosts = [
  {
    _type: 'blogPost',
    title: 'Getting Started with Next.js and TypeScript',
    slug: { current: 'getting-started-nextjs-typescript' },
    excerpt: 'Learn how to set up a modern web application using Next.js with TypeScript for better developer experience and type safety.',
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [{
          _type: 'span',
          text: 'Next.js with TypeScript provides an excellent developer experience for building modern web applications. In this guide, we\'ll explore how to set up a new project and leverage TypeScript\'s benefits.'
        }]
      }
    ],
    categories: [{ _ref: 'web-apps' }],
    readingTime: 5,
    featured: true,
    publishedAt: new Date().toISOString(),
    seo: {
      metaTitle: 'Next.js TypeScript Tutorial - Complete Guide',
      metaDescription: 'Complete guide to setting up Next.js with TypeScript including best practices and tips.'
    }
  },
  {
    _type: 'blogPost',
    title: 'Building RESTful APIs with Node.js',
    slug: { current: 'building-restful-apis-nodejs' },
    excerpt: 'A comprehensive guide to building scalable and maintainable RESTful APIs using Node.js and Express.',
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [{
          _type: 'span',
          text: 'Building robust APIs is crucial for modern web applications. This post covers best practices for creating RESTful APIs with Node.js, including authentication, validation, and error handling.'
        }]
      }
    ],
    categories: [{ _ref: 'apis' }],
    readingTime: 8,
    featured: true,
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    seo: {
      metaTitle: 'Node.js REST API Tutorial - Best Practices',
      metaDescription: 'Learn to build scalable RESTful APIs with Node.js following industry best practices.'
    }
  }
]

const sampleUsesItems = [
  {
    _type: 'usesItem',
    name: 'MacBook Pro M1',
    description: '14-inch MacBook Pro with M1 Pro chip',
    reasoning: 'Incredible performance for development work, excellent battery life, and the M1 chip handles everything I throw at it.',
    category: 'Hardware',
    url: 'https://apple.com/macbook-pro',
    price: '$1,999',
    order: 1
  },
  {
    _type: 'usesItem',
    name: 'Visual Studio Code',
    description: 'Lightweight but powerful source code editor',
    reasoning: 'Great extension ecosystem, excellent TypeScript support, and perfect integration with Git and debugging tools.',
    category: 'Software',
    url: 'https://code.visualstudio.com',
    price: 'Free',
    order: 1
  },
  {
    _type: 'usesItem',
    name: 'iTerm2',
    description: 'Terminal emulator for macOS',
    reasoning: 'Much better than the default Terminal app with features like split panes, search, and extensive customization options.',
    category: 'Development Tools',
    url: 'https://iterm2.com',
    price: 'Free',
    order: 1
  }
]

async function createSampleContent() {
  try {
    console.log('🚀 Creating sample content in Sanity...')
    
    // Check if we have a token
    if (!process.env.SANITY_PROJECT_TOKEN) {
      console.log('⚠️  SANITY_PROJECT_TOKEN not found in environment variables.')
      console.log('   You can create content manually in the Sanity Studio instead.')
      console.log('   Run: npx sanity dev --port 3333')
      return
    }

    // Create categories first (they're referenced by other content)
    console.log('📁 Creating categories...')
    const categoryResults = await Promise.all(
      sampleCategories.map(category => client.create(category))
    )
    console.log(`   ✅ Created ${categoryResults.length} categories`)

    // Create projects
    console.log('💼 Creating projects...')
    const projectResults = await Promise.all(
      sampleProjects.map(project => client.create(project))
    )
    console.log(`   ✅ Created ${projectResults.length} projects`)

    // Create blog posts
    console.log('📝 Creating blog posts...')
    const blogResults = await Promise.all(
      sampleBlogPosts.map(post => client.create(post))
    )
    console.log(`   ✅ Created ${blogResults.length} blog posts`)

    // Create uses items
    console.log('🛠 Creating uses items...')
    const usesResults = await Promise.all(
      sampleUsesItems.map(item => client.create(item))
    )
    console.log(`   ✅ Created ${usesResults.length} uses items`)

    console.log('\n🎉 Sample content created successfully!')
    console.log('\n📝 Next steps:')
    console.log('   1. Start the studio: npx sanity dev --port 3333')
    console.log('   2. Visit http://localhost:3333 to edit content')
    console.log('   3. Start your app: npm run dev')
    console.log('   4. Your app should now load content from Sanity!')

  } catch (error) {
    console.error('❌ Error creating sample content:', error)
    console.log('\n💡 Try these troubleshooting steps:')
    console.log('   1. Make sure SANITY_PROJECT_TOKEN is set in your .env file')
    console.log('   2. Verify the token has write permissions')
    console.log('   3. Check that your project ID and dataset are correct')
    console.log('   4. Create content manually in the Sanity Studio')
  }
}

// Run the script
createSampleContent()
