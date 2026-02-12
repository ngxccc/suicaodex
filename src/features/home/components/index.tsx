import LeaderBoard from "./LeaderBoard";
import RecentlyAdded from "./Recently";
import StaffPick from "./StaffPick";
import CompletedSwiper from "./Swiper/Completed";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import SlideSkeleton from "./Swiper/Popular/slide-skeleton";
import PopularContainer from "./Swiper/Popular/popular-container";
import LatestSkeleton from "./LatestUpdate/latest-skeleton";
import LatestUpdateContainer from "./LatestUpdate/latest-update-container";

const CommentFeed = dynamic(() => import("@/components/Comment/CommentFeed"), {
  loading: () => (
    <div className="bg-secondary/20 h-40 animate-pulse rounded-sm" />
  ),
});

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="h-[324px] md:h-[400px]">
        <Suspense fallback={<SlideSkeleton />}>
          <PopularContainer />
        </Suspense>
      </section>

      <section className="-mt-4 md:-mt-8 lg:-mt-3">
        <Suspense
          fallback={
            <div className="flex flex-col">
              <hr className="bg-primary h-1 w-9 border-none" />
              <h1 className="text-2xl font-black uppercase">Mới cập nhật</h1>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, index) => (
                  <LatestSkeleton key={index} />
                ))}
              </div>
            </div>
          }
        >
          <LatestUpdateContainer />
        </Suspense>
      </section>

      <section className="mt-9">
        <RecentlyAdded />
      </section>

      <section className="mt-9 grid grid-cols-1 gap-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        <div className="lg:col-span-2 xl:col-span-3 2xl:col-span-4">
          <StaffPick />
        </div>
        <div className="lg:col-span-2">
          <LeaderBoard />
        </div>
      </section>

      <section className="mt-9 grid grid-cols-1 gap-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        <div className="lg:col-span-2 xl:col-span-3 2xl:col-span-4">
          <CompletedSwiper />
        </div>
        <div className="lg:col-span-2">
          <CommentFeed />
        </div>
      </section>
    </div>
  );
}
