import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/shared/styles/globals.css";
import "@/shared/styles/themes.css";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar/app-sidebar";
import { SiteHeader } from "@/components/Navbar/site-header";
import { ThemeProvider } from "@/shared/components/providers/theme-provider";
import { ThemeSwitcher } from "@/shared/components/theme/theme-switcher";
import { META_THEME_COLORS, siteConfig } from "@/shared/config/site";
import { Toaster } from "@/shared/components/ui/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import { initImageProxy } from "@/shared/config/axios";

const inter = Inter({
  preload: true,
  subsets: ["vietnamese"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://suicaodex.com"),
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    type: "website",
    url: "https://suicaodex.com/",
    siteName: "SuicaoDex",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "SuicaoDex",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  initImageProxy();

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (window.localStorage && (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches))) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />
        <meta name="theme-color" content={META_THEME_COLORS.dark} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          enableColorScheme
          enableSystem
        >
          <SidebarProvider defaultOpen={false}>
            <div className="border-grid flex flex-1 flex-col">
              <SiteHeader />
              <main className="mx-4 flex-1 py-4 md:mx-8 lg:mx-12">
                {children}
              </main>
              <Toaster
                richColors
                position="top-right"
                closeButton
                offset={{
                  top: "55px",
                  right: "65px",
                }}
              />
            </div>

            <AppSidebar side="right" />
          </SidebarProvider>
          <ThemeSwitcher />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-GHG1HN9493" />
    </html>
  );
}
