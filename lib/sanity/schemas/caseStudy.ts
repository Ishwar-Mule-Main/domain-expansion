import { defineType, defineField } from "sanity";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({
      name: "clientName",
      title: "Client Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title / Headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "clientName",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Marketing", value: "marketing" },
          { title: "Development", value: "development" },
          { title: "Design", value: "design" },
          { title: "AI", value: "ai" },
        ],
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "challengeHeadline",
      title: "Challenge Headline",
      type: "string",
    }),
    defineField({
      name: "challengeDescription",
      title: "Challenge Description",
      type: "text",
    }),
    defineField({
      name: "approachDescription",
      title: "Approach Description",
      type: "text",
    }),
    defineField({
      name: "resultsDescription",
      title: "Results Description",
      type: "text",
    }),
    defineField({
      name: "metrics",
      title: "Metrics",
      type: "array",
      of: [
        {
          type: "object",
          name: "metric",
          fields: [
            { name: "value", title: "Value (e.g. +320%)", type: "string" },
            { name: "label", title: "Label (e.g. Organic Traffic)", type: "string" },
          ],
        },
      ],
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "gallery",
      title: "Visual Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "testimonial",
      title: "Client Testimonial",
      type: "object",
      fields: [
        { name: "quote", title: "Quote", type: "text" },
        { name: "author", title: "Author", type: "string" },
        { name: "role", title: "Role/Title", type: "string" },
        { name: "photo", title: "Author Photo", type: "image" },
      ],
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "featured",
      title: "Featured Case Study",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
