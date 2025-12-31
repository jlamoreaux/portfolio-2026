import { writeClient } from "../lib/sanity"

const categories = [
  {
    _type: "category",
    title: "AI/ML",
    slug: { current: "ai-ml" },
    description: "Artificial Intelligence and Machine Learning projects",
    color: "bg-orange-600",
  },
  {
    _type: "category",
    title: "Full-Stack",
    slug: { current: "full-stack" },
    description: "Full-stack web development projects",
    color: "bg-blue-500",
  },
  {
    _type: "category",
    title: "DevOps",
    slug: { current: "devops" },
    description: "DevOps and infrastructure projects",
    color: "bg-amber-500",
  },
  {
    _type: "category",
    title: "Career",
    slug: { current: "career" },
    description: "Career development and professional growth",
    color: "bg-orange-500",
  },
  {
    _type: "category",
    title: "Tutorial",
    slug: { current: "tutorial" },
    description: "Technical tutorials and guides",
    color: "bg-red-500",
  },
]

async function seedData() {
  try {
    console.log("Seeding categories...")

    for (const category of categories) {
      await writeClient.create(category)
      console.log(`Created category: ${category.title}`)
    }

    console.log("✅ Data seeding completed!")
  } catch (error) {
    console.error("❌ Error seeding data:", error)
  }
}

seedData()
