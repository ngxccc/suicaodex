"use client";

import NoPrefetchLink from "@/components/Custom/no-prefetch-link";
import MangaCover from "@/features/manga/components/manga-cover";
import { Card, CardContent } from "@/components/ui/card";
import { generateSlug } from "@/lib/utils";
import { Artist, Author, Manga } from "@/types/types";
import { Star } from "lucide-react";

interface TopRatedCardProps {
  manga: Manga;
}

export default function TopRatedCard({ manga }: TopRatedCardProps) {
  return (
    <Card className="dark:bg-background rounded-sm border-none bg-transparent shadow-none transition-colors duration-200">
      <CardContent className="flex gap-3 p-1">
        <NoPrefetchLink
          href={`/manga/${manga.id}/${generateSlug(manga.title)}`}
        >
          <MangaCover
            id={manga.id}
            cover={manga.cover}
            alt={manga.title}
            placeholder="/images/place-doro.webp"
            wrapper="w-20 h-auto border"
            className="h-28! w-20! object-cover!"
            quality="256"
          />
        </NoPrefetchLink>

        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-1">
            <NoPrefetchLink
              href={`/manga/${manga.id}/${generateSlug(manga.title)}`}
              className="line-clamp-2 text-xl font-bold"
            >
              {manga.title}
            </NoPrefetchLink>

            <p className="line-clamp-1 text-sm">
              {[
                ...new Set([
                  ...manga.author.map((a: Author) => a.name),
                  ...manga.artist.map((a: Artist) => a.name),
                ]),
              ].join(", ")}
            </p>
          </div>

          {!!manga.stats && (
            <div className="flex flex-row gap-2">
              <span className="text-primary flex items-center gap-1 text-base">
                <Star size={18} />
                <span>{manga.stats.rating.bayesian.toFixed(2)}</span>
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
