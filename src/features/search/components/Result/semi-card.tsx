import MangaCover from "@/features/manga/components/manga-cover";
import ContentRatingChip from "@/features/manga/components/Tags/content-rating-tag";
import NormalTag from "@/features/manga/components/Tags/normal-tag";
import StatusChip from "@/features/manga/components/Tags/status-tag";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { Artist, Author, Manga } from "@/shared/types/common";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import NoPrefetchLink from "@/shared/components/custom/no-prefetch-link";
import { generateSlug } from "@/shared/lib/utils";

interface SemiCardProps {
  manga: Manga;
}

export default function SemiCard({ manga }: SemiCardProps) {
  const slug = generateSlug(manga.title);
  return (
    <Card className="rounded-sm shadow-xs transition-colors duration-200">
      <CardContent className="flex gap-2 p-1">
        <NoPrefetchLink href={`/manga/${manga.id}/${slug}`}>
          <MangaCover
            id={manga.id}
            cover={manga.cover ?? ""}
            alt={manga.title}
            placeholder="/images/place-doro.webp"
            wrapper="w-[130px] md:w-[150px] h-auto border"
            className="h-[185px]! w-[130px]! object-cover! md:h-[214px]! md:w-[150px]!"
            // wrapper="w-[130px] md:w-[150px] h-auto border"
            quality="256"
            //isExpandable
          />
        </NoPrefetchLink>
        <div className="flex w-full flex-col gap-1 pr-2">
          <NoPrefetchLink
            href={`/manga/${manga.id}/${slug}`}
            className="line-clamp-1 text-xl font-bold break-all"
          >
            {manga.title}
          </NoPrefetchLink>
          <p className="-mt-2 line-clamp-1 text-sm break-all">
            {[
              ...new Set([
                ...manga.author.map((a: Author) => a.name).slice(0, 1),
                ...manga.artist.map((a: Artist) => a.name).slice(0, 1),
              ]),
            ].join(", ")}
          </p>
          <div className="mt-1 flex max-h-4 flex-wrap items-center gap-1 overflow-y-hidden">
            <StatusChip status={manga.status} />
            <ContentRatingChip rating={manga.contentRating} disabledLink />
            {manga.tags.map((tag) => (
              <NormalTag key={tag.id} className="uppercase">
                {tag.name}
              </NormalTag>
            ))}
          </div>
          <ScrollArea className="mt-1 max-h-[109px] md:max-h-[141px]">
            <div className="flex flex-col gap-0 text-sm">
              <Markdown
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
              </Markdown>
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
