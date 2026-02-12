"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn, generateSlug, getCoverImageUrl } from "@/lib/utils";
import type { Manga } from "@/types/types";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import NoPrefetchLink from "@/components/Custom/no-prefetch-link";

interface MangaCompletedCardProps {
  manga: Manga;
}

export default function MangaCompletedCard({ manga }: MangaCompletedCardProps) {
  const src = getCoverImageUrl(manga.id, manga.cover ?? "", "512");
  const [loaded, setLoaded] = useState(false);
  return (
    <Card className="bg-background relative h-full w-full rounded-sm border-none shadow-none transition-colors duration-200">
      <CardContent className="relative rounded-sm p-0">
        <div className="absolute inset-0 z-10 flex rounded-sm bg-black/75 opacity-0 transition-opacity hover:opacity-100">
          <div className="grid grid-cols-1 justify-between gap-2 p-2.5">
            <ReactMarkdown
              className="overflow-auto text-sm text-white"
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
                td: ({ children }) => <td className="px-2 py-1">{children}</td>,
              }}
            >
              {manga.description.content}
            </ReactMarkdown>

            <Button
              asChild
              className="self-end [&_svg]:size-6"
              size="icon"
              variant="secondary"
            >
              <NoPrefetchLink
                href={`/manga/${manga.id}/${generateSlug(manga.title)}`}
              >
                <ArrowRight />
              </NoPrefetchLink>
            </Button>
          </div>
        </div>
        <LazyLoadImage
          wrapperClassName={cn(
            "block! rounded-sm object-cover w-full h-full",
            !loaded && "aspect-5/7",
          )}
          placeholderSrc="/images/place-doro.webp"
          className={cn(
            "block aspect-5/7 h-auto w-full rounded-sm object-cover",
          )}
          src={src}
          alt={`Ảnh bìa ${manga.title}`}
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = "/images/xidoco.webp";
          }}
        />
      </CardContent>

      <CardFooter className="w-full px-0 py-2">
        <NoPrefetchLink
          href={`/manga/${manga.id}/${generateSlug(manga.title)}`}
        >
          <p className="line-clamp-2 text-base font-semibold drop-shadow-xs">
            {manga.title}
          </p>
        </NoPrefetchLink>
      </CardFooter>
    </Card>
  );
}
