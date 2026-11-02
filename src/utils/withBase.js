// Prefix an internal absolute path (e.g. "/projects") with the site's base path,
// so links work both at a domain root and under a subpath such as /repo-name/.
export function withBase(path) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
}
