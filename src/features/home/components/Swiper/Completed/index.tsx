"use client";

import { Button } from "@/components/ui/button";
import { useConfig } from "@/hooks/use-config";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import DoroLoading from "#/images/doro-loading.gif";
import { Marquee } from "@/components/ui/marquee";
import RecentlyCard from "../../Recently/recently-card";
import NoPrefetchLink from "@/components/Custom/no-prefetch-link";
import { generateSlug } from "@/lib/utils";
import { getCompletedMangas } from "@/features/manga/api/manga";

export default function CompletedSwiper() {
  const [config] = useConfig();
  const { data, error, isLoading } = useSWR(
    ["completed", config.translatedLanguage, config.r18],
    ([, language, r18]) => getCompletedMangas(language, r18),
    {
      refreshInterval: 1000 * 60 * 10,
      revalidateOnFocus: false,
    },
  );

  if (isLoading)
    return (
      <div className="flex flex-col">
        <hr className="bg-primary h-1 w-9 border-none" />
        <h1 className="text-2xl font-black uppercase">đã hoàn thành</h1>

        <Alert className="rounded-sm border-none">
          <AlertDescription className="flex justify-center">
            <Image
              src={DoroLoading}
              alt="Loading..."
              unoptimized
              priority
              className="h-auto w-20"
            />
          </AlertDescription>
        </Alert>
      </div>
    );

  if (error || !data) return null;
  const firstRow = data.slice(0, data.length / 2);
  const secondRow = data.slice(data.length / 2, data.length);

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex justify-between">
        <div>
          <hr className="bg-primary h-1 w-9 border-none" />
          <h1 className="text-2xl font-black uppercase">Đã hoàn thành</h1>
        </div>

        <Button asChild size="icon" variant="ghost" className="[&_svg]:size-6">
          <Link href={`/advanced-search?status=completed`}>
            <ArrowRight className="size-6!" />
          </Link>
        </Button>
      </div>

      <div className="grid h-[450px] grid-cols-1 grid-rows-2 gap-3 md:h-[650px]">
        <Marquee pauseOnHover className="p-0 [--duration:75s]">
          {firstRow.map((manga) => (
            <NoPrefetchLink
              key={manga.id}
              href={`/manga/${manga.id}/${generateSlug(manga.title)}`}
            >
              <RecentlyCard manga={manga} className="aspect-5/7" />
            </NoPrefetchLink>
          ))}
        </Marquee>

        <Marquee reverse pauseOnHover className="p-0 [--duration:75s]">
          {secondRow.map((manga) => (
            <NoPrefetchLink
              key={manga.id}
              href={`/manga/${manga.id}/${generateSlug(manga.title)}`}
            >
              <RecentlyCard manga={manga} className="aspect-5/7" />
            </NoPrefetchLink>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
