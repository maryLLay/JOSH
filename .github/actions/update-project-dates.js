import { readFileSync, writeFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import yaml from "yaml";

// Fills in the "update_date" frontmatter field of every project file from the
// project's "repository link", to power the site's "Last updated" sort:
//   GitHub links   -> the repository's last push date
//   Figshare links -> the record's last modified date
// Projects hosted anywhere else are skipped, so an update_date set by hand for
// them is left alone.

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECTS_DIR = join(__dirname, "..", "..", "src", "content", "projects");
const FETCH_TIMEOUT_MS = 15000;

// Optional: raises GitHub's rate limit. Not needed for a small number of projects.
const githubToken = process.env.GITHUB_TOKEN;

// extracts the frontmatter block, split into the pieces needed to splice a
// single field back in without reserializing (and reformatting) the rest of it
function extractFrontMatter(content) {
  const match = content.match(/^(---\n)([\s\S]+?)(\n---)/);
  return match
    ? { full: match[0], prefix: match[1], body: match[2], suffix: match[3] }
    : null;
}

// Returns { kind: "github", owner, repo } | { kind: "figshare", id } | null
function parseRepositoryLink(repositoryLink) {
  let url;
  try {
    url = new URL(repositoryLink);
  } catch {
    return null;
  }
  const hostname = url.hostname.toLowerCase();
  const parts = url.pathname.split("/").filter(Boolean);

  if (hostname === "github.com" || hostname === "www.github.com") {
    if (parts.length < 2) return null;
    return { kind: "github", owner: parts[0], repo: parts[1].replace(/\.git$/, "") };
  }
  if (hostname === "figshare.com" || hostname.endsWith(".figshare.com")) {
    // article id is the last purely numeric path segment; ?file=... is ignored
    const id = [...parts].reverse().find((part) => /^\d+$/.test(part));
    return id ? { kind: "figshare", id } : null;
  }
  return null;
}

async function getJson(url, headers = {}) {
  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "update-project-dates", ...headers },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`${url} responded with ${response.status}`);
  }
  return response.json();
}

// Returns an ISO timestamp for the project's last update
async function fetchUpdatedAt(source) {
  if (source.kind === "github") {
    const repo = await getJson(
      `https://api.github.com/repos/${source.owner}/${source.repo}`,
      {
        Accept: "application/vnd.github+json",
        ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
      }
    );
    return repo.pushed_at;
  }
  const record = await getJson(`https://api.figshare.com/v2/articles/${source.id}`);
  return record.modified_date || record.published_date;
}

function upsertField(frontMatterBody, key, value) {
  const lineRegex = new RegExp(`^${key}:.*$`, "m");
  const newLine = `${key}: ${value}`;
  if (lineRegex.test(frontMatterBody)) {
    return frontMatterBody.replace(lineRegex, newLine);
  }
  const repositoryLinkRegex = /^(repository link:.*)$/m;
  if (repositoryLinkRegex.test(frontMatterBody)) {
    return frontMatterBody.replace(repositoryLinkRegex, `$1\n${newLine}`);
  }
  return `${frontMatterBody}\n${newLine}`;
}

// 1. gather project files and the source their "repository link" points to
const projectFiles = readdirSync(PROJECTS_DIR).filter(
  (file) => file.endsWith(".md") && !file.startsWith("_")
);

const projects = [];
for (const file of projectFiles) {
  const filePath = join(PROJECTS_DIR, file);
  const content = readFileSync(filePath, "utf8");
  const frontMatter = extractFrontMatter(content);
  if (!frontMatter) {
    console.warn(`Skipping ${file}: no frontmatter found.`);
    continue;
  }

  const repositoryLink = yaml.parse(frontMatter.body)["repository link"];
  const source = repositoryLink ? parseRepositoryLink(repositoryLink) : null;
  if (!source) {
    console.log(
      `Skipping ${file}: "repository link" is not a GitHub or Figshare link (${repositoryLink}).`
    );
    continue;
  }

  projects.push({ file, filePath, content, frontMatter, source });
}

// 2. look up each unique source once
const sourceKey = (source) =>
  source.kind === "github"
    ? `github:${source.owner}/${source.repo}`.toLowerCase()
    : `figshare:${source.id}`;
const uniqueSources = [
  ...new Map(projects.map((p) => [sourceKey(p.source), p.source])).values(),
];

const updatedAtBySource = {};
await Promise.all(
  uniqueSources.map(async (source) => {
    try {
      const updatedAt = await fetchUpdatedAt(source);
      if (!updatedAt) throw new Error("no date returned");
      updatedAtBySource[sourceKey(source)] = updatedAt;
    } catch (error) {
      console.warn(`Could not get an update date for ${sourceKey(source)}: ${error.message}`);
    }
  })
);

if (uniqueSources.length > 0 && Object.keys(updatedAtBySource).length === 0) {
  console.error("No update dates could be fetched. Leaving all files unchanged.");
  process.exit(1);
}

// 3. splice the resulting update_date into each project's frontmatter
let updatedCount = 0;
for (const project of projects) {
  const updatedAt = updatedAtBySource[sourceKey(project.source)];
  if (!updatedAt) continue;

  const updateDate = updatedAt.slice(0, 10); // YYYY-MM-DD
  const newBody = upsertField(project.frontMatter.body, "update_date", updateDate);
  if (newBody === project.frontMatter.body) continue;

  const newContent = project.content.replace(
    project.frontMatter.full,
    `${project.frontMatter.prefix}${newBody}${project.frontMatter.suffix}`
  );
  writeFileSync(project.filePath, newContent);
  updatedCount++;
}

console.log(`Updated update_date in ${updatedCount} project file(s).`);
