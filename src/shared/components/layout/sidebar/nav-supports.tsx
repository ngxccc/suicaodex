"use client";

import { SquareArrowOutUpRight } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { siteConfig } from "@/shared/config/site";

export function NavSupports() {
  //   const { isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Góp ý/Báo lỗi</SidebarGroupLabel>
      <SidebarMenu>
        {Object.values(siteConfig.social).map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton asChild tooltip={item.label}>
              <a href={item.href} target="_blank">
                <item.icon />
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
            <SidebarMenuAction>
              <SquareArrowOutUpRight />
            </SidebarMenuAction>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
