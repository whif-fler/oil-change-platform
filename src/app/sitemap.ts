import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://oil-change-platform-gilt.vercel.app";
  const lastModified = new Date();

  return [
    { url: baseUrl, lastModified },
    { url: `${baseUrl}/about`, lastModified },
    { url: `${baseUrl}/quote`, lastModified },
    { url: `${baseUrl}/request`, lastModified },
    { url: `${baseUrl}/contact`, lastModified },
  ];
}