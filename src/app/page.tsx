import HomePage from "@/features/home/components";
import { siteConfig } from "@/shared/config/site";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // Khai báo Tổ chức (Thương hiệu)
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/logo.png`, // Đảm bảo logo size chuẩn 112x112px trở lên
        },
        sameAs: [
          siteConfig.social.discord.href,
          siteConfig.social.github.href,
          siteConfig.social.facebook.href,
        ].filter(Boolean), // Lọc bỏ link rỗng nếu có
      },
      // Khai báo Website & Search Box
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: {
          "@id": `${siteConfig.url}/#organization`, // Link ngược lại tổ chức ở trên
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteConfig.url}/advanced-search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage />
    </>
  );
}
