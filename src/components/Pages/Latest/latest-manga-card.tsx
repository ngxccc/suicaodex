"use client";

import NoPrefetchLink from "@/components/Custom/no-prefetch-link";
import MangaCover from "@/features/manga/components/manga-cover";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import {
  cn,
  formatTimeToNow,
  generateSlug,
  getCoverImageUrl,
} from "@/shared/lib/utils";
import { Chapter, Manga } from "@/types/types";
import { GB, VN } from "country-flag-icons/react/3x2";
import {
  ChevronsDown,
  ChevronsUp,
  Clock,
  ExternalLink,
  MessageSquare,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface LatestMangaCardProps {
  manga: Partial<Pick<Manga, "id" | "cover" | "title">>;
  chapters: Chapter[];
  type?: "compact" | "cover";
}

export default function LatestMangaCard({
  manga,
  chapters,
  type = "compact",
}: LatestMangaCardProps) {
  const isMobile = useIsMobile();
  const maxCount = isMobile ? 2 : 3;
  const [expanded, setExpanded] = useState(false);
  const src = getCoverImageUrl(manga.id || "", manga.cover || "", "512");
  const [loaded, setLoaded] = useState(false);

  if (type === "cover") {
    return (
      <Card className="bg-background relative h-full w-full rounded-sm border-none shadow-none transition-colors duration-200">
        <NoPrefetchLink
          href={`/manga/${manga.id}/${generateSlug(manga.title || "")}`}
        >
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
              alt={`Ảnh bìa ${manga.title}`}
              onLoad={() => setLoaded(true)}
              onError={(e) => {
                e.currentTarget.src = "/images/xidoco.webp";
              }}
            />
          </CardContent>
        </NoPrefetchLink>

        <CardFooter className="flex w-full flex-col items-start gap-0 p-0 pt-1">
          <SingleCard key={chapters[0].id} chapter={chapters[0]} hideIcons />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="rounded-sm shadow-xs transition-colors duration-200">
      <CardHeader className="p-1 md:hidden">
        <NoPrefetchLink
          href={`/manga/${manga.id}/${generateSlug(manga.title || "")}`}
          className="line-clamp-1 border-b text-lg font-bold break-all"
        >
          {manga.title}
        </NoPrefetchLink>
      </CardHeader>
      <CardContent className="flex gap-1.5 p-1 md:p-1.5">
        <NoPrefetchLink
          href={`/manga/${manga.id}/${generateSlug(manga.title || "")}`}
        >
          <MangaCover
            id={manga.id || ""}
            cover={manga.cover || ""}
            alt={manga.title || ""}
            placeholder="/images/place-doro.webp"
            wrapper="w-20 md:w-[140px] h-auto border"
            className="h-28! w-20! object-cover! md:h-[200px]! md:w-[140px]!"
            quality="256"
            // quality={isMobile ? "256" : "512"}
          />
        </NoPrefetchLink>
        <div className="flex w-full flex-col">
          <NoPrefetchLink
            href={`/manga/${manga.id}/${generateSlug(manga.title || "")}`}
            className="line-clamp-1 hidden border-b px-1.5 text-lg font-bold break-all md:flex md:pb-1"
          >
            {manga.title}
          </NoPrefetchLink>

          <div className="flex flex-col overflow-hidden">
            {chapters.slice(0, maxCount).map((chapter) => (
              <SingleCard key={chapter.id} chapter={chapter} />
            ))}
            <div
              className={cn(
                "flex flex-col transition-all duration-300 ease-in-out",
                expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
              )}
            >
              {chapters.slice(maxCount).map((chapter) => (
                <SingleCard key={chapter.id} chapter={chapter} />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      {chapters.length > maxCount && (
        <CardFooter className="w-full justify-center pt-0 pb-1.5">
          <Button
            size="sm"
            className="text-primary h-4 bg-transparent px-1! text-xs shadow-none hover:bg-transparent"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? (
              <>
                <ChevronsUp />
                thu gọn
                <ChevronsUp />
              </>
            ) : (
              <>
                <ChevronsDown />
                xem thêm
                <ChevronsDown />
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
interface SingleCardProps {
  chapter: Chapter;
  hideIcons?: boolean;
}

const SingleCard = ({ chapter, hideIcons = false }: SingleCardProps) => {
  const router = useRouter();
  return (
    <NoPrefetchLink
      key={chapter.id}
      suppressHydrationWarning
      href={
        chapter.externalUrl ? chapter.externalUrl : `/chapter/${chapter.id}`
      }
      target={chapter.externalUrl ? "_blank" : "_self"}
      className="w-full"
    >
      <Card className="hover:bg-accent relative flex min-h-14 w-full flex-col justify-between rounded-xs border-none px-1.5 py-1.5 shadow-none">
        <div className="flex justify-between">
          <div className="flex items-center space-x-1">
            {chapter.language === "vi" && <VN className="size-4 shrink-0" />}

            {chapter.language === "en" && <GB className="size-4 shrink-0" />}
            {chapter.externalUrl && <ExternalLink size={16} />}
            <p className="line-clamp-1 text-sm font-semibold md:text-base">
              {chapter.chapter
                ? `Ch. ${chapter.chapter}
              ${chapter.title ? ` - ${chapter.title}` : ""}`
                : "Oneshot"}
            </p>
          </div>

          {!hideIcons && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 gap-0.5 rounded-sm px-1!"
            >
              <MessageSquare />
            </Button>
          )}
        </div>
        <div className="flex justify-between">
          <div className="flex items-center justify-self-start">
            <Users size={16} className="shrink-0" />
            {chapter.group.length === 0 ? (
              <span className="line-clamp-1 px-1 text-xs font-normal">
                No Group
              </span>
            ) : (
              <div className="flex items-center space-x-1">
                {chapter.group.map((group) => (
                  <Button
                    key={group.id}
                    variant="ghost"
                    className="hover:text-primary line-clamp-1 h-4 shrink! rounded-sm px-1 py-0 text-start text-xs font-normal break-all! whitespace-normal! hover:underline"
                    size="sm"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/group/${group.id}`);
                    }}
                  >
                    {group.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <div className="flex w-full max-w-max items-center justify-end space-x-1 pr-1">
            <time
              className="line-clamp-1 text-xs font-light break-all"
              dateTime={new Date(chapter.updatedAt).toDateString()}
            >
              {formatTimeToNow(new Date(chapter.updatedAt))}
            </time>
            {!hideIcons && <Clock size={16} className="shrink-0" />}
          </div>
        </div>
      </Card>
    </NoPrefetchLink>
  );
};
