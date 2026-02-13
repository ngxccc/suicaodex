"use client";

import { getCovers } from "@/lib/mangadex/cover";
import { Expand, Globe, Loader2 } from "lucide-react";
import useSWR from "swr";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { cn, getCoverImageUrl } from "@/shared/lib/utils";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../../../components/ui/dialog";
import { GB, JP, VN } from "country-flag-icons/react/3x2";
import { MultiSelect } from "../../../components/ui/multi-select";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import type { Cover } from "@/types/types";
import Image from "next/image";

interface MangaCoversTabProps {
  id: string;
}

export default function MangaCoversTab({ id }: MangaCoversTabProps) {
  const isMobile = useIsMobile();
  const { data, error, isLoading } = useSWR(
    ["manga-covers", [id]],
    ([, [id]]) => getCovers([id]),
    {
      refreshInterval: 1000 * 60 * 30,
      revalidateOnFocus: false,
    },
  );
  const [loaded, setLoaded] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState(["ja", "vi"]);

  if (isLoading)
    return (
      <div className="flex h-16 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  if (error) {
    return (
      <Card className="mt-2 flex h-16 w-full items-center justify-center rounded-sm">
        <p className="italic">Lỗi mất rồi 😭</p>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="mt-2 flex h-16 w-full items-center justify-center rounded-sm">
        <p className="italic">Không có kết quả!</p>
      </Card>
    );
  }

  // console.log(data);
  const localeList = [
    { value: "ja", label: "Tiếng Nhật", icon: JP },
    { value: "vi", label: "Tiếng Việt", icon: VN },
    { value: "en", label: "Tiếng Anh", icon: GB },
    { value: "other", label: "Khác", icon: Globe },
  ];

  // console.log("filtered: ", filterByLocale(selectedLocale, data));

  return (
    <>
      <MultiSelect
        className="mt-2 w-full shadow-xs"
        placeholder="Mặc định"
        disableFooter
        disableSearch
        onValueChange={setSelectedLocale}
        options={localeList}
        defaultValue={selectedLocale}
        maxCount={isMobile ? 1 : 4}
      />

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filterByLocale(selectedLocale, data).map((cover) => (
          <Card
            key={cover.id}
            className="relative w-full rounded-sm border-none shadow-md drop-shadow-md transition-colors duration-200"
          >
            <Dialog>
              <DialogTrigger className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-sm bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                <Expand size={45} color="white" />
              </DialogTrigger>

              <DialogContent className="h-auto w-full justify-center rounded-none! border-0 border-none bg-transparent p-0 shadow-none [&>button]:hidden">
                <DialogTitle className="hidden"></DialogTitle>
                <DialogDescription className="hidden"></DialogDescription>

                <DialogClose className="fixed inset-0 z-0 block! cursor-default" />
                <div className="relative z-10 flex max-h-[90vh] max-w-[90vw] items-center justify-center md:max-w-screen lg:max-h-screen">
                  <div className="bg-secondary absolute rounded-sm p-5">
                    <Loader2 className="animate-spin" size={50} />
                  </div>
                  <Image
                    src={getCoverImageUrl(id, cover.fileName, "full")}
                    alt={`Ảnh bìa ${cover.volume}`}
                    className="z-20 max-h-full max-w-full object-cover"
                    fetchPriority="high"
                    onError={(e) => {
                      e.currentTarget.src = "/images/xidoco.webp";
                    }}
                    width={500}
                    height={500}
                  />
                </div>
              </DialogContent>
            </Dialog>

            <CardContent className="w-full p-0">
              <LazyLoadImage
                wrapperClassName={cn(
                  "block! rounded-sm object-cover w-full",
                  !loaded && "aspect-5/7",
                )}
                placeholderSrc="/images/place-doro.webp"
                className={cn(
                  "block aspect-5/7 w-full rounded-sm object-cover",
                )}
                src={getCoverImageUrl(id, cover.fileName, "512")}
                alt={`Ảnh bìa tập ${cover.volume}`}
                onLoad={() => setLoaded(true)}
                onError={(e) => {
                  e.currentTarget.src = "/images/xidoco.webp";
                }}
                //visibleByDefault
              />
            </CardContent>
            <CardFooter className="absolute bottom-0 max-h-full w-full items-end rounded-b-sm bg-linear-to-t from-black p-2 dark:rounded-b-none">
              <p className="line-clamp-1 text-base font-semibold break-all text-white drop-shadow-xs hover:line-clamp-none">
                {cover.volume ? `Volume ${cover.volume}` : "No Volume"}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}

function filterByLocale(locales: string[], covers: Cover[]): Cover[] {
  if (locales.length === 0)
    return covers.filter((cover) => {
      const coverLocale = cover.locale;
      return ["ja", "vi"].includes(coverLocale);
    });

  if (locales.length === 1 && locales.includes("other"))
    return covers.filter((cover) => {
      const coverLocale = cover.locale;
      return !["ja", "vi", "en"].includes(coverLocale);
    });

  if (locales.length === 4 && locales.includes("other")) return covers;

  return covers.filter((cover) => {
    const coverLocale = cover.locale;
    return locales.includes(coverLocale);
  });
}
