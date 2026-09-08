/** Public asset prefix for GitHub Pages project deploys (`/amisha-portfolio-SA`). */
export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}

/** Prefix absolute public paths (e.g. `/images/x.webp`) with the app basePath. */
export function withBasePath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const base = getBasePath();
  return base ? `${base}${path}` : path;
}
