import { defineField, defineType } from "sanity"

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "personal", title: "Personal Info" },
    { name: "hero", title: "Hero Section" },
    { name: "contact", title: "Contact Section" },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    // Personal Info
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "personal",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Professional Title",
      type: "string",
      group: "personal",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "personal",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "personal",
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
      group: "personal",
    }),
    defineField({
      name: "role",
      title: "Current Role",
      type: "string",
      group: "personal",
    }),
    defineField({
      name: "previousRole",
      title: "Previous Role",
      type: "string",
      group: "personal",
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "image",
      group: "personal",
      options: {
        hotspot: true,
      },
    }),

    // Hero Section
    defineField({
      name: "heroTitleLine1",
      title: "Hero Title - Line 1",
      type: "string",
      group: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroTitleLine2",
      title: "Hero Title - Line 2",
      type: "string",
      group: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
      rows: 3,
      group: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroPrimaryCta",
      title: "Primary CTA Text",
      type: "string",
      group: "hero",
      initialValue: "View Projects",
    }),
    defineField({
      name: "heroPrimaryCtaHref",
      title: "Primary CTA Link",
      type: "string",
      group: "hero",
      initialValue: "/projects",
    }),
    defineField({
      name: "heroSecondaryCta",
      title: "Secondary CTA Text",
      type: "string",
      group: "hero",
      initialValue: "Read Blog",
    }),
    defineField({
      name: "heroSecondaryCtaHref",
      title: "Secondary CTA Link",
      type: "string",
      group: "hero",
      initialValue: "#blog",
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      type: "array",
      of: [{ type: "string" }],
      group: "hero",
      description: "List of technologies shown in the hero section",
    }),

    // Contact Section
    defineField({
      name: "availabilityStatus",
      title: "Availability Status",
      type: "string",
      group: "contact",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Limited Availability", value: "limited" },
          { title: "Not Available", value: "unavailable" },
        ],
      },
      initialValue: "available",
    }),
    defineField({
      name: "availabilityMessage",
      title: "Availability Message",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "responseTime",
      title: "Response Time",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "bestTopics",
      title: "Best Topics for Discussion",
      type: "array",
      of: [{ type: "string" }],
      group: "contact",
    }),
    defineField({
      name: "contactCtaTitle",
      title: "Contact CTA Title",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "contactCtaDescription",
      title: "Contact CTA Description",
      type: "text",
      rows: 2,
      group: "contact",
    }),

    // Footer
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      group: "footer",
      description: "e.g., 'Your Name. All rights reserved.'",
    }),
    defineField({
      name: "builtWithText",
      title: "Built With Text",
      type: "string",
      group: "footer",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "title",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Site Settings",
        subtitle: subtitle || "Configure your site",
      }
    },
  },
})
