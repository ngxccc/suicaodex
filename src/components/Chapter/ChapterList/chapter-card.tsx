"use client";
import { Chapter, ChapterGroup } from "@/types/types";
import { Clock, ExternalLink, MessageSquare, Users } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn, formatTimeToNow } from "@/shared/lib/utils";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { GB, VN } from "country-flag-icons/react/3x2";
import NoPrefetchLink from "@/shared/components/custom/no-prefetch-link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface ChapterCardProps {
  chapters: ChapterGroup;
  finalChapter?: string;
}

interface SingleCardProps {
  chapter: Chapter;
  finalChapter?: string;
  className?: string;
}

export const ChapterCard = ({ chapters, finalChapter }: ChapterCardProps) => {
  if (chapters.group.length > 1)
    return (
      <Accordion type="multiple" className="w-full" defaultValue={["chapter"]}>
        <AccordionItem value="chapter" className="border-none">
          <AccordionTrigger className="bg-card hover:bg-accent rounded-xs border px-4 py-2 shadow-xs transition-all [&[data-state=open]>svg]:rotate-90">
            <div className="flex items-center gap-2">
              <p className="line-clamp-1 text-sm font-semibold md:text-base">
                {chapters.chapter ? `Chapter ${chapters.chapter}` : "Oneshot"}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-0 pb-0">
            <div className="relative mt-1 space-y-1 pl-4">
              {chapters.group.map((chapter, index) => (
                <div key={chapter.id} className="relative">
                  {/* Vertical line from top to first item */}
                  {index === 0 && (
                    <div
                      className="bg-border absolute top-0 left-0 -ml-4 w-1"
                      style={{ height: "50%" }}
                    />
                  )}
                  {/* Vertical line connecting items */}
                  {index < chapters.group.length - 1 && (
                    <div
                      className="bg-border absolute top-1/2 left-0 -ml-4 w-1"
                      style={{ height: "calc(100% + 0.25rem)" }}
                    />
                  )}
                  {/* Horizontal branch to the item */}
                  <div className="bg-border absolute top-1/2 left-0 z-10 -ml-4 h-1 w-4 -translate-y-1/2" />
                  <SingleCard
                    chapter={chapter}
                    finalChapter={finalChapter}
                    className="shadow-xs"
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

  return <SingleCard chapter={chapters.group[0]} finalChapter={finalChapter} />;
};

export const SingleCard = ({
  chapter,
  finalChapter,
  className,
}: SingleCardProps) => {
  const router = useRouter();
  const isUnavailable = Boolean((chapter as any).isUnavailable);

  const card = (
    <Card
      aria-disabled={isUnavailable}
      className={cn(
        "hover:bg-accent/50 relative flex min-h-14 flex-col justify-between rounded-xs px-1.5 py-1.5 shadow-xs",
        isUnavailable && "text-muted-foreground cursor-not-allowed opacity-90",
        className && className,
      )}
    >
      <div className="flex justify-between">
        <div className="flex items-center space-x-1">
          {chapter.language === "vi" && (
            <VN className="inline-block h-5! w-5! shrink-0 select-none" />
          )}

          {chapter.language === "en" && (
            <GB className="inline-block h-5! w-5! shrink-0 select-none" />
          )}
          {chapter.externalUrl && <ExternalLink size={16} />}
          <p className="line-clamp-1 text-sm font-semibold break-all md:text-base">
            {chapter.chapter
              ? `Ch. ${chapter.chapter}
      ${chapter.title ? ` - ${chapter.title}` : ""}`
              : "Oneshot"}
          </p>
          {finalChapter && finalChapter === chapter.chapter && (
            <Badge className="flex max-h-4 items-center gap-1 rounded px-1 py-0 text-[0.625rem] font-bold">
              END
            </Badge>
          )}
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="h-6 gap-0.5 rounded-sm px-1!"
        >
          <MessageSquare className="size-4!" />
        </Button>
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
                  className="hover:text-primary line-clamp-1 h-4 shrink! rounded-sm px-1! py-0! text-start text-xs font-normal break-all whitespace-normal! hover:underline"
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
          <Clock size={16} className="shrink-0" />
        </div>
      </div>
    </Card>
  );

  if (isUnavailable)
    return (
      <Tooltip>
        <TooltipTrigger asChild>{card}</TooltipTrigger>
        <TooltipContent className="select-none">
          Không thể đọc chương này
        </TooltipContent>
      </Tooltip>
    );

  return (
    <NoPrefetchLink
      suppressHydrationWarning
      href={
        chapter.externalUrl ? chapter.externalUrl : `/chapter/${chapter.id}`
      }
      target={chapter.externalUrl ? "_blank" : "_self"}
    >
      {card}
    </NoPrefetchLink>
  );
};
