import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "http://localhost:3000/",
    },
    {
      url: "http://localhost:3000/token",
    },
    {
      url: "http://localhost:3000/workspace",
    },
  ];
}
