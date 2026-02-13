"use client";

import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeWrapper } from "./theme/theme-wrapper";
import {
  Bar,
  Progress,
  AppProgressProvider as ProgressProvider,
} from "@bprogress/next";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { NotificationProvider } from "./notification-provider";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <JotaiProvider>
      <SWRConfig value={{ errorRetryCount: 3 }}>
        <NextThemesProvider {...props}>
          <ThemeWrapper>
            <ProgressProvider
              height="3px"
              options={{ showSpinner: false, template: null }}
              shallowRouting
            >
              <Progress>
                <Bar className="bg-primary!" />
              </Progress>
              <TooltipProvider delayDuration={0}>
                <SessionProvider>
                  <NotificationProvider>{children}</NotificationProvider>
                </SessionProvider>
              </TooltipProvider>
            </ProgressProvider>
          </ThemeWrapper>
        </NextThemesProvider>
      </SWRConfig>
    </JotaiProvider>
  );
}
