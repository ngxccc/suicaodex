"use client";

import { useConfig } from "@/hooks/use-config";
import { getTopFollowedMangas } from "@/features/manga/api/manga";
import useSWR from "swr";
import TopFollowedCard from "./top-followed-card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import LeaderBoardCardSkeleton from "../leaderboard-card-skeleon";

export default function TopFollowed() {
  const [config] = useConfig();
  const { data, error, isLoading } = useSWR(
    ["follow", config.translatedLanguage, config.r18],
    ([, language, r18]) => getTopFollowedMangas(language, r18),
    {
      refreshInterval: 1000 * 60 * 10,
      revalidateOnFocus: false,
    },
  );

  if (isLoading)
    return (
      <div className="grid grid-cols-1 gap-1.5 rounded-sm">
        {[...Array(4)].map((_, index) => (
          <LeaderBoardCardSkeleton key={index} />
        ))}
      </div>
    );
  if (error || !data) return null;

  return (
    <div className="grid grid-cols-1 gap-1.5 rounded-sm">
      {data.map((manga, index) => (
        <div key={manga.id} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-1.5">
            <TopFollowedCard key={manga.id} manga={manga} />
            <span
              className={cn(
                "text-7xl font-black md:text-8xl",
                index === 0 && "text-primary",
              )}
            >
              {index + 1}
            </span>
          </div>

          {index !== data.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
}
