import Link from "next/link";
import { buttonVariants } from "@/shared/components/ui/button";
import Banner from "./manga-banner";
import { cn } from "@/shared/lib/utils";
import ShutUp from "#/images/shutup.webp";
import Image from "next/image";

export default function MangaNotFound() {
  return (
    <>
      <Banner src="/images/maintain.webp" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-start gap-6">
          <Image
            src={ShutUp}
            alt="404"
            className="h-auto w-[130px] rounded-sm shadow-md drop-shadow-md md:w-[200px]"
            priority
            quality={100}
          />
        </div>

        <p className="text-center text-3xl font-black uppercase drop-shadow-lg">
          Truyện bạn đang tìm không tồn tại!
        </p>
        <Link
          href="/"
          className={cn(
            buttonVariants({ size: "lg", variant: "secondary" }),
            "text-base",
          )}
        >
          Quay lại trang chủ
        </Link>
      </div>
    </>
  );
}
