import sanitizeHtml from "sanitize-html";

// Build-time helpers for the "repository link" frontmatter field.
// The host in the URL decides how a project's details are fetched:
//   github.com   -> rendered README (GitHub API)
//   figshare.com -> record metadata (Figshare API)
//   anything else -> nothing is fetched; the page falls back to the markdown body
// All fetched data is display-only. Tags and filters always come from frontmatter.

const FETCH_TIMEOUT_MS = 15000;
const cache = new Map();

// Returns "github", "figshare" or "other" (or "none" for a missing/invalid URL)
export function getRepoHost(repoUrl) {
  try {
    const hostname = new URL(repoUrl).hostname.toLowerCase();
    if (hostname === "github.com" || hostname === "www.github.com") {
      return "github";
    }
    if (hostname === "figshare.com" || hostname.endsWith(".figshare.com")) {
      return "figshare";
    }
    return "other";
  } catch {
    return "none";
  }
}

// Human-readable host name for link labels, e.g. "GitHub", "Figshare", "janelia.org"
export function getHostLabel(repoUrl) {
  const host = getRepoHost(repoUrl);
  if (host === "github") return "GitHub";
  if (host === "figshare") return "Figshare";
  if (host === "other") return new URL(repoUrl).hostname.replace(/^www\./, "");
  return "";
}

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, {
    headers: { Accept: "application/json", ...headers },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`${url} responded with ${response.status}`);
  }
  return response.json();
}

function addLinkAttrs(tagName, attribs) {
  const href = attribs.href;
  if (href && /^https?:/.test(href)) {
    return {
      tagName,
      attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer" },
    };
  }
  return { tagName, attribs };
}

const SANITIZE_OPTIONS = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img",
    "h1",
    "h2",
    "details",
    "summary",
  ]),
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
  },
  allowedSchemes: ["http", "https", "mailto"],
};

// Figshare descriptions are HTML written by the record's authors
function sanitizeDescription(html) {
  return sanitizeHtml(html, {
    ...SANITIZE_OPTIONS,
    transformTags: { a: addLinkAttrs },
  });
}

// GitHub READMEs often use paths relative to the repo. Point them at GitHub so
// images and links still work when the README is shown on this site.
export function sanitizeReadme(html, owner, repo) {
  const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/`;
  const blobBase = `https://github.com/${owner}/${repo}/blob/HEAD/`;
  const isRelative = (value) => value && !/^([a-z][a-z0-9+.-]*:|#|\/\/)/i.test(value);
  const resolve = (base, value) => base + value.replace(/^\.?\//, "");

  return sanitizeHtml(html, {
    ...SANITIZE_OPTIONS,
    transformTags: {
      a: (tagName, attribs) =>
        addLinkAttrs(tagName, {
          ...attribs,
          ...(isRelative(attribs.href)
            ? { href: resolve(blobBase, attribs.href) }
            : {}),
        }),
      img: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(isRelative(attribs.src)
            ? { src: resolve(rawBase, attribs.src) }
            : {}),
        },
      }),
    },
  });
}

async function fetchFigshare(repoUrl) {
  // Article id is the last purely numeric path segment; any ?file=... is ignored
  const segments = new URL(repoUrl).pathname.split("/").filter(Boolean);
  const articleId = [...segments].reverse().find((s) => /^\d+$/.test(s));
  if (!articleId) {
    throw new Error(`No Figshare article id found in ${repoUrl}`);
  }
  const record = await fetchJson(`https://api.figshare.com/v2/articles/${articleId}`);

  const files = (record.files ?? []).map((file) => ({
    name: file.name,
    url: file.download_url,
    linkOnly: Boolean(file.is_link_only),
  }));

  return {
    host: "figshare",
    hostLabel: "Figshare",
    title: record.title,
    descriptionHtml: record.description
      ? sanitizeDescription(record.description)
      : null,
    authors: (record.authors ?? []).map((a) => ({
      name: a.full_name,
      orcid: a.orcid_id || null,
    })),
    doi: record.doi || null,
    citation: record.citation || null,
    license: record.license
      ? { name: record.license.name, url: record.license.url }
      : null,
    version: record.version ?? null,
    publishedDate: record.published_date ?? null,
    itemType: record.defined_type_name ?? null,
    files,
    // A link-only file points at where the project files actually live (e.g. GitHub)
    projectFilesUrl: files.find((f) => f.linkOnly && f.url)?.url ?? null,
  };
}

async function fetchGithub(repoUrl) {
  const [owner, repo] = new URL(repoUrl).pathname.split("/").filter(Boolean);
  if (!owner || !repo) {
    throw new Error(`Not a GitHub repository URL: ${repoUrl}`);
  }
  const token = process.env.GITHUB_TOKEN ?? import.meta.env.GITHUB_TOKEN;
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
    {
      headers: {
        Accept: "application/vnd.github.html+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    }
  );
  if (!response.ok) {
    throw new Error(`GitHub README for ${owner}/${repo} responded with ${response.status}`);
  }
  return {
    host: "github",
    hostLabel: "GitHub",
    readmeHtml: sanitizeReadme(await response.text(), owner, repo),
  };
}

// Fetches display data for a repository link. Never throws: if the host is
// unsupported or the request fails, a warning is logged and null is returned
// so the project page can fall back to its markdown body.
export async function fetchRepoInfo(repoUrl) {
  if (cache.has(repoUrl)) {
    return cache.get(repoUrl);
  }
  const host = getRepoHost(repoUrl);
  const request =
    host === "figshare"
      ? fetchFigshare(repoUrl)
      : host === "github"
      ? fetchGithub(repoUrl)
      : Promise.resolve(null);

  const result = request.catch((error) => {
    console.warn(`[fetchRepoInfo] Could not fetch ${repoUrl}: ${error.message}`);
    return null;
  });
  cache.set(repoUrl, result);
  return result;
}
