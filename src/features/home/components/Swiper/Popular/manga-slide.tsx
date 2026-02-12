"use client";

import { cn, generateSlug, getCoverImageUrl } from "@/lib/utils";
import type { Artist, Author, Manga } from "@/types/types";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import Tags from "@/features/manga/components/Tags";
import MangaCover from "@/features/manga/components/manga-cover";
import { useIsMobile } from "@/hooks/use-mobile";
import NoPrefetchLink from "@/components/Custom/no-prefetch-link";
import Image from "next/image";

interface MangaSlideProps {
  manga: Manga;
  priority?: boolean;
}

export default function MangaSlide({
  manga,
  priority = false,
}: MangaSlideProps) {
  const isMobile = useIsMobile();
  const bannerSrc = manga.cover
    ? getCoverImageUrl(manga.id, manga.cover, "full")
    : "/images/place-doro.webp";
  const slug = generateSlug(manga.title);

  return (
    <>
      {/* Banner */}
      <div className="absolute top-0 right-0 left-0 z-[-2] block h-[324px] w-auto md:h-[400px]">
        <Image
          src={bannerSrc}
          alt={manga.title}
          fill
          priority={priority}
          className="object-cover object-[center_top_25%]"
          sizes="100vw"
        />

        <div
          className={cn(
            "pointer-events-none absolute inset-0 h-[324px] w-auto md:h-[400px]",
            "from-background/25 to-background bg-linear-to-b backdrop-blur-[0.5px]",
          )}
        ></div>
      </div>

      {/* Manga */}

      <div
        className={cn(
          "flex h-full gap-4 px-4 pt-28 md:pl-8 lg:pl-12",
          "md:pr-[calc(32px+var(--sidebar-width-icon))] lg:pr-[calc(48px+var(--sidebar-width-icon))]",
        )}
      >
        <NoPrefetchLink href={`/manga/${manga.id}/${slug}`}>
          <MangaCover
            id={manga.id}
            cover={manga.cover ?? ""}
            alt={manga.title}
            placeholder="/images/place-doro.webp"
            className="aspect-7/10 object-cover! shadow-md drop-shadow-md"
            wrapper="w-[130px] md:w-[200px] lg:w-[215px] h-auto"
            preload={true}
          />
        </NoPrefetchLink>

        <div
          className="grid h-full min-h-0 gap-6 pb-8 sm:gap-2 md:pb-1.5 lg:pb-1"
          style={{
            gridTemplateRows: isMobile
              ? "1fr auto"
              : "max-content min-content auto max-content",
          }}
        >
          <NoPrefetchLink href={`/manga/${manga.id}/${slug}`}>
            <p className="line-clamp-5 overflow-hidden text-xl font-black drop-shadow-md sm:line-clamp-2 lg:text-4xl lg:leading-11!">
              {manga.title}
            </p>
          </NoPrefetchLink>

          <div className="hidden flex-wrap gap-1 md:flex">
            <Tags
              tags={manga.tags}
              contentRating={manga.contentRating}
              status={manga.status}
            />
          </div>

          <div className="relative hidden min-h-0 overflow-auto md:block">
            <div className="relative overflow-hidden">
              <ReactMarkdown
                className="text-sm"
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
                {manga.description.content}
              </ReactMarkdown>
            </div>
          </div>

          <p className="line-clamp-1 max-w-full self-end text-base font-medium italic md:max-w-[80%] md:text-lg">
            {[
              ...new Set([
                ...manga.author.map((a: Author) => a.name),
                ...manga.artist.map((a: Artist) => a.name),
              ]),
            ].join(", ")}
          </p>
        </div>
      </div>
    </>
  );
}
