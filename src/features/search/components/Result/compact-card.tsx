"use client";

import MangaCover from "@/features/manga/components/manga-cover";
import StatusChip from "@/features/manga/components/Tags/status-tag";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import { Manga } from "@/shared/types/common";
import { Bookmark, MessageSquare, Star } from "lucide-react";

interface CompactCardProps {
  manga: Manga;
}

export default function CompactCard({ manga }: CompactCardProps) {
  return (
    <Card className="hover:bg-accent rounded-md shadow-xs transition-colors duration-200">
      <CardContent className="flex gap-2 p-2">
        <MangaCover
          id={manga.id}
          cover={manga.cover}
          alt={manga.title}
          placeholder="/images/place-doro.webp"
          wrapper="w-14 h-auto border"
          className="h-20! w-14! object-cover!"
          quality="256"
        />
        <div className="flex w-full flex-col justify-evenly">
          <p className="line-clamp-1 text-xl font-black">{manga.title}</p>

          {!!manga.stats && (
            <div className="flex flex-row gap-2">
              <span className="flex cursor-pointer items-center gap-1 text-sm text-[hsl(var(--primary))] drop-shadow-md">
                <Star size={16} />
                <span>{manga.stats.rating.bayesian.toFixed(2)}</span>
              </span>

              <span
                className={cn("flex items-center gap-1 text-sm drop-shadow-md")}
              >
                <Bookmark size={16} />
                <span>{manga.stats.follows.toLocaleString("en-US")}</span>
              </span>

              {!!manga.stats.comments && (
                <span
                  className={cn(
                    "flex items-center gap-1 text-sm drop-shadow-md",
                  )}
                >
                  <MessageSquare size={16} />
                  <span>{manga.stats.comments.toLocaleString("en-US")}</span>
                </span>
              )}
            </div>
          )}

          <StatusChip status={manga.status} />
        </div>
      </CardContent>
    </Card>
  );
}
