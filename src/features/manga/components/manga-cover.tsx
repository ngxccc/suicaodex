"use client";
import { cn, getCoverImageUrl } from "@/shared/lib/utils";
import { Expand, Loader2 } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../../../components/ui/dialog";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Hover3DCard } from "../../../components/ui/hover-3d-card";

interface MangaCoverProps extends React.HTMLAttributes<HTMLImageElement> {
  id: string;
  cover: string;
  alt: string;
  placeholder?: string;
  isExpandable?: boolean;
  wrapper?: string;
  quality?: "256" | "512" | "full";
  preload?: boolean;
}

const MangaCover: FC<MangaCoverProps> = ({
  id,
  cover,
  alt,
  placeholder,
  isExpandable = false,
  wrapper,
  className,
  quality = "512",
  preload = false,
  ...props
}) => {
  const src = getCoverImageUrl(id, cover, quality !== "full" ? quality : "");

  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative">
      {isExpandable && (
        <Dialog>
          <DialogTrigger className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-sm bg-black/50 opacity-0 transition-opacity hover:opacity-100">
            <Expand size={50} color="white" />
          </DialogTrigger>

          <DialogContent className="h-auto w-full justify-center rounded-none! border-0 border-none bg-transparent p-0 shadow-none [&>button]:hidden">
            <DialogTitle className="hidden"></DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>

            <DialogClose className="fixed inset-0 z-0 block! cursor-default" />
            <div className="relative z-10 flex max-h-[90vh] max-w-[90vw] items-center justify-center md:max-w-screen lg:max-h-screen">
              <div className="bg-secondary absolute rounded-sm p-5">
                <Loader2 className="animate-spin" size={50} />
              </div>
              {/* <img
                src={getCoverImageUrl(id, cover, "full")}
                alt={`Ảnh bìa ${alt}`}
                className="max-h-full max-w-full object-cover z-20"
                fetchPriority="high"
                onError={(e) => {
                  e.currentTarget.src = "/images/xidoco.webp";
                }}
              /> */}
              <Hover3DCard
                imageSrc={getCoverImageUrl(id, cover, "full")}
                alt={`Ảnh bìa ${alt}`}
                className="z-20 max-h-full max-w-full rounded-none object-cover"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      <LazyLoadImage
        wrapperClassName={cn(
          "block! rounded-sm object-cover",
          !loaded && "aspect-5/7",
          wrapper,
        )}
        placeholderSrc={placeholder}
        className={cn("block h-auto w-full rounded-sm", className)}
        src={src}
        alt={`Ảnh bìa ${alt}`}
        onLoad={() => setLoaded(true)}
        visibleByDefault={preload}
        onError={(e) => {
          e.currentTarget.src = "/images/xidoco.webp";
        }}
        {...props}
      />
    </div>
  );
};

export default MangaCover;
