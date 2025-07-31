import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://yourportfolio.com";

  // Get current date for lastModified
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: lastMonth,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: lastWeek,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: lastMonth,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: lastMonth,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic project pages (if they exist)
  // In a real implementation, you would fetch these from your CMS or database
  const projectSlugs = [
    "ecommerce-platform",
    "saas-dashboard",
    "react-web-app",
    "portfolio-website",
    "booking-system",
    "analytics-dashboard",
  ];

  const projectPages: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${baseUrl}/portfolio/${slug}`,
    lastModified: lastWeek,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Service category pages
  const servicePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/services/react-development`,
      lastModified: lastMonth,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/ecommerce-development`,
      lastModified: lastMonth,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/saas-development`,
      lastModified: lastMonth,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Blog posts (if blog exists)
  // const blogPosts: MetadataRoute.Sitemap = [];

  return [...staticPages, ...projectPages, ...servicePages];
}
