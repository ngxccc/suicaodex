"use client";

import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { siteConfig } from "@/shared/config/site";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { GetAuthor } from "@/lib/mangadex/author";
import { cn } from "@/shared/lib/utils";
import { Archive, Bookmark, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import useSWR from "swr";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { AuthorDetail } from "@/types/types";
import {
  SiNaver,
  SiNiconico,
  SiPixiv,
  SiSinaweibo,
  SiTumblr,
  SiX,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
import { Icons } from "@/shared/components/graphics/icons";
import { Card } from "@/shared/components/ui/card";
import AuthorTitles from "./author-titles";

interface AuthorProps {
  id: string;
  initialData?: AuthorDetail;
}

export default function Author({ id, initialData }: AuthorProps) {
  const isMobile = useIsMobile();
  const { data, isLoading, error } = useSWR(
    ["author", id],
    ([, id]) => GetAuthor(id),
    {
      fallbackData: initialData, // Use server data as initial value
      revalidateOnMount: !initialData, // Only revalidate on mount if no initial data
      refreshInterval: 1000 * 60 * 10,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  if (isLoading)
    return (
      <div className="absolute top-0 right-0 left-0 z-[-2] block h-50 w-auto bg-gray-300 ease-in-out md:h-64">
        <div
          className={cn(
            "absolute h-50 w-full md:h-64",
            "transition-[width] duration-150 ease-in-out",
            "bg-cover bg-position-[center_top_25%] bg-no-repeat",
          )}
          // style={{ backgroundImage: `url('/images/frieren.webp')` }}
        ></div>
        <div
          className={cn(
            "pointer-events-none absolute inset-0 h-50 w-auto md:h-64",
            // "backdrop-blur-none md:backdrop-blur-xs",
            "bg-linear-to-r from-black/25 to-transparent",
          )}
        ></div>
      </div>
    );
  if (error || !data) return <div>Lỗi mất rồi 😭</div>;

  // console.log(data);

  const socialEntries = formatToArray(data);
  const socialIcons = {
    twitter: <SiX />,
    pixiv: <SiPixiv />,
    melonBook: <Icons.melonbook />,
    fanBox: <Icons.fanbox />,
    booth: <Icons.booth />,
    namicomi: <Icons.namicomi />,
    nicoVideo: <SiNiconico />,
    skeb: <Icons.skeb />,
    fantia: <Icons.fantia />,
    tumblr: <SiTumblr />,
    youtube: <SiYoutube />,
    naver: <SiNaver />,
    weibo: <SiSinaweibo />,
    website: <Globe />,
  };
  return (
    <>
      <div className="absolute top-0 right-0 left-0 z-[-2] block h-50 w-auto md:h-64">
        <div
          className={cn(
            "absolute h-50 w-full md:h-64",
            "transition-[width] duration-150 ease-in-out",
            "bg-cover bg-position-[center_top_25%] bg-no-repeat",
          )}
          style={{ backgroundImage: `url('/images/frieren.webp')` }}
        ></div>
        <div
          className={cn(
            "pointer-events-none absolute inset-0 h-50 w-auto md:h-64",
            // "backdrop-blur-none md:backdrop-blur-xs",
            "bg-linear-to-r from-black/25 to-transparent",
          )}
        ></div>
      </div>

      <div className="mt-16 flex flex-col gap-4 md:mt-20 md:flex-row">
        <div className="flex flex-row items-end gap-2 md:shrink-0 md:flex-col">
          <Image
            src={data.imageUrl || "/images/hoxilo.webp"}
            alt={data.name}
            width={isMobile ? 120 : 200}
            height={isMobile ? 120 : 200}
            className="border-primary h-[120px] w-[120px] shrink-0 rounded border-4 object-cover md:h-[200px] md:w-[200px]"
            unoptimized
          />
          <div className="scrollbar-hidden flex w-full flex-row gap-2 overflow-auto md:flex-col">
            <Button
              className="w-full"
              // size={isMobile ? "lg" : "default"}
              onClick={() => toast.info("Chức năng đang phát triển!")}
            >
              <Bookmark />
              Theo dõi
            </Button>

            <Button
              asChild
              size={isMobile ? "icon" : "default"}
              className={cn(isMobile && "shrink-0")}
            >
              <Link
                href={`${siteConfig.mangadexAPI.webURL}/author/${id}`}
                target="_blank"
              >
                <Archive />
                {!isMobile && "MangaDex"}
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 md:mt-[120px]">
          <p className="text-4xl font-bold md:text-5xl">{data.name}</p>

          {!data.bio && socialEntries.length === 0 && (
            <Card className="flex h-16 w-full items-center justify-center rounded-sm">
              Hổng có thông tin gì hết trơn!
            </Card>
          )}

          {!!data.bio && (
            <div className="flex flex-col gap-2">
              <Label className="text-lg font-bold">Mô tả</Label>
              <ReactMarkdown
                className="flex flex-col gap-1"
                remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                components={{
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {children}
                    </a>
                  ),
                  table: ({ children }) => (
                    <table className="border-secondary w-fit table-auto border-collapse rounded-md border">
                      {children}
                    </table>
                  ),
                  thead: ({ children }) => (
                    <thead className="border-secondary border-b">
                      {children}
                    </thead>
                  ),
                  tr: ({ children }) => (
                    <tr className="even:bg-secondary">{children}</tr>
                  ),
                  th: ({ children }) => (
                    <th className="px-2 py-1 text-left">{children}</th>
                  ),
                  td: ({ children }) => (
                    <td className="px-2 py-1">{children}</td>
                  ),
                }}
              >
                {data.bio}
              </ReactMarkdown>
            </div>
          )}

          {socialEntries.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label className="text-lg font-bold">Mạng xã hội</Label>
              <div className="flex flex-wrap gap-2">
                {socialEntries.map((item) => {
                  const icon =
                    socialIcons[item.name as keyof typeof socialIcons];
                  return (
                    <Button
                      key={item.name}
                      asChild
                      variant="secondary"
                      className="hover:bg-primary/25 w-full justify-start md:w-auto"
                    >
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-row items-center gap-2 capitalize"
                      >
                        {icon}
                        {item.name}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          <AuthorTitles id={id} />
        </div>
      </div>
    </>
  );
}

function formatToArray(author: AuthorDetail) {
  const socialEntries = Object.entries(author.social);
  return socialEntries
    .filter(([_, url]) => url !== null)
    .map(([name, url]) => ({
      name,
      url: url as string,
    }));
}
