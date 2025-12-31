"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Filter, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/image-utils";
import { getSections } from "@/lib/config";
import type { Project, Category } from "@/lib/types";

interface ProjectShowcaseProps {
  initialProjects: Project[];
  initialCategories: Category[];
  isStandalonePage?: boolean;
}

export function ProjectShowcase({
  initialProjects,
  initialCategories,
  isStandalonePage = false,
}: ProjectShowcaseProps) {
  const [projects] = useState<Project[]>(initialProjects);
  const [categories] = useState<Category[]>([
    { _id: "all", title: "All", slug: { current: "all" } } as Category,
    ...initialCategories.filter(
      (cat) => initialProjects.some((p) => p.category?.title === cat.title)
    ),
  ]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  const sections = getSections();

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter(
          (project) => project.category.title === selectedCategory
        );

  return (
    <section className={`py-20 ${isStandalonePage ? "" : "bg-muted/30"}`}>
      <div className="container mx-auto px-4">
        {/* Back button for standalone page */}
        {isStandalonePage && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Button variant="ghost" asChild className="group">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
            </Button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1
            className={`${isStandalonePage ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"} font-bold mb-4`}
          >
            {sections.work.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {isStandalonePage
              ? "Explore my complete portfolio of projects, from AI/ML applications to full-stack web development."
              : sections.work.description}
          </p>
          {isStandalonePage && (
            <p className="text-sm text-muted-foreground mt-4">
              {projects.length} project{projects.length !== 1 ? "s" : ""} •
              Updated regularly
            </p>
          )}
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category._id}
              variant={
                selectedCategory === category.title ? "default" : "outline"
              }
              onClick={() => setSelectedCategory(category.title)}
              className="flex items-center gap-2"
              title={`${sections.work.filterLabel}: ${category.title}`}
            >
              <Filter className="h-4 w-4" />
              {category.title}
              {category.title !== "All" && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {
                    projects.filter((p) => p.category.title === category.title)
                      .length
                  }
                </Badge>
              )}
            </Button>
          ))}
        </motion.div>

        {/* Backdrop overlay when card is flipped */}
        <AnimatePresence>
          {flippedCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setFlippedCard(null)}
            />
          )}
        </AnimatePresence>

        {/* Projects Grid */}
        <motion.div
          className={`grid grid-cols-1 md:grid-cols-2 ${isStandalonePage ? "xl:grid-cols-3" : "lg:grid-cols-3"} gap-8`}
          layout
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  layout: { duration: 0.3 },
                }}
                className="group perspective-1000 relative"
                style={{ zIndex: flippedCard === project._id ? 50 : 1 }}
                onHoverStart={() => setFlippedCard(project._id)}
                onHoverEnd={() => setFlippedCard(null)}
                onClick={() =>
                  setFlippedCard(
                    flippedCard === project._id ? null : project._id
                  )
                }
              >
                <motion.div
                  className="relative w-full h-[400px] preserve-3d cursor-pointer"
                  animate={{
                    rotateY: flippedCard === project._id ? 180 : 0,
                    scale: flippedCard === project._id ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  {/* Front of card */}
                  <Card className="absolute inset-0 backface-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <Image
                          src={
                            getImageUrl(project.image, 400, 200) ||
                            "/placeholder.svg"
                          }
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        {project.featured && (
                          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-semibold mb-2">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 flex-1">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies
                            .slice(0, 3)
                            .map((tech, techIndex) => (
                              <Badge
                                key={`${tech}-${techIndex}`}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tech}
                              </Badge>
                            ))}
                          {project.technologies.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Back of card */}
                  <Card className="absolute inset-0 backface-hidden rotate-y-180 border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardContent className="p-6 h-full flex flex-col overflow-y-auto">
                      <h3 className="text-xl font-semibold mb-3">
                        {project.title}
                      </h3>
                      <div className="flex gap-3 mb-4">
                        <Button size="sm" className="flex-1" asChild>
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Live Demo
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent"
                          asChild
                        >
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="h-4 w-4 mr-2" />
                            Code
                          </a>
                        </Button>
                      </div>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {project.longDescription}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge
                            key={`${tech}-${techIndex}`}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No results message */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">
              No projects found in this category.
            </p>
            <Button
              variant="ghost"
              onClick={() => setSelectedCategory("All")}
              className="mt-4"
            >
              View All Projects
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
