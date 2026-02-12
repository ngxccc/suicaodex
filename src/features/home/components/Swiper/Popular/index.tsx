"use client";

import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MangaSlide from "./manga-slide";
import SlideControl from "./slide-control";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Manga } from "@/types/types";

interface PopularSwiperProps {
  initialData: Manga[];
}

export default function PopularSwiper({ initialData }: PopularSwiperProps) {
  const data = initialData;
  const [_slideIndex, setSlideIndex] = useState(1);

  if (!data || data.length === 0) return null;

  return (
    <>
      <div className="absolute z-10">
        <hr className="bg-primary h-1 w-9 border-none" />
        <h1 className="text-2xl font-black uppercase">Tiêu điểm</h1>
      </div>

      <div className="absolute top-0 left-0 m-0! w-full p-0!">
        <div>
          <Swiper
            className="h-[335px] md:h-[410px] lg:h-[430px]"
            onSlideChange={(swiper) => setSlideIndex(swiper.realIndex + 1)}
            autoplay={true}
            loop={true}
            modules={[Autoplay, Navigation, Pagination]}
          >
            {data.map((manga, index) => (
              <SwiperSlide key={index}>
                <MangaSlide manga={manga} priority={index === 0} />
              </SwiperSlide>
            ))}
            <div
              className={cn(
                "absolute bottom-0 left-0 z-3 flex w-full items-center justify-between gap-2 md:-bottom-[1.5px] md:justify-end lg:-bottom-1",
                "px-4 md:pr-[calc(32px+var(--sidebar-width-icon))] lg:pr-[calc(48px+var(--sidebar-width-icon))]",
              )}
            >
              <SlideControl />
            </div>
          </Swiper>
        </div>
      </div>
    </>
  );
}
