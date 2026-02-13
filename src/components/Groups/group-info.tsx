"use client";

import { getGroup } from "@/lib/mangadex/group";
import Image from "next/image";
import useSWR from "swr";
import { Button } from "../ui/button";
import { Archive, Ban, Bookmark, Globe, Mail, ShieldUser } from "lucide-react";
import { toast } from "sonner";
import GroupStats from "./group-stats";
import Link from "next/link";
import { siteConfig } from "@/shared/config/site";
import { cn, isFacebookUrl } from "@/shared/lib/utils";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "../ui/label";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { SiDiscord, SiFacebook, SiX } from "@icons-pack/react-simple-icons";
import { CN, GB, JP, KR, VN } from "country-flag-icons/react/3x2";
import GroupTitles from "./GroupTitles";
import { Group } from "@/types/types";

interface GroupInfoProps {
  id: string;
  initialData?: Group;
}

export default function GroupInfo({ id, initialData }: GroupInfoProps) {
  const isMobile = useIsMobile();
  const { data, isLoading, error } = useSWR(
    ["group", id],
    ([, id]) => getGroup(id),
    {
      fallbackData: initialData, // Use server data as initial value
      revalidateOnMount: !initialData, // Only revalidate on mount if no initial data
      refreshInterval: 1000 * 60 * 10,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const displayLanguage = [
    { iso: "en", name: "Tiếng Anh", icon: GB },
    { iso: "vi", name: "Tiếng Việt", icon: VN },
    { iso: "ja", name: "Tiếng Nhật", icon: JP },
    { iso: "ko", name: "Tiếng Hàn", icon: KR },
    { iso: "zh", name: "Tiếng Trung", icon: CN },
  ];

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

        {/* <div
          className={cn(
            "md:hidden",
            "absolute h-50 md:h-64 w-auto inset-0 pointer-events-none backdrop-blur-[2px]"
          )}
          style={{
            background:
              "linear-gradient(to top, hsl(var(--background) / .6) 0%, hsl(var(--background)) 100%)",
          }}
        ></div> */}
      </div>
      <div className="mt-16 flex flex-col gap-4 md:mt-20 md:flex-row">
        <div className="flex flex-row items-end gap-2 md:shrink-0 md:flex-col">
          <Image
            src="/images/doro_think.webp"
            alt={data.name}
            width={isMobile ? 120 : 200}
            height={isMobile ? 120 : 200}
            className="border-primary shrink-0 rounded border-4 object-cover"
            unoptimized
          />
          <Button asChild className="flex-1 md:w-full md:flex-initial">
            <Link
              href={`${siteConfig.mangadexAPI.webURL}/group/${id}`}
              target="_blank"
            >
              <Archive />
              MangaDex
            </Link>
          </Button>
        </div>

        <div className="flex w-full flex-col gap-2 md:mt-[120px]">
          <p className="text-4xl font-bold md:text-5xl">{data.name}</p>
          <GroupStats id={id} />

          <Tabs defaultValue="info">
            <TabsList className="rounded-md">
              <TabsTrigger className="rounded-md" value="info">
                Thông tin
              </TabsTrigger>
              <TabsTrigger className="rounded-md" value="title">
                Truyện đã đăng
              </TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="flex flex-col gap-4">
              {!!data.description && (
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
                    {data.description}
                  </ReactMarkdown>
                </div>
              )}

              {(!!data.website ||
                !!data.discord ||
                !!data.email ||
                !!data.twitter) && (
                <div className="flex flex-col gap-2">
                  <Label className="text-lg font-bold">Liên hệ</Label>
                  <div className="flex flex-col items-center gap-2 md:flex-row">
                    {!!data.website && (
                      <Button
                        asChild
                        className="w-full justify-start md:w-auto"
                        variant="secondary"
                      >
                        <Link href={data.website} target="_blank">
                          {isFacebookUrl(data.website) ? (
                            <>
                              <SiFacebook />
                              Facebook
                            </>
                          ) : (
                            <>
                              <Globe />
                              Website
                            </>
                          )}
                        </Link>
                      </Button>
                    )}
                    {!!data.discord && (
                      <Button
                        asChild
                        className="w-full justify-start md:w-auto"
                        variant="secondary"
                      >
                        <Link
                          href={`https://discord.gg/${data.discord}`}
                          target="_blank"
                        >
                          <SiDiscord />
                          Discord
                        </Link>
                      </Button>
                    )}
                    {!!data.email && (
                      <Button
                        asChild
                        className="w-full justify-start md:w-auto"
                        variant="secondary"
                      >
                        <Link href={`mailto:${data.email}`} target="_blank">
                          <Mail />
                          Email
                        </Link>
                      </Button>
                    )}
                    {!!data.twitter && (
                      <Button
                        asChild
                        className="w-full justify-start md:w-auto"
                        variant="secondary"
                      >
                        <Link href={data.twitter} target="_blank">
                          <SiX />@
                          {data.twitter.replace("https://twitter.com/", "")}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {!!data.leader && (
                <div className="flex flex-col gap-2">
                  <Label className="text-lg font-bold">Trưởng nhóm</Label>
                  <Button
                    asChild
                    variant="secondary"
                    className="w-full justify-start md:w-fit md:justify-center"
                  >
                    <Link
                      href={`${siteConfig.mangadexAPI.webURL}/user/${data.leader.id}`}
                      target="_blank"
                    >
                      <ShieldUser />
                      {data.leader.username}
                    </Link>
                  </Button>
                </div>
              )}

              {data.language.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Label className="text-lg font-bold">Ngôn ngữ</Label>
                  <div className="flex flex-col items-center gap-2 md:flex-row">
                    {(() => {
                      // Filter known languages
                      const knownLangs = data.language.filter((lang) =>
                        displayLanguage.some((l) => l.iso === lang),
                      );

                      // Filter unknown languages
                      const unknownLangs = data.language.filter(
                        (lang) => !displayLanguage.some((l) => l.iso === lang),
                      );

                      // Create buttons for known languages
                      const knownButtons = knownLangs.map((lang) => {
                        const langInfo = displayLanguage.find(
                          (l) => l.iso === lang,
                        );
                        const LangIcon = langInfo?.icon;
                        return (
                          <Button
                            key={lang}
                            className="w-full justify-start md:w-auto"
                            variant="secondary"
                          >
                            {LangIcon && <LangIcon />}
                            {langInfo?.name}
                          </Button>
                        );
                      });

                      // Create button for unknown languages if any
                      const unknownButton =
                        unknownLangs.length > 0 ? (
                          <Button
                            key="other"
                            className="w-full justify-start md:w-auto"
                            variant="secondary"
                          >
                            <Globe />
                            Khác{" "}
                            {unknownLangs.length > 0 &&
                              `(+${unknownLangs.length})`}
                          </Button>
                        ) : null;

                      return [...knownButtons, unknownButton];
                    })()}
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="title">
              <GroupTitles id={id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
