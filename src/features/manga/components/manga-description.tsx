import { ChevronsDown, ChevronsUp, Loader2, Undo2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { SiGoogletranslate } from "@icons-pack/react-simple-icons";
import { Button } from "@/shared/components/ui/button";
import useContentHeight from "@/shared/hooks/use-content-height";
import type { Manga } from "@/shared/types/common";
import MangaSubInfo from "./manga-subinfo";

interface MangaDescriptionProps {
  content: string;
  language: "en" | "vi";
  maxHeight: number;
  manga?: Manga;
}

const MangaDescription = ({
  content,
  language,
  maxHeight,
  manga,
}: MangaDescriptionProps) => {
  const [state, setState] = useState({
    expanded: false,
    translated: false,
    translatedDesc: null as string | null,
    isLoading: false,
  });

  // Use the new useContentHeight hook
  const { contentRef, fullHeight } = useContentHeight({
    expanded: state.expanded,
    dependencies: [state.translated, state.translatedDesc],
  });

  const handleTranslate = async () => {
    if (state.translatedDesc) {
      setState((prev) => ({ ...prev, translated: !prev.translated }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(
          content,
        )}`,
      );
      const data = await response.json();
      const translatedText = data[0].map((part: any) => part[0]).join("");
      setState((prev) => ({
        ...prev,
        translatedDesc: translatedText,
        translated: true,
      }));
    } catch (error) {
      console.error("Lỗi dịch thuật:", error);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleExpand = () => {
    setState((prev) => ({ ...prev, expanded: !prev.expanded }));
  };

  return (
    <div className="relative flex flex-col gap-1">
      <div
        className="h-auto overflow-hidden text-sm transition-[max-height,height]"
        style={{
          maxHeight: state.expanded ? fullHeight : maxHeight,
          maskImage:
            state.expanded || fullHeight <= maxHeight
              ? "none"
              : "linear-gradient(black 0%, black 60%, transparent 100%)",
        }}
      >
        <div ref={contentRef}>
          {!!content && (
            <div className="flex flex-col gap-3">
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
                {state.translated && state.translatedDesc
                  ? state.translatedDesc
                  : content}
              </Markdown>
            </div>
          )}

          {language === "en" && (
            <Button
              size="sm"
              className="mt-2 rounded-sm text-xs opacity-50 transition hover:opacity-100"
              onClick={handleTranslate}
              variant="ghost"
            >
              {state.isLoading ? (
                <Loader2 className="animate-spin" />
              ) : state.translated ? (
                <Undo2 />
              ) : (
                <SiGoogletranslate size={18} />
              )}
              {state.translated ? "Xem bản gốc" : "Dịch sang tiếng Việt"}
            </Button>
          )}

          {!!manga && (
            <div className={cn("xl:hidden", !!content ? "py-4" : "pb-2")}>
              <MangaSubInfo manga={manga} />
            </div>
          )}
        </div>
      </div>

      {fullHeight > maxHeight && (
        <div
          className={cn(
            "flex w-full justify-center border-t transition-[border-color]",
            state.expanded ? "border-transparent" : "border-primary",
          )}
        >
          <Button
            size="sm"
            className="h-4 rounded-t-none px-1! text-xs"
            onClick={handleExpand}
            variant={state.expanded ? "secondary" : "default"}
          >
            {state.expanded ? (
              <>
                <ChevronsUp />
                thu gọn
                <ChevronsUp />
              </>
            ) : (
              <>
                <ChevronsDown />
                xem thêm
                <ChevronsDown />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MangaDescription;
