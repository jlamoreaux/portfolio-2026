import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { codeInput } from "@sanity/code-input"
import { schemaTypes } from "./sanity/schemas"

// Use environment variables with fallbacks
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'oauuua7l'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'dev'

export default defineConfig({
  name: "default",
  title: "Developer Portfolio",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Settings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.divider(),
            S.listItem().title("Social Links").child(S.documentTypeList("socialLink").title("Social Links")),
            S.divider(),
            S.listItem().title("Projects").child(S.documentTypeList("project").title("Projects")),
            S.listItem().title("Blog Posts").child(S.documentTypeList("blogPost").title("Blog Posts")),
            S.listItem().title("Uses Items").child(S.documentTypeList("usesItem").title("Uses Items")),
            S.listItem().title("Categories").child(S.documentTypeList("category").title("Categories")),
          ]),
    }),
    visionTool(),
    codeInput(),
  ],
  schema: {
    types: schemaTypes,
  },
})
