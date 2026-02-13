import { ChapterTitle } from "@/features/chapter/components/ChapterReader/chapter-info";
import NoPrefetchLink from "@/shared/components/custom/no-prefetch-link";
import { Button } from "@/shared/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/shared/components/ui/card";
import { formatTimeToNow } from "@/shared/lib/utils";
import { Chapter } from "@/shared/types/common";
import { GB, VN } from "country-flag-icons/react/3x2";
import { Clock, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface HistoryCompactCardProps {
  chapter: Chapter;
}

export default function HistoryCompactCard({
  chapter,
}: HistoryCompactCardProps) {
  const title = ChapterTitle(chapter);
  const router = useRouter();
  return (
    <Card className="w-full rounded-sm shadow-xs transition-colors duration-200">
      <CardHeader className="line-clamp-2 border-b px-2 py-1 font-bold break-all md:line-clamp-1">
        <NoPrefetchLink href={`/manga/${chapter.manga.id}`}>
          {chapter.manga.title}
        </NoPrefetchLink>
      </CardHeader>
      <CardFooter className="hover:bg-secondary w-full px-2 py-1">
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
      </CardFooter>
    </Card>
  );
}
