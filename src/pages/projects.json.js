import { getCollection } from "astro:content";
import Fuse from "fuse.js";

async function getProjects() {
  const allProjects = await getCollection("projects");
  return allProjects.map((project) => ({
    title: project.data.title,
    tagline: project.data.tagline,
    "repository link": project.data["repository link"],
    "documentation link": project.data["documentation link"],
    "how to cite text": project.data["how to cite text"],
    "how to cite link": project.data["how to cite link"],
    "additional links array": project.data["additional links array"],
    "additional links text array": project.data["additional links text array"],
    "image file": project.data["image file"],
    "image caption": project.data["image caption"],
    "youtube url": project.data["youtube url"],
    "youtube caption": project.data["youtube caption"],
    "development team": project.data["development team"],
    "file types": project.data["file types"],
    license: project.data.license,
    "hardware type": project.data["hardware type"],
    "CAD/EDA": project.data["CAD/EDA"],
    "use case": project.data["use case"],
    body: project.body,
  }));
}

// Note - "GET" must be all uppercase. Lowercase threw an error.
export async function GET({}) {
  const projects = await getProjects();
  const projectsIndex = Fuse.createIndex(
    [
      "title",
      "tagline",
      "how to cite text",
      "development team",
      "file types",
      "license",
      "hardware type",
      "CAD/EDA",
      "use case",
      "body",
    ],
    projects
  );
  return new Response(
    JSON.stringify(
      { projects, index: projectsIndex.toJSON() },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  );
}
