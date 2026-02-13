"use client";

import type { MangaStats } from "@/types/types";
import type { FC } from "react";
import { Bookmark, MessageSquare, Star } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../../components/ui/hover-card";
import { RatingChart } from "./rating-chart";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { useConfig } from "@/shared/hooks/use-config";
import { cn, formatNumber } from "@/shared/lib/utils";
import { useIsMobile } from "@/shared/hooks/use-mobile";

interface MangaStatsProps {
  stats: MangaStats;
  size: "sm" | "lg";
}

export const MangaStatsComponent: FC<MangaStatsProps> = ({ stats, size }) => {
  const [config] = useConfig();
  const isMobile = useIsMobile();
  //TODO: fetch
  return (
    <div className="flex flex-wrap gap-2 lowercase!">
      {isMobile ? (
        <Popover>
          <PopoverTrigger asChild>
            <span className="text-primary flex cursor-pointer items-center gap-1 text-sm drop-shadow-md">
              <Star size={16} />
              <span>{stats.rating.bayesian.toFixed(2)}</span>
            </span>
          </PopoverTrigger>
          <PopoverContent
            className={cn("w-80 px-0 py-2", `theme-${config.theme}`)}
          >
            <RatingChart stats={stats} />
          </PopoverContent>
        </Popover>
      ) : (
        <HoverCard openDelay={0}>
          <HoverCardTrigger asChild>
            <span
              className={cn(
                "text-primary flex cursor-pointer items-center gap-1 drop-shadow-md",
                size === "sm" ? "text-sm" : "text-base",
              )}
            >
              <Star size={size === "sm" ? 16 : 18} />
              <span>{stats.rating.bayesian.toFixed(2)}</span>
            </span>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 rounded-md px-0 py-2">
            <RatingChart stats={stats} />
          </HoverCardContent>
        </HoverCard>
      )}

      <span
        className={cn(
          "flex items-center gap-1 drop-shadow-md",
          size === "sm" ? "text-sm" : "text-base",
        )}
      >
        <Bookmark size={size === "sm" ? 16 : 18} />
        <span>{formatNumber(stats.follows)}</span>
      </span>
      {!!stats.comments && (
        <span
          className={cn(
            "flex items-center gap-1 drop-shadow-md",
            size === "sm" ? "text-sm" : "text-base",
          )}
        >
          <MessageSquare size={size === "sm" ? 16 : 18} />
          <span>{formatNumber(stats.comments)}</span>
        </span>
      )}
    </div>
  );
};
