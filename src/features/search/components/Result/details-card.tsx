import MangaCover from "@/features/manga/components/manga-cover";
import ContentRatingChip from "@/features/manga/components/Tags/content-rating-tag";
import NormalTag from "@/features/manga/components/Tags/normal-tag";
import StatusChip from "@/features/manga/components/Tags/status-tag";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { Manga } from "@/shared/types/common";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import NoPrefetchLink from "@/shared/components/custom/no-prefetch-link";
import { generateSlug } from "@/shared/lib/utils";

interface DetailsCardProps {
  manga: Manga;
}

export default function DetailsCard({ manga }: DetailsCardProps) {
  const slug = generateSlug(manga.title);
  return (
    <Card className="w-full rounded-sm shadow-xs transition-colors duration-200">
      <CardContent className="flex gap-2 p-1">
        <NoPrefetchLink href={`/manga/${manga.id}/${slug}`}>
          <MangaCover
            id={manga.id}
            cover={manga.cover ?? ""}
            alt={manga.title}
            placeholder="/images/place-doro.webp"
            wrapper="w-20 h-auto border"
            className="h-28! w-20! object-cover!"
            quality="256"
            //isExpandable
          />
        </NoPrefetchLink>
        <div className="flex w-full flex-col gap-1 pr-2">
          <div className="flex items-center justify-between">
            <NoPrefetchLink
              href={`/manga/${manga.id}/${slug}`}
              className="line-clamp-1 text-xl font-bold break-all"
            >
              {manga.title}
            </NoPrefetchLink>
            <StatusChip status={manga.status} />
          </div>
          <div className="flex max-h-4 flex-wrap items-center gap-1 overflow-y-hidden">
            <ContentRatingChip rating={manga.contentRating} disabledLink />
            {manga.tags.map((tag) => (
              <NormalTag key={tag.id} className="uppercase">
                {tag.name}
              </NormalTag>
            ))}
          </div>
          <div
            style={{
              maskImage:
                "linear-gradient(black 0%, black 60%, transparent 100%)",
            }}
          >
            <div className="flex max-h-[60px] flex-col gap-0 overflow-y-hidden text-sm break-all">
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
