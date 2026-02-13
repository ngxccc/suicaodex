"use client";
import { cn } from "@/shared/lib/utils";
import { ModeSwitcher } from "./mode-switcher";
import useScrollOffset from "@/shared/hooks/use-scroll-offset";
import { usePathname } from "next/navigation";
import { useConfig } from "@/shared/hooks/use-config";
import QuickSearch from "@/features/search/components/quick-search";
import { MainNav } from "./main-nav";
import { SidebarTrigger } from "../../ui/sidebar";

export function SiteHeader() {
  const { isAtTop } = useScrollOffset();
  const pathname = usePathname();
  const [config] = useConfig();
  return (
    <header
      className={cn(
        "top-0 z-50 w-full transform transition-all duration-300",
        !pathname.includes("/chapter") && "sticky",
        !!pathname.includes("/chapter") && !!config.reader.header && "sticky",
        "px-4 md:px-8 lg:px-12",
        isAtTop && "bg-transparent",
        !isAtTop &&
          "bg-background/95 supports-backdrop-filter:bg-background/60 backdrop-blur-sm",
      )}
    >
      <div className="container-wrapper">
        <div className="flex h-12 items-center justify-between">
          <MainNav />
          {/* <MobileNav /> */}
          <div className="flex grow items-center justify-end gap-2">
            <QuickSearch />

            <nav className="flex items-center gap-2">
              <ModeSwitcher />
              <SidebarTrigger className="bg-muted/50 h-8 w-8 shadow-xs" />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
