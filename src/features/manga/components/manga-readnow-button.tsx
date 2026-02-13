"use client";

import { useConfig } from "@/shared/hooks/use-config";
import { FirstChapters } from "@/features/manga/api/manga";
import { getChapterAggregate } from "@/lib/mangadex/chapter";
import { useState, memo } from "react";
import { Button } from "../../../shared/components/ui/button";
import { BookOpen, BookX, Loader2 } from "lucide-react";
import useReadingHistory from "@/shared/hooks/use-reading-history";
import useSWR from "swr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../shared/components/ui/dialog";
import { SingleCard } from "../../../components/Chapter/ChapterList/chapter-card";
import NoPrefetchLink from "../../../shared/components/custom/no-prefetch-link";
import { useRouter } from "next/navigation";

interface MangaReadNowButtonProps {
  id: string; //mangaid
  language: string[];
}

export function MangaReadNowButton({ id, language }: MangaReadNowButtonProps) {
  const [config] = useConfig();
  const [shouldFetch, setShouldFetch] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();

  const { history } = useReadingHistory();
  const readingHistory = history[id];

  const hasMatchingLanguage =
    language.length > 0 &&
    config.translatedLanguage.some((lang) => language.includes(lang));

  const { data: chapters, isLoading } = useSWR(
    shouldFetch && !readingHistory && hasMatchingLanguage
      ? [`chapters-${id}`, config.translatedLanguage, config.r18]
      : null,
    async () => {
      const aggregate = await getChapterAggregate(
        id,
        config.translatedLanguage,
      );
      if (!aggregate || aggregate.length === 0) {
        return [];
      }

      const oldestVolume = aggregate[aggregate.length - 1];
      const oldestChapter =
        oldestVolume.chapters[oldestVolume.chapters.length - 1];

      const result = await FirstChapters(
        id,
        config.r18,
        config.translatedLanguage,
        oldestVolume.vol,
        oldestChapter.chapter,
      );
      return result;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (!data || data.length === 0) return;

        if (data.length === 1) {
          router.push(`/chapter/${data[0].id}`);
        } else {
          setShowDialog(true);
        }
      },
    },
  );

  const handleReadNow = () => {
    if (chapters && chapters.length > 0) {
      if (chapters.length === 1) {
        router.push(`/chapter/${chapters[0].id}`);
      } else {
        setShowDialog(true);
      }
    } else {
      setShouldFetch(true);
    }
  };

  if (readingHistory) {
    const label = readingHistory.chapter
      ? `Đọc tiếp Ch. ${readingHistory.chapter}`
      : `Đọc tiếp`;
    return (
      <Button
        variant="secondary"
        className="grow rounded-sm md:h-10 md:grow-0"
        asChild
      >
        <NoPrefetchLink href={`/chapter/${readingHistory.chapterId}`}>
          <BookOpen />
          {label}
        </NoPrefetchLink>
      </Button>
    );
  }

  if (!hasMatchingLanguage) {
    return (
      <Button
        variant="secondary"
        disabled
        className="grow rounded-sm md:h-10 md:grow-0"
      >
        <BookOpen />
        Đọc ngay
      </Button>
    );
  }

  if (chapters?.length === 0) {
    return (
      <Button
        variant="secondary"
        disabled
        className="grow rounded-sm md:h-10 md:grow-0"
      >
        <BookX />
        Đọc ngay
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="secondary"
        className="grow rounded-sm md:h-10 md:grow-0"
        onClick={handleReadNow}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <BookOpen />}
        Đọc ngay
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl!">
          <DialogHeader>
            <DialogTitle>Chọn chapter</DialogTitle>
            <DialogDescription>Chọn chapter bạn muốn đọc</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            {chapters?.map((chapter) => (
              <SingleCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(MangaReadNowButton);
