import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

// Tag fields accept a single string or a list of strings. Allowed values are
// defined in .github/actions/validTagsList.json (checked by the tag validation action).
const tagField = z.union([z.array(z.string()), z.string()]).nullish();

// Projects frontmatter
const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    maintainer: z.string(),
    // Where the project is hosted. GitHub and Figshare links are fetched at build time.
    "repository link": z.string(),
    "documentation link": z.string().optional(),
    "how to cite text": z.string().nullish(),
    "how to cite link": z.string().nullish(),
    "preferred contact method": z.string().optional(),
    "additional links array": z.array(z.string()).optional(),
    "additional links text array": z.array(z.string()).optional(),
    "image file": z.string().optional(),
    "image caption": z.string().optional(),
    "youtube url": z.string().optional(),
    "youtube caption": z.string().optional(),
    "youtube params": z.string().optional(),
    // Tag fields
    "file types": tagField,
    license: tagField,
    "hardware type": tagField,
    "development team": tagField,
    "CAD/EDA": tagField,
    "use case": tagField,
  }),
});

// Export all content frontmatter configurations
export const collections = {
  projects: projectsCollection,
};
