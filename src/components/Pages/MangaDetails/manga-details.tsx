"use client";

import { ChapterList } from "@/components/Chapter/ChapterList";
import Banner from "@/features/manga/components/manga-banner";
import MangaCover from "@/features/manga/components/manga-cover";
import MangaDescription from "@/features/manga/components/manga-description";
import MangaMaintain from "@/features/manga/components/manga-maintain";
import MangaNotFound from "@/features/manga/components/manga-notfound";
import { MangaStatsComponent } from "@/features/manga/components/manga-stats";
import Tags from "@/features/manga/components/Tags";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { siteConfig } from "@/shared/config/site";
import { useConfig } from "@/shared/hooks/use-config";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { fetchMangaDetail } from "@/features/manga/api/manga";
import type { Artist, Author, Manga } from "@/types/types";
import {
  Archive,
  Bug,
  Ellipsis,
  ImagesIcon,
  LibraryBig,
  List,
  MessageSquare,
  Sprout,
  Square,
  SquareArrowOutUpRightIcon,
  SquareCheckBig,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import useSWR from "swr";
import MangaDetailsSkeleton from "./manga-details-skeleton";
import AddToLibraryBtn from "@/features/manga/components/add-to-library-btn";
import MangaCoversTab from "@/features/manga/components/manga-covers-tab";
import MangaSubInfo from "@/features/manga/components/manga-subinfo";
import CommentSection from "@/components/Comment/comment-section";
import { useCommentCount } from "@/shared/hooks/use-comment-count";
import MangaRecommendations from "@/features/manga/components/manga-recomendations";
import NoPrefetchLink from "@/shared/components/custom/no-prefetch-link";
import { WarpBackground } from "@/shared/components/ui/warp-background";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/shared/components/ui/card";
import { RainbowButton } from "@/shared/components/ui/rainbow-button";
import { MangaReadNowButton } from "@/features/manga/components/manga-readnow-button";

interface MangaDetailsProps {
  id: string;
  initialData?: Manga;
}

export default function MangaDetails({ id, initialData }: MangaDetailsProps) {
  const isMobile = useIsMobile();
  const [config, setConfig] = useConfig();

  const { count: cmtCount } = useCommentCount(id);

  const [showHiddenChapters, setShowHiddenChapters] = useState(false);

  const {
    data: manga,
    error,
    isLoading,
  } = useSWR(id, fetchMangaDetail, {
    fallbackData: initialData, // Use server data as initial value
    revalidateOnMount: !initialData, // Only revalidate on mount if no initial data
    refreshInterval: 1000 * 60 * 10,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true,
  });

  if (error?.status === 404) return <MangaNotFound />;
  if (error?.status === 503) return <MangaMaintain />;

  if (!manga || error) return <MangaDetailsSkeleton />;

  return (
    <>
      {/* R18 Warning */}
      {!config.r18 && manga.contentRating === "pornographic" && (
        <AlertDialog defaultOpen>
          <AlertDialogOverlay className="backdrop-blur-lg" />
          <AlertDialogContent className={`theme-${config.theme}`}>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Truyện có <span className="text-red-600">yếu tố 18+</span>, bạn
                có chắc chắn muốn xem?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Chọn &quot;Tiếp tục&quot; sẽ thiết lập tuỳ chỉnh R18 thành
                &quot;Hiện&quot;
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Link href="/">Quay lại</Link>
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  setConfig({
                    ...config,
                    r18: true,
                  })
                }
              >
                Tiếp tục
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Banner */}
      <Banner id={manga.id} src={manga.cover} />

      {/* Content */}
      <div className="grid grid-cols-1 gap-4">
        <div className="grid w-full grid-cols-[auto_1fr] gap-4">
          <div className="relative">
            <MangaCover
              id={manga.id}
              cover={manga.cover}
              alt={manga.title}
              placeholder="/images/place-doro.webp"
              className="shadow-md drop-shadow-md"
              wrapper="w-[130px] md:w-[200px] h-auto"
              isExpandable
            />
          </div>

          <div className="flex flex-col justify-between gap-2 md:hidden">
            <div className="flex flex-col gap-1.5">
              <p
                className="leading-[1.15] font-black drop-shadow-md"
                style={{
                  fontSize: `clamp(0.875rem, ${
                    manga.title.length <= 30
                      ? "7vw"
                      : manga.title.length <= 50
                        ? "6vw"
                        : manga.title.length <= 70
                          ? "5vw"
                          : "4.5vw"
                  }, 3rem)`,
                  overflowWrap: "break-word",
                }}
              >
                {manga.title}
              </p>
              {!!manga.altTitle && (
                <h2 className="line-clamp-2 text-base leading-5 drop-shadow-md">
                  {manga.altTitle}
                </h2>
              )}

              <AuthorArtistNames
                authors={manga.author}
                artists={manga.artist}
                className="line-clamp-1 max-w-[80%] text-sm"
              />
            </div>
            {!!manga.stats && (
              <MangaStatsComponent stats={manga.stats} size="sm" />
            )}
          </div>

          <div className="hidden flex-col md:flex">
            <div className="flex h-54 flex-col justify-between pb-2">
              <div className="flex flex-col">
                <p
                  className="leading-[1.15] font-black wrap-break-word drop-shadow-md"
                  style={{
                    fontSize: `clamp(2.25rem, ${
                      manga.title.length <= 20
                        ? "5vw"
                        : manga.title.length <= 35
                          ? "4.2vw"
                          : manga.title.length <= 50
                            ? "3.6vw"
                            : manga.title.length <= 70
                              ? "3.1vw"
                              : "2.6vw"
                    }, 5rem)`,
                  }}
                >
                  {manga.title}
                </p>
                {!!manga.altTitle && (
                  <span
                    className="line-clamp-1 text-lg drop-shadow-md"
                    title={manga.altTitle}
                  >
                    {manga.altTitle}
                  </span>
                )}
              </div>

              <AuthorArtistNames
                authors={manga.author}
                artists={manga.artist}
              />
            </div>

            <div className="flex flex-col gap-4 pt-[0.85rem]">
              <div className="flex flex-wrap gap-2">
                <AddToLibraryBtn manga={manga} />

                <MangaReadNowButton id={id} language={manga.language} />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="h-10 w-10 rounded-sm"
                      variant="secondary"
                      size="icon"
                    >
                      <Ellipsis />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className={`theme-${config.theme}`}>
                    <DropdownMenuItem>
                      <Link
                        href={`${siteConfig.mangadexAPI.webURL}/title/${manga.id}`}
                        target="_blank"
                        className="flex items-center gap-2"
                      >
                        <Archive size={18} />
                        MangaDex
                      </Link>
                    </DropdownMenuItem>
                    {!!manga.raw && (
                      <DropdownMenuItem>
                        <Link
                          href={manga.raw}
                          target="_blank"
                          className="flex items-center gap-2"
                        >
                          <LibraryBig size={18} />
                          Raw
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem>
                      <Link
                        href={`${siteConfig.social.facebook.href}`}
                        target="_blank"
                        className="flex items-center gap-2"
                      >
                        <Bug size={18} />
                        Báo lỗi
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-wrap gap-1">
                <Tags
                  tags={manga.tags}
                  contentRating={manga.contentRating}
                  status={manga.status}
                />
              </div>

              {!!manga.stats && (
                <MangaStatsComponent stats={manga.stats} size="lg" />
              )}
            </div>
          </div>
        </div>

        {/* Mato Seihei Banner */}
        {manga.id === siteConfig.mangadexAPI.matoSeiheiID &&
          config.translatedLanguage.includes("vi") && (
            <WarpBackground className="p-10 md:p-20">
              <Card className="bg-card/60 rounded-sm border-0 shadow-none">
                <CardContent className="flex flex-col gap-2 p-4">
                  <CardTitle className="flex flex-col items-center gap-2 text-2xl md:flex-row">
                    <span className="text-center md:text-left">
                      Đọc Mato Seihei cập nhật mới nhất
                    </span>
                    <RainbowButton
                      className="w-full text-white uppercase md:w-auto dark:text-black"
                      asChild
                    >
                      <NoPrefetchLink
                        href={siteConfig.mangadexAPI.baseUrl}
                        target="_blank"
                      >
                        <SquareArrowOutUpRightIcon />
                        tại đây
                      </NoPrefetchLink>
                    </RainbowButton>
                  </CardTitle>
                  <CardDescription className="text-justify md:text-left">
                    Tôi biết cái này nhìn đần vcl nhưng phải làm thế cho nó đập
                    vào mắt các ông được 🤡
                    <br />
                    Vì lý do bản quyền, tôi không thể đăng truyện này lên
                    MangaDex được nữa, bởi thế nên mới mọc thêm cái nút bên
                    trên.
                  </CardDescription>
                </CardContent>
              </Card>
            </WarpBackground>
          )}

        <div className="flex flex-wrap gap-1 md:hidden">
          <Tags
            tags={manga.tags}
            contentRating={manga.contentRating}
            status={manga.status}
          />
        </div>

        <div className="flex w-full flex-wrap gap-2 md:hidden">
          <AddToLibraryBtn manga={manga} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="grow-0 rounded-sm"
                variant="secondary"
                size="icon"
              >
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={`theme-${config.theme}`}>
              <DropdownMenuItem>
                <Link
                  href={`${siteConfig.mangadexAPI.webURL}/title/${manga.id}`}
                  target="_blank"
                  className="flex items-center gap-2"
                >
                  <Archive size={18} />
                  MangaDex
                </Link>
              </DropdownMenuItem>
              {!!manga.raw && (
                <DropdownMenuItem>
                  <Link
                    href={manga.raw}
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    <LibraryBig size={18} />
                    Raw
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem>
                <Link
                  href={`${siteConfig.social.facebook.href}`}
                  target="_blank"
                  className="flex items-center gap-2"
                >
                  <Bug size={18} />
                  Báo lỗi
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <MangaReadNowButton id={id} language={manga.language} />
        </div>

        <MangaDescription
          content={manga.description.content}
          language={
            manga.description.content ? manga.description.language : "vi"
          }
          maxHeight={160}
          manga={manga}
        />

        <div className="flex w-full flex-row gap-4">
          <div className="hidden max-w-[400px] min-w-[25%] pt-2 xl:block">
            <MangaSubInfo manga={manga} />
          </div>

          <div className="w-full">
            <Tabs defaultValue="chapter">
              <div className="relative h-12 overflow-x-auto">
                <TabsList className="absolute rounded-sm">
                  <TabsTrigger
                    value="chapter"
                    className="flex gap-1 rounded-sm px-2"
                  >
                    <List size={18} />
                    Danh sách chương
                  </TabsTrigger>
                  <TabsTrigger
                    value="comment"
                    className="flex gap-1 rounded-sm px-2"
                  >
                    <MessageSquare size={18} />
                    Bình luận
                    {!!cmtCount && cmtCount > 0 && (
                      <span>({cmtCount.toLocaleString("en-US")})</span>
                    )}
                  </TabsTrigger>

                  <TabsTrigger
                    value="art"
                    className="flex gap-1 rounded-sm px-2"
                  >
                    <ImagesIcon size={18} />
                    Ảnh bìa
                  </TabsTrigger>

                  <TabsTrigger
                    value="recommendation"
                    className="flex gap-1 rounded-sm px-2"
                  >
                    <Sprout size={18} />
                    Có thể bạn sẽ thích
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="chapter" className="mt-0">
                <Button
                  variant="ghost"
                  className="px-0! text-base whitespace-normal! hover:bg-transparent! [&_svg]:size-5"
                  size="lg"
                  onClick={() => setShowHiddenChapters(!showHiddenChapters)}
                >
                  {showHiddenChapters ? (
                    <SquareCheckBig className="text-primary" strokeWidth={3} />
                  ) : (
                    <Square strokeWidth={3} />
                  )}
                  <span className="line-clamp-1 break-all!">
                    Hiển thị các chương ẩn (nếu có)
                  </span>
                </Button>

                <ChapterList
                  language={config.translatedLanguage}
                  limit={100}
                  mangaID={manga.id}
                  finalChapter={manga.finalChapter}
                  r18={config.r18}
                  showUnavailable={showHiddenChapters}
                />
              </TabsContent>

              <TabsContent value="comment" className="mt-0">
                <CommentSection
                  id={manga.id}
                  type="manga"
                  title={manga.title}
                />
              </TabsContent>

              <TabsContent value="art" className="mt-0">
                <MangaCoversTab id={manga.id} />
              </TabsContent>

              <TabsContent value="recommendation" className="mt-0">
                <MangaRecommendations id={manga.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}

// Memoized component for author/artist names
const AuthorArtistNames = ({
  authors,
  artists,
  className = "drop-shadow-md text-sm line-clamp-1 break-all",
}: {
  authors: Author[];
  artists: Artist[];
  className?: string;
}) => {
  const names = useMemo(() => {
    return [
      ...new Set([
        ...authors.map((a: Author) => a.name),
        ...artists.map((a: Artist) => a.name),
      ]),
    ].join(", ");
  }, [authors, artists]);

  return <p className={className}>{names}</p>;
};
