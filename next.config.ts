import type { NextConfig } from "next";

const repoName = "amisha-portfolio-SA";
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    // Required for static export (no Image Optimization server on GitHub Pages).
    unoptimized: true,
    // Next.js 16 defaults to [75]; SectionBackground uses 65 for lighter BG assets.
    qualities: [65, 75],
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
