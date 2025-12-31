import type { Project, BlogPost, UsesItem, Category, SiteSettings, SanitySocialLink } from "./types"

export const fallbackCategories: Category[] = [
  {
    _id: "ai-ml",
    title: "AI/ML",
    slug: { current: "ai-ml" },
    description: "Artificial Intelligence and Machine Learning projects",
    color: "bg-orange-600",
  },
  {
    _id: "full-stack",
    title: "Full-Stack",
    slug: { current: "full-stack" },
    description: "Full-stack web development projects",
    color: "bg-blue-500",
  },
  {
    _id: "devops",
    title: "DevOps",
    slug: { current: "devops" },
    description: "DevOps and infrastructure projects",
    color: "bg-amber-500",
  },
]

export const fallbackProjects: Project[] = [
  {
    _id: "1",
    title: "AI Model Deployment Platform",
    slug: { current: "ai-deployment-platform" },
    description: "Streamlined platform for deploying ML models with auto-scaling and monitoring.",
    longDescription:
      "Built a comprehensive platform that simplifies ML model deployment with features like auto-scaling, real-time monitoring, and A/B testing capabilities. Reduced deployment time by 80%.",
    image: {
      _type: "image",
      asset: {
        _ref: "fallback",
        _type: "reference",
      },
    },
    technologies: ["React", "Node.js", "Docker", "Kubernetes", "TensorFlow"],
    category: fallbackCategories[0],
    liveUrl: "https://ai-deploy.example.com",
    githubUrl: "https://github.com/yourusername/ai-deploy",
    featured: true,
    publishedAt: "2024-01-15T00:00:00Z",
  },
  {
    _id: "2",
    title: "Real-time Chat Analytics",
    slug: { current: "chat-analytics" },
    description: "Advanced analytics dashboard for customer support conversations.",
    longDescription:
      "Developed a real-time analytics system that processes thousands of support conversations, providing insights on sentiment, resolution time, and customer satisfaction.",
    image: {
      _type: "image",
      asset: {
        _ref: "fallback",
        _type: "reference",
      },
    },
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Chart.js"],
    category: fallbackCategories[1],
    liveUrl: "https://chat-analytics.example.com",
    githubUrl: "https://github.com/yourusername/chat-analytics",
    featured: true,
    publishedAt: "2024-01-10T00:00:00Z",
  },
  {
    _id: "3",
    title: "Computer Vision API",
    slug: { current: "computer-vision-api" },
    description: "RESTful API for image classification and object detection tasks.",
    longDescription:
      "Created a scalable computer vision API that handles image classification, object detection, and facial recognition with 99.2% accuracy. Processes over 10M images daily.",
    image: {
      _type: "image",
      asset: {
        _ref: "fallback",
        _type: "reference",
      },
    },
    technologies: ["Python", "FastAPI", "PyTorch", "OpenCV", "AWS"],
    category: fallbackCategories[0],
    liveUrl: "https://vision-api.example.com",
    githubUrl: "https://github.com/yourusername/vision-api",
    featured: false,
    publishedAt: "2024-01-05T00:00:00Z",
  },
]

export const fallbackBlogPosts: BlogPost[] = [
  {
    _id: "1",
    title: "From Support Engineering to AI Development: My Journey",
    slug: { current: "support-to-ai-journey" },
    excerpt:
      "How I transitioned from helping customers solve problems to building AI solutions that solve problems at scale.",
    image: {
      _type: "image",
      asset: {
        _ref: "fallback",
        _type: "reference",
      },
    },
    categories: [fallbackCategories[0]],
    readingTime: 8,
    featured: true,
    publishedAt: "2024-01-15T00:00:00Z",
  },
  {
    _id: "2",
    title: "Building Scalable ML Pipelines with Next.js and Python",
    slug: { current: "scalable-ml-pipelines" },
    excerpt: "A deep dive into creating robust machine learning pipelines that can handle production workloads.",
    image: {
      _type: "image",
      asset: {
        _ref: "fallback",
        _type: "reference",
      },
    },
    categories: [fallbackCategories[0], fallbackCategories[1]],
    readingTime: 12,
    featured: true,
    publishedAt: "2024-01-08T00:00:00Z",
  },
  {
    _id: "3",
    title: "The Future of AI in Web Development",
    slug: { current: "ai-future-web-dev" },
    excerpt: "Exploring how artificial intelligence is reshaping the way we build and interact with web applications.",
    image: {
      _type: "image",
      asset: {
        _ref: "fallback",
        _type: "reference",
      },
    },
    categories: [fallbackCategories[0]],
    readingTime: 6,
    featured: false,
    publishedAt: "2024-01-01T00:00:00Z",
  },
]

export const fallbackUsesItems: UsesItem[] = [
  {
    _id: "1",
    name: 'MacBook Pro 16" M3 Max',
    description: "Primary development machine with 64GB RAM and 2TB SSD",
    reasoning:
      'The M3 Max handles ML model training and multiple development environments effortlessly. The 16" screen provides excellent real estate for coding.',
    image: {
      _type: "image",
      asset: {
        _ref: "fallback",
        _type: "reference",
      },
    },
    category: "Hardware",
    url: "https://apple.com/macbook-pro",
    price: "$4,299",
  },
  {
    _id: "2",
    name: "VS Code",
    description: "Primary code editor with extensive AI and ML extensions",
    reasoning:
      "Excellent Python and TypeScript support, integrated terminal, and amazing extension ecosystem for AI development.",
    image: {
      _type: "image",
      asset: {
        _ref: "fallback",
        _type: "reference",
      },
    },
    category: "Software",
    url: "https://code.visualstudio.com",
  },
  {
    _id: "3",
    name: "Docker Desktop",
    description: "Containerization platform for consistent development environments",
    reasoning:
      "Essential for ML model deployment and ensuring consistency across development, staging, and production environments.",
    image: {
      _type: "image",
      asset: {
        _ref: "fallback",
        _type: "reference",
      },
    },
    category: "Development Tools",
    url: "https://docker.com",
  },
  {
    _id: "4",
    name: "Herman Miller Aeron Chair",
    description: "Ergonomic office chair with full adjustability",
    reasoning:
      "Investing in ergonomics is crucial for long coding sessions. This chair has saved my back during intense development sprints.",
    image: {
      _type: "image",
      asset: {
        _ref: "fallback",
        _type: "reference",
      },
    },
    category: "Office Setup",
    url: "https://hermanmiller.com",
    price: "$1,395",
  },
]

export const fallbackSiteSettings: SiteSettings = {
  name: "Your Name",
  title: "Software Developer",
  email: "your.email@example.com",
  location: "Your City, State",
  company: "Your Company",
  role: "Your Current Role",
  previousRole: "Your Previous Role",
  avatar: "/placeholder.svg?height=128&width=128",
  heroTitleLine1: "Software Developer",
  heroTitleLine2: "& Problem Solver",
  heroDescription: "Passionate about creating innovative solutions and building exceptional user experiences. Let's build something amazing together.",
  heroPrimaryCta: "View Projects",
  heroPrimaryCtaHref: "/projects",
  heroSecondaryCta: "Read Blog",
  heroSecondaryCtaHref: "#blog",
  technologies: ["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL"],
  availabilityStatus: "available",
  availabilityMessage: "Open to new opportunities and interesting projects",
  responseTime: "I typically respond within 24-48 hours across all platforms",
  bestTopics: [
    "Web development projects",
    "Technical consulting",
    "Collaboration opportunities",
    "Open source contributions",
  ],
  contactCtaTitle: "Ready to Build Something Amazing?",
  contactCtaDescription: "Whether you have a project in mind, need technical expertise, or want to discuss development opportunities, I'd love to hear from you.",
  copyrightText: "Your Name. All rights reserved.",
  builtWithText: "Built with Next.js, TypeScript, and Tailwind CSS",
}

export const fallbackSocialLinks: SanitySocialLink[] = [
  {
    _id: "email",
    name: "Email",
    icon: "Mail",
    href: "mailto:your.email@example.com",
    handle: "your.email@example.com",
    description: "Drop me a line",
    color: "hover:text-red-500",
    primary: true,
  },
  {
    _id: "twitter",
    name: "X",
    icon: "X",
    href: "https://x.com/yourusername",
    handle: "@yourusername",
    description: "Follow my journey",
    color: "hover:text-gray-900 dark:hover:text-gray-100",
    primary: true,
  },
  {
    _id: "github",
    name: "GitHub",
    icon: "Github",
    href: "https://github.com/yourusername",
    handle: "@yourusername",
    description: "Check out my code",
    color: "hover:text-gray-900 dark:hover:text-gray-100",
    primary: true,
  },
  {
    _id: "linkedin",
    name: "LinkedIn",
    icon: "Linkedin",
    href: "https://linkedin.com/in/yourprofile",
    handle: "yourprofile",
    description: "Let's connect professionally",
    color: "hover:text-blue-600",
    primary: true,
  },
]
