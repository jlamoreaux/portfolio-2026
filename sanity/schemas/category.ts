import { defineField, defineType } from "sanity"

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      options: {
        list: [
          { title: "Blue", value: "bg-blue-500" },
          { title: "Amber", value: "bg-amber-500" },
          { title: "Orange", value: "bg-orange-500" },
          { title: "Orange Dark", value: "bg-orange-600" },
          { title: "Red", value: "bg-red-500" },
          { title: "Yellow", value: "bg-yellow-500" },
        ],
      },
      initialValue: "bg-orange-500",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
})
