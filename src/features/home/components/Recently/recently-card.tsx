"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn, getCoverImageUrl } from "@/lib/utils";
import type { Manga } from "@/types/types";
import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface RecentlyCardProps {
  manga: Manga;
  className?: string;
}

export default function RecentlyCard({ manga, className }: RecentlyCardProps) {
  const src = getCoverImageUrl(manga.id, manga.cover ?? "", "512");
  const [loaded, setLoaded] = useState(false);

  return (
    <Card
      className={cn(
        "relative h-full w-full rounded-sm border-none shadow-md transition-colors duration-200",
        className,
      )}
    >
      <CardContent className="p-0">
        <LazyLoadImage
          wrapperClassName={cn(
            "block! rounded-sm object-cover w-full h-full",
            !loaded && "aspect-5/7",
          )}
          placeholderSrc="/images/place-doro.webp"
          className={cn(
            "block aspect-5/7 h-auto w-full rounded-sm object-cover",
          )}
          src={src}
          alt={`Ảnh bìa ${manga.title}`}
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = "/images/xidoco.webp";
          }}
        />
      </CardContent>

      <CardFooter className="absolute bottom-0 h-[40%] max-h-full w-full items-end rounded-b-sm bg-linear-to-t from-black p-2 dark:rounded-b-none">
        <p className="line-clamp-2 text-base font-semibold text-white drop-shadow-xs hover:line-clamp-none">
          {manga.title}
        </p>
      </CardFooter>
    </Card>
  );
}
