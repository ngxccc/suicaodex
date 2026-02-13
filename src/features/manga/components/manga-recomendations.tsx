"use client";

import { useConfig } from "@/shared/hooks/use-config";
import { getRecommendedMangas } from "@/features/manga/api/manga";
import { Loader2, Terminal } from "lucide-react";
import useSWR from "swr";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../shared/components/ui/alert";
import NoPrefetchLink from "../../../shared/components/custom/no-prefetch-link";
import RecentlyCard from "../../home/components/Recently/recently-card";
import { generateSlug } from "@/shared/lib/utils";

interface MangaRecommendationsProps {
  id: string;
}
export default function MangaRecommendations({
  id,
}: MangaRecommendationsProps) {
  const [config] = useConfig();
  const { data, error, isLoading } = useSWR(
    ["manga-recommendations", id, config.r18],
    ([, id, r18]) => getRecommendedMangas(id, r18),
    {
      refreshInterval: 1000 * 60 * 30,
      revalidateOnFocus: false,
    },
  );
  if (isLoading) {
    return (
      <div className="flex h-16 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="bg-secondary mt-2 rounded-sm">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Uoh Uohhhhhh 😭</AlertTitle>
        <AlertDescription>Lỗi mất rồi..</AlertDescription>
      </Alert>
    );
  }
  if (!data || data.length === 0) {
    return (
      <Alert className="bg-secondary mt-2 rounded-sm">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Ehe! 🤪</AlertTitle>
        <AlertDescription>
          Mục này sẽ gợi ý những truyện tương tự, cùng thể loại...Nhưng truyện
          này thì đếch có gì cả!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {data.map((manga) => (
        <NoPrefetchLink
          key={manga.id}
          href={`/manga/${manga.id}/${generateSlug(manga.title)}`}
        >
          <RecentlyCard manga={manga} />
        </NoPrefetchLink>
      ))}
    </div>
  );
}
