"use client";

import NoPrefetchLink from "@/components/Custom/no-prefetch-link";
import MangaCover from "@/features/manga/components/manga-cover";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatTimeToNow, generateSlug } from "@/shared/lib/utils";
import type { Chapter } from "@/types/types";
import { GB, VN } from "country-flag-icons/react/3x2";
import { Clock, ExternalLink, Users } from "lucide-react";

interface LatestCardProps {
  chapter: Chapter;
}

export default function LatestCard({ chapter }: LatestCardProps) {
  return (
    <Card className="rounded-sm shadow-xs transition-colors duration-200">
      <CardContent className="flex gap-2 p-1">
        {!!chapter.manga.title && !!chapter.manga.cover && (
          <>
            <NoPrefetchLink
              href={`/manga/${chapter.manga.id}/${generateSlug(
                chapter.manga.title,
              )}`}
            >
              <MangaCover
                id={chapter.manga.id}
                cover={chapter.manga.cover}
                alt={chapter.manga.title}
                placeholder="/images/place-doro.webp"
                wrapper="w-20 h-auto border"
                className="h-28! w-20! object-cover!"
                quality="256"
                //isExpandable
              />
            </NoPrefetchLink>

            <div className="flex w-full flex-col justify-evenly">
              <NoPrefetchLink
                href={`/manga/${chapter.manga.id}/${generateSlug(
                  chapter.manga.title,
                )}`}
                className="line-clamp-1 text-lg font-bold break-all"
              >
                {chapter.manga.title}
              </NoPrefetchLink>

              <div className="flex items-center space-x-1">
                {chapter.language === "vi" && (
                  <VN className="inline-block h-5! w-5! shrink-0 select-none" />
                )}

                {chapter.language === "en" && (
                  <GB className="inline-block h-5! w-5! shrink-0 select-none" />
                )}
                {chapter.externalUrl && <ExternalLink size={16} />}
                <NoPrefetchLink
                  href={chapter.externalUrl ?? `/chapter/${chapter.id}`}
                  className="hover:underline"
                  target={chapter.externalUrl ? "_blank" : "_self"}
                >
                  <p className="line-clamp-1 text-sm font-semibold break-all md:text-base">
                    {chapter.chapter
                      ? `Ch. ${chapter.chapter}
      ${chapter.title ? ` - ${chapter.title}` : ""}`
                      : "Oneshot"}
                  </p>
                </NoPrefetchLink>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 justify-self-start">
                  <Users size={16} className="shrink-0" />
                  {chapter.group.length === 0 ? (
                    <span className="line-clamp-1 px-1 text-xs font-normal">
                      No Group
                    </span>
                  ) : (
                    <div className="flex items-center space-x-1">
                      {chapter.group.map((group) => (
                        <Button
                          asChild
                          key={group.id}
                          variant="ghost"
                          className="hover:text-primary line-clamp-1! h-4 shrink! rounded-sm px-1 py-0 text-start text-xs font-normal break-all whitespace-normal!"
                          size="sm"
                        >
                          <NoPrefetchLink
                            href={`/group/${group.id}/${generateSlug(group.name)}`}
                          >
                            {group.name}
                          </NoPrefetchLink>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex w-full max-w-max items-center justify-end space-x-1 pr-1">
                  <time
                    className="line-clamp-1 text-xs font-light"
                    dateTime={new Date(chapter.updatedAt).toDateString()}
                  >
                    {formatTimeToNow(new Date(chapter.updatedAt))}
                  </time>
                  <Clock size={16} className="hidden shrink-0 sm:flex" />
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
