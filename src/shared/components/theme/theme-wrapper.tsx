"use client";

import { cn } from "@/shared/lib/utils";
import { useConfig } from "@/shared/hooks/use-config";

interface ThemeWrapperProps extends React.ComponentProps<"div"> {
  defaultTheme?: string;
}

export function ThemeWrapper({
  defaultTheme,
  children,
  className,
}: ThemeWrapperProps) {
  const [config] = useConfig();

  return (
    <div
      className={cn(
        `theme-${defaultTheme || config.theme}`,
        "w-full",
        className,
      )}
      // style={
      //   {
      //     "--radius": `${defaultTheme ? 0.5 : config.radius}rem`,
      //   } as React.CSSProperties
      // }
    >
      {children}
    </div>
  );
}
