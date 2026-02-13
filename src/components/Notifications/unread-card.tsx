"use client";

import { Chapter } from "@/types/types";
import { ChapterTitle } from "../Chapter/ChapterReader/chapter-info";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { formatTimeToNow } from "@/shared/lib/utils";
import { GB, VN } from "country-flag-icons/react/3x2";
import { Check, Clock, Users } from "lucide-react";
import { Button } from "../ui/button";
import { useLocalNotification } from "@/shared/hooks/use-local-notification";
import MangaCover from "../../features/manga/components/manga-cover";
import NoPrefetchLink from "../Custom/no-prefetch-link";

interface UnreadCardProps {
  chapter: Chapter;
}

export default function UnreadCard({ chapter }: UnreadCardProps) {
  const title = ChapterTitle(chapter);
  const router = useRouter();
  const { markAsRead } = useLocalNotification();
  return (
    <Card className="w-full rounded-sm shadow-xs transition-colors duration-200">
      <CardContent className="flex gap-1.5 p-1 md:p-1.5">
        <NoPrefetchLink href={`/manga/${chapter.manga.id}`}>
          <MangaCover
            id={chapter.manga.id || ""}
            cover={chapter.manga.cover || ""}
            alt={chapter.manga.title || ""}
            placeholder="/images/place-doro.webp"
            wrapper="w-20 h-auto border"
            className="h-[75px]! w-20! object-cover! md:h-[77.5px]!"
            quality="256"
            // quality={isMobile ? "256" : "512"}
          />
        </NoPrefetchLink>
        <div className="flex w-full flex-col gap-0">
          <div className="flex w-full flex-row items-center justify-between border-b pb-1 md:pb-1.5">
            <NoPrefetchLink
              href={`/manga/${chapter.manga.id}`}
              className="line-clamp-1 font-bold break-all"
            >
              {chapter.manga.title}
            </NoPrefetchLink>
            <Button
              size="sm"
              variant="ghost"
              className="flex h-6 shrink! px-2! text-xs whitespace-normal! md:px-3!"
              onClick={() => markAsRead(chapter.id)}
            >
              <Check />
              <span className="line-clamp-1 break-all!">Đã đọc</span>
            </Button>
          </div>

          <div className="hover:bg-secondary w-full px-1 py-1">
            <NoPrefetchLink
              className="flex w-full flex-col gap-1"
              href={`/chapter/${chapter.id}`}
            >
              <div className="flex items-center gap-1">
                {chapter.language === "vi" ? (
                  <VN className="size-4 shrink-0" />
                ) : (
                  <GB className="size-4 shrink-0" />
                )}
                <span className="text-sm font-bold">{title}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center justify-self-start">
                  <Users size={15} className="shrink-0" />
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
                  <Clock size={15} className="shrink-0" />
                </div>
              </div>
            </NoPrefetchLink>
          </div>
        </div>
      </CardContent>
      {/* <CardFooter className="py-1 px-2 w-full hover:bg-secondary"></CardFooter> */}
    </Card>
  );
}
