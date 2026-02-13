"use client";

import { cn, generateSlug } from "@/shared/lib/utils";
import { Button } from "../../shared/components/ui/button";
import { ArrowRight, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "../../shared/components/ui/input";
import { useConfig } from "@/shared/hooks/use-config";
import type { Manga } from "@/types/types";
import CompactCard from "./Result/compact-card";
import Link from "next/link";
import { Skeleton } from "../../shared/components/ui/skeleton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../shared/components/ui/dialog";
import useKeyDown from "@/shared/hooks/use-keydown";
import { Badge } from "../../shared/components/ui/badge";
import { SearchManga } from "@/features/manga/api/manga";

export default function QuickSearch() {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [config] = useConfig();

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      try {
        setIsLoading(true);
        setError(false);

        const res = await SearchManga(query, config.r18);
        setMangas(res);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [config.r18],
  );

  const debouncedSearch = useCallback(
    (query: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (query && query.trim()) {
          handleSearch(query);
        }
      }, 500);
    },
    [handleSearch],
  );

  useEffect(() => {
    if (!searchTerm || searchTerm.length === 0) return;
    debouncedSearch(searchTerm);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    if (expanded) {
      document.addEventListener("wheel", scrollLock, { passive: false });
    } else {
      document.removeEventListener("wheel", scrollLock);
    }
    return () => {
      document.removeEventListener("wheel", scrollLock);
    };
  }, [expanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useKeyDown({ key: "k", ctrlKey: true }, () => {
    setExpanded(true);
    if (inputRef.current) inputRef.current.focus();
  });

  useKeyDown("Escape", () => {
    setExpanded(false);
    if (inputRef.current) inputRef.current.blur();
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchTerm && searchTerm.trim()) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        handleSearch(searchTerm);
      }
    }
  };

  const handleMobileKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchTerm && searchTerm.trim()) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        handleSearch(searchTerm);
      }
    }
  };

  const clearSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const clearMobileSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    setSearchTerm("");
    if (mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  };

  return (
    <>
      <div
        className={cn("relative z-10 hidden grow justify-end md:flex")}
        ref={containerRef}
      >
        <div className="w-full">
          <div className="flex w-full items-center justify-end space-y-0">
            <Input
              autoComplete="off"
              placeholder="Tìm kiếm..."
              className={cn(
                "bg-muted/50! hover:bg-accent! focus:bg-background! h-8 border-none shadow-xs",
                "transition-all sm:pr-12 md:w-40 lg:w-56 xl:w-64",
                "placeholder:text-current",
                expanded && "bg-background shadow-md! md:w-full! lg:w-2/3!",
              )}
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setExpanded(true)}
              ref={inputRef}
            />
            {searchTerm.length === 0 ? (
              <div className="absolute top-1/2 right-2 flex -translate-y-1/2 transform items-center space-x-2">
                <div
                  className={cn(
                    "hidden flex-row gap-1 lg:flex",
                    expanded && "hidden!",
                  )}
                >
                  <Badge
                    variant="default"
                    className="bg-primary/40 hover:bg-primary/40 rounded-sm px-1 py-0"
                  >
                    Ctrl
                  </Badge>
                  <Badge
                    variant="default"
                    className="bg-primary/40 hover:bg-primary/40 rounded-sm px-1 py-0"
                  >
                    K
                  </Badge>
                </div>
                <Search className="h-4 w-4" />
              </div>
            ) : (
              <Button
                className="bg-primary absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 transform rounded-sm"
                size="icon"
                onClick={clearSearch}
                type="button"
              >
                <X />
              </Button>
            )}
          </div>
        </div>

        {/* result popup */}
        {expanded && (
          <div
            id="expanded"
            className={cn(
              "bg-background absolute top-full z-50 mt-1 rounded-lg p-2 shadow-md md:w-full lg:w-2/3",
              "animate-in fade-in slide-in-from-top-2 transition-all",
            )}
          >
            {searchTerm.length === 0 ? (
              <div className="text-gray-500">
                Nhập từ khoá đi mới tìm được chứ...
              </div>
            ) : isLoading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="mb-2 h-5 w-[69px] rounded-sm bg-gray-500" />
                <Skeleton className="h-24 w-full rounded-sm bg-gray-500" />
                <Skeleton className="h-24 w-full rounded-sm bg-gray-500" />
                <Skeleton className="h-24 w-full rounded-sm bg-gray-500" />
              </div>
            ) : error ? (
              <div className="text-gray-500">Lỗi mất rồi 😭</div>
            ) : mangas.length > 0 ? (
              <>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xl font-black">Manga</p>
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="hover:text-primary hover:bg-transparent hover:underline"
                  >
                    <Link
                      href={`/advanced-search?q=${searchTerm}`}
                      onClick={() => setExpanded(false)}
                    >
                      Tìm kiếm nâng cao
                      <ArrowRight />
                    </Link>
                  </Button>
                </div>
                <div className="grid max-h-[80vh] gap-2 overflow-y-auto">
                  {mangas.map((manga) => (
                    <Link
                      key={manga.id}
                      href={`/manga/${manga.id}/${generateSlug(manga.title)}`}
                      onClick={() => setExpanded(false)}
                      prefetch={false}
                    >
                      <CompactCard manga={manga} />
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-gray-500">Không có kết quả</div>
            )}
          </div>
        )}
      </div>

      {/* overlay */}
      {expanded && (
        <div className="fixed inset-0 z-5 h-lvh bg-black/30 dark:bg-white/30" />
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="bg-muted/50 inline-flex h-8 w-8 px-0 shadow-xs md:hidden"
          >
            <Search />
            <span className="sr-only">Tìm kiếm</span>
          </Button>
        </DialogTrigger>
        <DialogContent
          className={cn(
            "top-0 w-full max-w-full! translate-y-0 rounded-none border-none px-4 py-2",
            `theme-${config.theme}`,
            "[&>button]:hidden",
          )}
        >
          <DialogHeader>
            <DialogTitle className="hidden">Tìm kiếm nhanh</DialogTitle>
            <DialogDescription className="hidden">Tìm kiếm</DialogDescription>
          </DialogHeader>

          <div className="w-full">
            <div className="flex w-full items-center justify-end gap-1.5 space-y-0">
              <Input
                autoComplete="off"
                placeholder="Tìm kiếm..."
                className={cn("bg-secondary h-8 border-none shadow-xs")}
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleMobileKeyDown}
                ref={mobileInputRef}
              />
              {searchTerm.length === 0 ? (
                <Search className="absolute right-6 h-4 w-4 transform" />
              ) : (
                <Button
                  className="bg-primary absolute right-6 h-4 w-4 transform rounded-sm"
                  size="icon"
                  onClick={clearMobileSearch}
                  type="button"
                >
                  <X />
                </Button>
              )}

              {/* <DialogClose asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                >
                  <X />
                </Button>
              </DialogClose> */}
            </div>
          </div>

          <DialogFooter>
            <div className="w-full">
              {searchTerm.length === 0 ? (
                <div className="text-gray-500">
                  Nhập từ khoá đi mới tìm được chứ...
                </div>
              ) : isLoading ? (
                <div className="flex flex-col gap-2 pb-2">
                  <Skeleton className="mb-2 h-5 w-[69px] rounded-sm bg-gray-500" />
                  <Skeleton className="h-24 w-full rounded-sm bg-gray-500" />
                  <Skeleton className="h-24 w-full rounded-sm bg-gray-500" />
                  <Skeleton className="h-24 w-full rounded-sm bg-gray-500" />
                </div>
              ) : error ? (
                <div className="text-gray-500">Lỗi mất rồi 😭</div>
              ) : mangas.length > 0 ? (
                <>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xl font-black">Manga</p>
                    <DialogClose asChild>
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="hover:text-primary hover:bg-transparent hover:underline"
                      >
                        <Link href={`/advanced-search?q=${searchTerm}`}>
                          Tìm kiếm nâng cao
                          <ArrowRight />
                        </Link>
                      </Button>
                    </DialogClose>
                  </div>
                  <div className="flex max-h-[322px] flex-col gap-2 overflow-y-auto pb-2">
                    {mangas.map((manga) => (
                      <Link
                        key={manga.id}
                        href={`/manga/${manga.id}/${generateSlug(manga.title)}`}
                        prefetch={false}
                      >
                        <DialogClose className="w-full text-start">
                          <CompactCard manga={manga} />
                        </DialogClose>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-gray-500">Không có kết quả</div>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function scrollLock(event: WheelEvent) {
  let target = event.target as Node;
  let isInResultPopup = false;

  while (target != null) {
    if (
      target.nodeName === "DIV" &&
      (target as HTMLElement).id === "expanded"
    ) {
      isInResultPopup = true;
      break;
    }
    target = target.parentNode as Node;
  }

  if (isInResultPopup) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
}
