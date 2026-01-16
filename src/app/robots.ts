import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Replace with actual domain in production
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://spendsafe.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/",
        "/start-trial", // Example of hidden marketing funnel
        "/auth/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
