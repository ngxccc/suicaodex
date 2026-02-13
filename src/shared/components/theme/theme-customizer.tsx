"use client";

import { Check, MonitorCog, Moon, Palette, Repeat, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/shared/lib/utils";
import { useConfig } from "@/shared/hooks/use-config";
import "@/shared/styles/mdx.css";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { baseColors } from "@/shared/config/base-colors";
import { SidebarMenuButton } from "../ui/sidebar";
import { presetThemes } from "@/shared/config/preset-themes";
import { useEffect, useState } from "react";
import { ThemeWrapper } from "./theme-wrapper";

export function ThemeCustomizer() {
  // const [config, setConfig] = useConfig();
  // const { resolvedTheme: mode } = useTheme();
  const [_mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Drawer>
        <DrawerTrigger asChild>
          <SidebarMenuButton asChild tooltip="Giao diện" className="md:hidden">
            <div>
              <Palette />
              <span>Giao diện</span>
            </div>
          </SidebarMenuButton>
        </DrawerTrigger>
        <DrawerTitle className="hidden"></DrawerTitle>
        <DrawerDescription className="hidden"></DrawerDescription>
        <DrawerContent className="p-6 pt-0">
          <Customizer />
        </DrawerContent>
      </Drawer>
      <div className="hidden grow items-center md:flex">
        <Popover>
          <PopoverTrigger asChild>
            <SidebarMenuButton
              asChild
              tooltip="Giao diện"
              className="cursor-pointer"
            >
              <div>
                <Palette />
                <span>Giao diện</span>
              </div>
            </SidebarMenuButton>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="z-40 mr-2 w-[380px] rounded-xl bg-white p-6 dark:bg-zinc-950"
          >
            <Customizer />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function Customizer() {
  const [mounted, setMounted] = useState(false);
  const {
    setTheme: setMode,
    resolvedTheme: mode,
    theme: unResolvedTheme,
  } = useTheme();
  const [config, setConfig] = useConfig();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeWrapper
      defaultTheme="zinc"
      className="flex flex-col space-y-4 md:space-y-6"
    >
      <div className="flex items-start pt-4 md:pt-0">
        <div className="space-y-1 pr-2">
          <div className="leading-none font-semibold tracking-tight">
            Tuỳ chỉnh giao diện
          </div>
          <div className="text-muted-foreground text-xs">
            Chọn màu bạn thích
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto rounded-[0.5rem]"
          onClick={() => {
            setConfig({
              ...config,
              theme: "zinc",
              radius: 0.5,
            });
          }}
        >
          <Repeat />
          <span className="sr-only">Reset</span>
        </Button>
      </div>
      <div className="flex flex-1 flex-col space-y-4 md:space-y-6">
        <div className="space-y-1.5">
          <Label className="font-semibold">Màu sắc</Label>
          <div className="grid grid-cols-3 gap-2">
            {baseColors
              .filter(
                (theme) => !["stone", "gray", "neutral"].includes(theme.name),
              )
              .map((theme) => {
                const isActive = config.theme === theme.name;

                return mounted ? (
                  <Button
                    variant={"outline"}
                    size="sm"
                    key={theme.name}
                    onClick={() => {
                      setConfig({
                        ...config,
                        theme: theme.name,
                      });
                    }}
                    className={cn(
                      "justify-start",
                      isActive && "border-primary! border-2",
                    )}
                    style={
                      {
                        "--theme-primary": `hsl(${
                          theme?.activeColor[mode === "dark" ? "dark" : "light"]
                        })`,
                      } as React.CSSProperties
                    }
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-(--theme-primary)",
                      )}
                    >
                      {isActive && <Check className="size-3 text-white" />}
                    </span>
                    {theme.label}
                  </Button>
                ) : (
                  <Skeleton className="h-8 w-full" key={theme.name} />
                );
              })}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="font-semibold">Preset</Label>
          <div className="grid grid-cols-3 gap-2">
            {presetThemes.map((theme) => {
              const isActive = config.theme === theme.name;
              return mounted ? (
                <Button
                  key={theme.name}
                  variant={"outline"}
                  size="sm"
                  onClick={() => {
                    setConfig({
                      ...config,
                      theme: theme.name,
                    });
                  }}
                  className={cn(
                    "justify-start",
                    isActive && "border-primary! border-2",
                  )}
                  style={
                    {
                      "--theme-primary": `hsl(${
                        theme?.activeColor[mode === "dark" ? "dark" : "light"]
                      })`,
                    } as React.CSSProperties
                  }
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-(--theme-primary)",
                    )}
                  >
                    {isActive && <Check className="size-3 text-white" />}
                  </span>
                  {theme.label}
                </Button>
              ) : (
                <Skeleton className="h-8 w-full" key={theme.name} />
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="font-semibold">Chế độ</Label>
          <div className="grid grid-cols-3 gap-2">
            {mounted ? (
              <>
                <Button
                  variant={"outline"}
                  size="sm"
                  onClick={() => setMode("light")}
                  className={cn(
                    unResolvedTheme === "light" && "border-primary! border-2",
                  )}
                >
                  <Sun />
                  Sáng
                </Button>
                <Button
                  variant={"outline"}
                  size="sm"
                  onClick={() => setMode("dark")}
                  className={cn(
                    unResolvedTheme === "dark" && "border-primary! border-2",
                  )}
                >
                  <Moon />
                  Tối
                </Button>
                <Button
                  variant={"outline"}
                  size="sm"
                  onClick={() => setMode("system")}
                  className={cn(
                    unResolvedTheme === "system" && "border-primary! border-2",
                  )}
                >
                  <MonitorCog />
                  Hệ thống
                </Button>
              </>
            ) : (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </>
            )}
          </div>
        </div>
      </div>
    </ThemeWrapper>
  );
}
