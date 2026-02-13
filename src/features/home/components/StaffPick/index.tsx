"use client";

import { useConfig } from "@/shared/hooks/use-config";
import useSWR from "swr";
import RecentlyCard from "../Recently/recently-card";
import { cn, generateSlug } from "@/shared/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import NoPrefetchLink from "@/shared/components/custom/no-prefetch-link";
import StaffPickSkeleton from "./staffpick-skeleton";
import { getCachedStaffPickMangas } from "@/features/manga/api/manga";

export default function StaffPick() {
  const [config] = useConfig();
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const updateFullHeight = useCallback(() => {
    if (contentRef.current) {
      setFullHeight(contentRef.current.scrollHeight || 0);
    }
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      updateFullHeight();
    });

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    const handleResize = () => {
      updateFullHeight();
    };

    window.addEventListener("resize", handleResize);
    const timer = setTimeout(updateFullHeight, 100);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [expanded, updateFullHeight]);

  const toggleExpanded = () => setExpanded((prev) => !prev);

  const { data, error, isLoading } = useSWR(
    ["staffpick", config.r18],
    ([, r18]) => getCachedStaffPickMangas(r18),
    {
      refreshInterval: 1000 * 60 * 10,
      revalidateOnFocus: false,
    },
  );

  if (isLoading) return <StaffPickSkeleton />;

  if (error || !data) return null;

  return (
    <div className="flex flex-col">
      <div>
        <hr className="bg-primary h-1 w-9 border-none" />
        <h1 className="text-2xl font-black uppercase">Truyện đề cử</h1>
      </div>

      <div
        ref={contentRef}
        className={cn(
          "mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
          "overflow-hidden transition-all duration-500",
        )}
        style={{
          maxHeight: expanded ? fullHeight : "700px",
          // opacity: expanded ? 1 : 0.95,
          WebkitMaskImage: expanded
            ? "none"
            : "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
        }}
      >
        {data.map((manga) => (
          <NoPrefetchLink
            key={manga.id}
            href={`/manga/${manga.id}/${generateSlug(manga.title)}`}
          >
            <RecentlyCard manga={manga} />
          </NoPrefetchLink>
        ))}
      </div>

      <div
        className={cn("flex h-full w-full justify-center", expanded && "mt-2")}
      >
        <Button
          size="sm"
          className="h-4 rounded-sm px-1! text-xs"
          onClick={toggleExpanded}
          variant={expanded ? "secondary" : "default"}
        >
          {expanded ? (
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
    </div>
  );
}
