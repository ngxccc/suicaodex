import { MetadataRoute } from "next";

const BASE_URL = process.env.SITEMAP_URL ?? "https://suicaodex.net";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // disallow: "/private/", // Nếu muốn chặn thư mục nào đó
    },
    sitemap: [
      `${BASE_URL}/sitemap.xml`, // Sitemap chính do Next.js tự tạo từ file sitemap.ts
      `${BASE_URL}/manga-sitemap.xml`, // Sitemap phụ (truyện)
      // `${BASE_URL}/chapter-sitemap.xml`,
    ],
  };
}
