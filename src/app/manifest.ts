import type { MetadataRoute } from "next";
import { getBasePath } from "@/lib/basePath";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = getBasePath();
  return {
    name: "Amisha Sharma — IT Project Coordinator",
    short_name: "Amisha Sharma",
    description:
      "Portfolio of Amisha Sharma, IT Project Coordinator. San Andreas Edition.",
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: "#0c0913",
    theme_color: "#0c0913",
    icons: [
      { src: `${basePath}/icon.svg`, sizes: "any", type: "image/svg+xml" },
      { src: `${basePath}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${basePath}/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
  };
}
