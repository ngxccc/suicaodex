import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import CatBook from "#/images/cat-books.svg";
import Image from "next/image";

export default function ChapterNotFound() {
  return (
    <div className="flex flex-col items-center justify-center md:flex-row">
      <Image
        src={CatBook}
        alt="CatBooks"
        className="h-auto w-[400px]"
        priority
      />
      <div className="flex flex-col gap-4">
        <p className="text-center text-xl font-black uppercase drop-shadow-lg md:text-3xl">
          Chương bạn đang tìm không tồn tại!
        </p>
        <Button asChild>
          <Link href="/">Quay lại trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}
