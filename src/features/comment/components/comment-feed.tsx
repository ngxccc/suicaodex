"use client";

import useSWR from "swr";
import CommentFeedItem from "./comment-feed-item";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";

import Image from "next/image";
import DoroLoading from "#/images/doro-loading.gif";
import { Marquee } from "@/shared/components/ui/marquee";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CommentFeed() {
  const {
    data: comments,
    isLoading,
    error,
  } = useSWR("/api/comments/latest", fetcher);

  if (isLoading)
    return (
      <>
        <div>
          <hr className="bg-primary h-1 w-9 border-none" />
          <h1 className="text-2xl font-black uppercase">Bình luận gần đây</h1>
        </div>
        <Alert className="mt-4 rounded-sm border-none">
          <AlertDescription className="flex justify-center">
            <Image
              src={DoroLoading}
              alt="Loading..."
              unoptimized
              priority
              className="h-auto w-20"
            />
          </AlertDescription>
        </Alert>
      </>
    );
  if (error || !comments) return null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <hr className="bg-primary h-1 w-9 border-none" />
        <h1 className="text-2xl font-black uppercase">Bình luận gần đây</h1>
      </div>

      <Marquee
        pauseOnHover
        vertical
        className="h-[450px] overflow-hidden px-0 [--duration:55s] md:h-[650px]"
      >
        {comments.map((cmt: any, index: any) => (
          <CommentFeedItem key={cmt.id} comment={cmt} type={cmt.type} />
        ))}
      </Marquee>
    </div>
  );
}
