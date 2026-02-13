"use client";

import { CommentWithUser } from "@/shared/lib/serializers";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../shared/components/ui/avatar";
import { Button } from "../../shared/components/ui/button";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { formatShortTime } from "@/shared/lib/utils";
import { getStickerByName } from "@/shared/lib/stickers-fn";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

interface CommentCardProps {
  comment: CommentWithUser;
  isReply?: boolean;
  isLastReply?: boolean;
}

// Check if content is HTML (old format from richtext editor)
const isHTML = (str: string): boolean => {
  return /<[a-z][\s\S]*>/i.test(str);
};

// Parse comment content to separate text and stickers
const parseCommentContent = (content: string) => {
  // If it's HTML (old format), return as is without parsing stickers
  if (isHTML(content)) {
    return { text: content, stickers: [], isLegacyHTML: true };
  }

  const regex = /:([a-zA-Z0-9-]+):/g;
  const stickers: { name: string; url: string }[] = [];
  const foundPatterns: string[] = [];
  let textContent = content;
  let match;

  // Extract all stickers and track which patterns are valid
  while ((match = regex.exec(content)) !== null) {
    const stickerName = match[1];
    const sticker = getStickerByName(stickerName);

    if (sticker) {
      stickers.push({ name: stickerName, url: sticker.url });
      foundPatterns.push(match[0]); // Save the full pattern like ":doro-think:"
    }
  }

  // Remove only valid sticker patterns from text
  foundPatterns.forEach((pattern) => {
    textContent = textContent.replace(pattern, "");
  });
  textContent = textContent.trim();

  return { text: textContent, stickers, isLegacyHTML: false };
};

export default function CommentCard({
  comment,
  isReply = false,
  isLastReply = false,
}: CommentCardProps) {
  const { data: session } = useSession();
  const handleBtnClick = () => {
    return toast.info("Chức năng đang phát triển!", {
      closeButton: false,
    });
  };

  const { text, stickers, isLegacyHTML } = parseCommentContent(comment.content);

  return (
    <div className="relative">
      <div className="flex gap-2">
        <Avatar className="relative z-10 h-10 w-10 shrink-0">
          <AvatarImage
            src={comment.user.image || ""}
            alt={comment.user.name || "User"}
          />
          <AvatarFallback>
            {comment.user.name ? comment.user.name.slice(0, 2) : "SC"}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="line-clamp-1 text-sm font-semibold hover:underline">
              {comment.user.name}
            </span>
          </div>
          {text && (
            <div className="bg-muted mt-1 inline-block max-w-full rounded-2xl px-3 py-2">
              <ReactMarkdown
                className="prose prose-sm prose-img:my-1 prose-img:max-w-[120px] dark:prose-invert max-w-full"
                remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                rehypePlugins={
                  isLegacyHTML ? [rehypeRaw, [rehypeSanitize]] : undefined
                }
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
                  p: ({ children }) => (
                    <p className="wrap-break-word whitespace-pre-wrap">
                      {children}
                    </p>
                  ),
                }}
              >
                {text}
              </ReactMarkdown>
            </div>
          )}
          {stickers.length > 0 && (
            <div className="mt-2 flex max-w-full flex-wrap gap-2">
              {stickers.map((sticker, index) => (
                <LazyLoadImage
                  key={`${sticker.name}-${index}`}
                  src={sticker.url}
                  alt={sticker.name}
                  className="aspect-square h-auto w-full max-w-[120px] rounded-md object-contain sm:max-w-[150px]"
                  effect="blur"
                />
              ))}
            </div>
          )}

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground line-clamp-1 text-xs">
              {formatShortTime(new Date(comment.updatedAt))}
              {comment.isEdited ? " (Đã chỉnh sửa)" : ""}
            </span>

            {!!session?.user?.id && (
              <div className="flex items-center gap-2">
                {session?.user?.id === comment.user.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto px-1 py-0 text-xs font-semibold hover:underline"
                    onClick={handleBtnClick}
                  >
                    Sửa
                  </Button>
                )}
                {session?.user?.id !== comment.user.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto px-1 py-0 text-xs font-semibold hover:underline"
                    onClick={handleBtnClick}
                  >
                    Thích
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto px-1 py-0 text-xs font-semibold hover:underline"
                  onClick={handleBtnClick}
                >
                  Trả lời
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
