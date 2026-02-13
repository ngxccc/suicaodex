import {
  SiDiscord,
  SiFacebook,
  SiGithub,
} from "@icons-pack/react-simple-icons";

export const siteConfig = {
  name: "SuicaoDex",
  url: process.env.NEXT_PUBLIC_BASE_URL ?? "https://suicaodex.com",
  ogImage: "https://suicaodex.com/og-image.png",
  description: "SuicaoDex - Trang web truyện tranh đầu hàng VN",

  links: {
    discord: "https://discord.gg/dongmoe",
    github: "https://github.com/ngxccc/suicaodex",
    facebook: "https://facebook.com/ngxccc",
  },

  social: {
    discord: {
      label: "Discord",
      href: "https://discord.gg/n.gxc_",
      icon: SiDiscord,
    },
    github: {
      label: "GitHub",
      href: "https://github.com/ngxccc",
      icon: SiGithub,
    },
    facebook: {
      label: "Facebook",
      href: "https://facebook.com/ngxccc",
      icon: SiFacebook,
    },
  },

  mangadexAPI: {
    webURL: "https://mangadex.org",
    baseUrl: "https://api.mangadex.org",
    uploadsUrl: "https://uploads.mangadex.org",
    ogUrl: "https://og.mangadex.org/og-image",
    staffPickList: "805ba886-dd99-4aa4-b460-4bd7c7b71352",
    seasonalList: "68ab4f4e-6f01-4898-9038-c5eee066be27",
    matoSeiheiID: "e1e38166-20e4-4468-9370-187f985c550e",
  },

  proxy: {
    defaultUrl:
      process.env.NEXT_PUBLIC_PROXY_URL || "https://pr.memaydex.online",
  },

  keywords: [
    "Trần Văn Ngọc",
    "Tran Van Ngoc",
    "Ngxc",
    "Web Developer Intern",
    "Full Stack Developer Vietnam",
    "React Developer Vietnam",
    "Next.js Portfolio",
    "Web Development Tutorials",
    "Tech Blogger",
    "Fresher Nodejs",
    "Fresher React",
  ],
};

export type SiteConfig = typeof siteConfig;

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};
