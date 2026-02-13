import { ChapterTitle } from "@/features/chapter/components/ChapterReader/chapter-info";
import NoPrefetchLink from "@/shared/components/custom/no-prefetch-link";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import { cn, getCoverImageUrl } from "@/shared/lib/utils";
import { Chapter } from "@/shared/types/common";
import { GB, VN } from "country-flag-icons/react/3x2";
import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface HistoryCoverCardProps {
  chapter: Chapter;
}

export default function HistoryCoverCard({ chapter }: HistoryCoverCardProps) {
  const src = getCoverImageUrl(
    chapter.manga.id || "",
    chapter.manga.cover || "",
    "512",
  );
  const [loaded, setLoaded] = useState(false);
  const title = ChapterTitle(chapter);
  return (
    <Card className="bg-background relative h-full w-full rounded-sm border-none shadow-none transition-colors duration-200">
      <NoPrefetchLink href={`/manga/${chapter.manga.id}`}>
        <CardContent className="relative rounded-sm p-0">
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
            alt={`Ảnh bìa ${chapter.manga.title}`}
            onLoad={() => setLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = "/images/xidoco.webp";
            }}
          />
        </CardContent>
      </NoPrefetchLink>

      <CardFooter className="flex w-full flex-col items-start gap-1 px-0 py-2">
        <NoPrefetchLink
          href={`/manga/${chapter.manga.id}`}
          className="line-clamp-2 font-bold break-all"
        >
          {chapter.manga.title}
        </NoPrefetchLink>
        <NoPrefetchLink
          href={`/chapter/${chapter.id}`}
          className="flex items-center gap-1"
        >
          {chapter.language === "vi" ? (
            <VN className="size-4 shrink-0" />
          ) : (
            <GB className="size-4 shrink-0" />
          )}
          <span className="line-clamp-1 text-sm font-bold break-all hover:underline">
            {title}
          </span>
        </NoPrefetchLink>
      </CardFooter>
    </Card>
  );
}
