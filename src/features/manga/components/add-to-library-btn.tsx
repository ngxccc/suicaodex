"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { useConfig } from "@/shared/hooks/use-config";
import { cn, getCoverImageUrl } from "@/shared/lib/utils";
import {
  Album,
  BellOff,
  BellRing,
  BookmarkCheck,
  CircleUser,
  CloudOff,
  ListCheck,
  ListPlus,
  Loader2,
  NotebookPen,
} from "lucide-react";
import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { toast } from "sonner";
import { useLocalLibrary } from "@/shared/hooks/use-local-library";
import { useLocalNotification } from "@/shared/hooks/use-local-notification";
import { useSession } from "next-auth/react";
import { updateMangaCategoryAction } from "@/shared/config/db";
import type { Category } from "prisma/generated/enums";
import type { Manga } from "../types";
import type { LibraryType } from "@/features/library/types";

interface AddToLibraryBtnProps {
  manga: Manga;
}

export default function AddToLibraryBtn({ manga }: AddToLibraryBtnProps) {
  const { data: session } = useSession();
  const [config] = useConfig();
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  const { addToLocalCategory, removeFromLocalLibrary, getLocalCategoryOfId } =
    useLocalLibrary();

  const {
    addToLocalNotification,
    removeFromLocalNotification,
    isInLocalNotification,
  } = useLocalNotification();

  const [value, setValue] = useState<LibraryType | "none">(
    () => getLocalCategoryOfId(manga.id) ?? "none",
  );

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      return;
    }
    const currentCategory = getLocalCategoryOfId(manga.id);
    setValue(currentCategory ?? "none");
    setIsNotificationEnabled(isInLocalNotification(manga.id));
  };

  const src = getCoverImageUrl(manga.id, manga.cover ?? "", "512");

  const options = [
    {
      value: "none",
      label: "Không",
      icon: <ListPlus />,
      btnLabel: "Thêm vào thư viện",
    },
    {
      value: "following",
      label: "Theo dõi",
      icon: <BookmarkCheck />,
      btnLabel: "Đang theo dõi",
    },
    {
      value: "reading",
      label: "Đang đọc",
      icon: <Album />,
      btnLabel: "Đang đọc",
    },
    {
      value: "plan",
      label: "Để dành đọc sau",
      icon: <NotebookPen />,
      btnLabel: "Để dành đọc sau",
    },
    {
      value: "completed",
      label: "Đã đọc xong",
      icon: <ListCheck />,
      btnLabel: "Đã đọc xong",
    },
  ];

  const handleLocalNotificationToggle = (
    v: LibraryType | "none",
    n: boolean,
  ) => {
    if (v === "none" || !n) {
      return removeFromLocalNotification(manga.id);
    }
    addToLocalNotification(manga.id);
  };

  const handleLocalLibraryAdd = (v: LibraryType | "none") => {
    if (v === "none") {
      removeFromLocalLibrary(manga.id);
      return toast.success(`Đã xóa truyện khỏi thư viện!`);
    }

    addToLocalCategory(manga.id, v);
    return toast.success(
      `Đã thêm truyện vào: ${options.find((opt) => opt.value === v)?.label}!`,
    );
  };

  const toCategory = (category: LibraryType | "none"): Category | "NONE" => {
    if (category === "none") {
      return "NONE";
    }
    return category.toUpperCase() as Category;
  };

  const handleLibraryAdd = async (v: LibraryType | "none") => {
    if (!session?.user?.id) {
      toast.info("Bạn cần đăng nhập để sử dụng chức năng này!");
      return;
    }
    setIsLoading(true);
    try {
      const res = await updateMangaCategoryAction(
        session.user.id,
        manga.id,
        toCategory(v),
        manga.latestChapter ?? "none",
      );
      if (res.status === 200 || res.status === 201) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset value to default when dialog is closed
    setValue(getLocalCategoryOfId(manga.id) ?? "none");
    setIsNotificationEnabled(isInLocalNotification(manga.id));
  };

  return (
    <Dialog onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button className="size-9 rounded-sm md:h-10 md:w-auto md:px-6 md:has-[>svg]:px-4">
          {options.find((opt) => opt.value === value)?.icon}
          <span className="hidden md:block">
            {options.find((opt) => opt.value === value)?.btnLabel}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "overflow-auto sm:max-h-[calc(100vh-3rem)] sm:max-w-[800px]",
          `theme-${config.theme}`,
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Thêm vào thư viện</DialogTitle>
          <DialogDescription className="hidden">mẹ mày béo</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-row gap-4">
            <LazyLoadImage
              wrapperClassName={cn(
                "block! rounded-sm object-cover max-w-[250px] w-full h-auto",
                !loaded && "aspect-5/7",
              )}
              placeholderSrc="/images/place-doro.webp"
              className={cn(
                "block aspect-5/7 h-auto w-full rounded-sm object-cover shadow-md drop-shadow-md",
              )}
              src={src}
              alt={`Ảnh bìa ${manga.title}`}
              onLoad={() => setLoaded(true)}
              onError={(e) => {
                e.currentTarget.src = "/images/xidoco.webp";
              }}
            />

            <div className="flex w-full flex-col gap-4">
              <p className="line-clamp-4 text-2xl font-bold sm:line-clamp-2">
                {manga.title}
              </p>

              <div className="hidden w-full flex-row gap-2 sm:flex">
                <Select
                  value={value}
                  onValueChange={(v) => setValue(v as LibraryType | "none")}
                >
                  <SelectTrigger className="h-10 font-semibold">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="hover:bg-secondary"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  size="icon"
                  variant={
                    value === "none"
                      ? "outline"
                      : isNotificationEnabled
                        ? "default"
                        : "outline"
                  }
                  className="size-10 shrink-0 [&_svg]:size-5"
                  onClick={() => setIsNotificationEnabled((prev) => !prev)}
                  disabled={value === "none"}
                >
                  {value === "none" ? (
                    <BellOff />
                  ) : isNotificationEnabled ? (
                    <BellRing className="animate-bell-shake" />
                  ) : (
                    <BellOff />
                  )}
                </Button>
              </div>
              <Label className="hidden sm:block" htmlFor="note">
                Hướng dẫn:
              </Label>
              <div className="text-muted-foreground -mt-2 hidden text-base sm:block">
                <p>- Chọn 1 trong các danh mục trên để thêm truyện.</p>
                <p>
                  - Chọn{" "}
                  <span className="font-semibold">&quot;Không&quot;</span> để
                  xoá truyện khỏi thư viện.
                </p>
                <p>- Nhấn chuông để nhận thông báo khi có chap mới.</p>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 sm:hidden">
            <div className="flex w-full flex-row gap-2">
              <Select
                value={value}
                onValueChange={(v) => setValue(v as LibraryType | "none")}
              >
                <SelectTrigger className="h-10 font-semibold">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="hover:bg-secondary"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                size="icon"
                variant={
                  value === "none"
                    ? "outline"
                    : isNotificationEnabled
                      ? "default"
                      : "outline"
                }
                className="size-10 shrink-0 [&_svg]:size-5"
                onClick={() => setIsNotificationEnabled((prev) => !prev)}
                disabled={value === "none"}
              >
                {value === "none" ? (
                  <BellOff />
                ) : isNotificationEnabled ? (
                  <BellRing className="animate-bell-shake" />
                ) : (
                  <BellOff />
                )}
              </Button>
            </div>
            <Label htmlFor="note">Hướng dẫn:</Label>
            <div className="text-muted-foreground -mt-2 text-base">
              <p>- Chọn 1 trong các danh mục trên để thêm truyện.</p>
              <p>
                - Chọn <span className="font-semibold">&quot;Không&quot;</span>{" "}
                để xoá truyện khỏi thư viện.
              </p>
              <p>- Nhấn chuông để nhận thông báo khi có chap mới.</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse justify-end gap-2 space-x-0! sm:flex-row">
          <DialogClose asChild>
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                handleLocalLibraryAdd(value);
                handleLocalNotificationToggle(value, isNotificationEnabled);
              }}
            >
              <CloudOff />
              Cập nhật
            </Button>
          </DialogClose>

          <Button
            disabled={isLoading}
            className="w-full sm:w-auto"
            onClick={() => {
              if (!session) {
                toast.info("Bạn cần đăng nhập để sử dụng chức năng này!");
                return;
              }
              void handleLibraryAdd(value);
            }}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <CircleUser />}
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
