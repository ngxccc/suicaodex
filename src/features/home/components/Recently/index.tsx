"use client";

import { Button } from "@/components/ui/button";
import { useConfig } from "@/shared/hooks/use-config";
import { getRecentlyMangas } from "@/features/manga/api/manga";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import RecentlyCard from "./recently-card";
import { Skeleton } from "@/components/ui/skeleton";
import NoPrefetchLink from "@/components/Custom/no-prefetch-link";
import { generateSlug } from "@/shared/lib/utils";

export default function RecentlyAdded() {
  const [config] = useConfig();
  const { data, error, isLoading } = useSWR(
    ["recently", 18, config.translatedLanguage, config.r18],
    ([, limit, language, r18]) => getRecentlyMangas(limit, language, r18),
    {
      refreshInterval: 1000 * 60 * 10,
    },
  );

  if (isLoading)
    return (
      <div className="flex flex-col">
        <hr className="bg-primary h-1 w-9 border-none" />
        <h1 className="text-2xl font-black uppercase">Truyện mới</h1>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[300px] w-full rounded-sm bg-gray-500"
            />
          ))}
        </div>
      </div>
    );

  if (error || !data) return null;

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <div>
          <hr className="bg-primary h-1 w-9 border-none" />
          <h1 className="text-2xl font-black uppercase">Truyện mới</h1>
        </div>

        <Button asChild size="icon" variant="ghost" className="[&_svg]:size-6">
          <Link href={`/recent`}>
            <ArrowRight className="size-6" />
          </Link>
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {data.mangas.map((manga) => (
          <NoPrefetchLink
            key={manga.id}
            href={`/manga/${manga.id}/${generateSlug(manga.title)}`}
          >
            <RecentlyCard manga={manga} />
          </NoPrefetchLink>
        ))}
      </div>
    </div>
  );
}
