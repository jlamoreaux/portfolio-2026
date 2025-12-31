import { defineField, defineType } from "sanity"

export const socialLink = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Platform Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: {
        list: [
          { title: "Mail", value: "Mail" },
          { title: "X (Twitter)", value: "X" },
          { title: "GitHub", value: "Github" },
          { title: "LinkedIn", value: "Linkedin" },
          { title: "YouTube", value: "Youtube" },
          { title: "Instagram", value: "Instagram" },
          { title: "Facebook", value: "Facebook" },
          { title: "Twitch", value: "Twitch" },
          { title: "Discord", value: "MessageCircle" },
          { title: "Website", value: "Globe" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["http", "https", "mailto"],
        }),
    }),
    defineField({
      name: "handle",
      title: "Handle/Username",
      type: "string",
      description: "e.g., @username or email address",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      description: "Short description like 'Follow my journey'",
    }),
    defineField({
      name: "color",
      title: "Hover Color",
      type: "string",
      options: {
        list: [
          { title: "Red", value: "hover:text-red-500" },
          { title: "Blue", value: "hover:text-blue-500" },
          { title: "Blue Dark", value: "hover:text-blue-600" },
          { title: "Orange", value: "hover:text-orange-500" },
          { title: "Green", value: "hover:text-green-500" },
          { title: "Purple", value: "hover:text-purple-500" },
          { title: "Pink", value: "hover:text-pink-500" },
          { title: "Gray", value: "hover:text-gray-900 dark:hover:text-gray-100" },
        ],
      },
      initialValue: "hover:text-blue-500",
    }),
    defineField({
      name: "primary",
      title: "Show in Footer",
      type: "boolean",
      initialValue: true,
      description: "Display this link in the footer",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "handle",
    },
  },
})
