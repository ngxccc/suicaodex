"use client";

import { useConfig } from "@/shared/hooks/use-config";
import { usePreloadImages } from "@/shared/hooks/use-preload-images";
import { cn } from "@/shared/lib/utils";
import { useState } from "react";
import MangaImage from "./manga-image";

interface LongStripProps {
  images: string[];
}

export default function LongStrip({ images }: LongStripProps) {
  const [config] = useConfig();
  const [loadedCount, setLoadedCount] = useState(0);
  const allLoaded = loadedCount === images.length;

  const {
    registerImageElement,
    preloadedImages,
    markImageAsLoaded,
    isImageLoaded,
  } = usePreloadImages({
    images,
    preloadCount: 6,
    visibilityThreshold: 0.1,
  });

  return (
    <div
      className={cn(
        "relative mt-2 min-w-0",
        allLoaded ? "min-h-0" : "min-h-lvh",
      )}
    >
      <div
        className={cn(
          "flex h-full flex-col items-center justify-center overflow-x-auto bg-transparent select-none",
        )}
        style={{
          gap: `${config.reader.imageGap}px`,
        }}
      >
        {images.map((image, index) => (
          <span
            key={index + 1}
            className="block overflow-hidden"
            style={{
              minHeight: isImageLoaded(index) ? "auto" : "500px",
            }}
            ref={(element) => registerImageElement(index, element)}
          >
            <MangaImage
              src={image}
              alt={`Trang ${index + 1}`}
              onLoaded={() => {
                setLoadedCount((prev) => prev + 1);
                markImageAsLoaded(index);
              }}
              isPreloaded={preloadedImages.has(image)}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
