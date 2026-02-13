"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopFollowed from "./TopFollowed";
import TopRated from "./TopRated";
import { Bookmark, ChevronsDown, ChevronsUp, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/components/ui/button";

export default function LeaderBoard() {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded((prev) => !prev);
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

  return (
    <div className="flex flex-col">
      <hr className="bg-primary h-1 w-9 border-none" />
      <h1 className="text-2xl font-black uppercase">Bảng xếp hạng</h1>

      <Tabs
        ref={contentRef}
        defaultValue="follow"
        className={cn("mt-4", "overflow-hidden transition-all duration-500")}
        style={{
          maxHeight: expanded ? fullHeight : "700px",
          // opacity: expanded ? 1 : 0.95,
          WebkitMaskImage:
            expanded || fullHeight < 700
              ? "none"
              : "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
        }}
      >
        <TabsList className="w-full rounded-sm">
          <TabsTrigger value="follow" className="flex w-full gap-1 rounded-sm">
            <Bookmark size={20} />
            Lượt theo dõi
          </TabsTrigger>
          <TabsTrigger value="rating" className="flex w-full gap-1 rounded-sm">
            <Star size={20} />
            Điểm đánh giá
          </TabsTrigger>
        </TabsList>
        <TabsContent value="follow">
          <TopFollowed />
        </TabsContent>
        <TabsContent value="rating">
          <TopRated />
        </TabsContent>
      </Tabs>

      {fullHeight > 700 && (
        <div
          className={cn(
            "flex h-full w-full justify-center",
            expanded && "mt-2",
          )}
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
      )}
    </div>
  );
}
