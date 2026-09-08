import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/structuredData";

// Static export: emitted once at build time as /robots.txt
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Explicit allows for link-preview crawlers (WhatsApp/LinkedIn/Slack/etc.)
      {
        userAgent: [
          "facebookexternalhit",
          "Facebot",
          "WhatsApp",
          "Twitterbot",
          "LinkedInBot",
          "Slackbot",
        ],
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
