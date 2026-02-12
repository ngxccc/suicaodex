import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwiper } from "swiper/react";

export default function SlideControl() {
  const swiper = useSwiper();

  return (
    <>
      <p
        className={cn(
          "hidden text-sm font-black uppercase md:flex",
          swiper.realIndex === 0 && "text-primary",
        )}
      >
        No. {swiper.realIndex + 1}
      </p>
      <Button
        size="icon"
        className={cn(
          "hover:text-primary h-8 w-8 rounded-full bg-transparent text-inherit shadow-none hover:bg-transparent [&_svg]:size-6",
          "md:h-10 md:w-10",
        )}
        onClick={() => swiper.slidePrev()}
      >
        <ChevronLeft />
      </Button>

      <p className="text-sm uppercase md:hidden">{swiper.realIndex + 1} / 10</p>

      <Button
        size="icon"
        className={cn(
          "hover:text-primary h-8 w-8 rounded-full bg-transparent text-inherit shadow-none hover:bg-transparent [&_svg]:size-6",
          "md:h-10 md:w-10",
        )}
        onClick={() => swiper.slideNext()}
      >
        <ChevronRight />
      </Button>
    </>
  );
}
