"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SlideSkeleton() {
  return (
    <>
      <div className="absolute z-10">
        <hr className="bg-primary h-1 w-9 border-none" />
        <h1 className="text-2xl font-black uppercase">Tiêu điểm</h1>
      </div>

      <div className="flex flex-col gap-4 pt-12">
        <div className="flex flex-row gap-4">
          <div className="bg-background relative rounded-md">
            <Skeleton className="h-[182px] w-[130px] rounded-md bg-gray-500 md:h-[285px] md:w-[200px] lg:h-[307px] lg:w-[215px]" />
          </div>

          <div className="flex w-full flex-col justify-between">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-12 w-full rounded-md bg-gray-500" />
              <Skeleton className="hidden h-6 w-2/3 rounded-md bg-gray-500 md:flex" />
            </div>

            <Skeleton className="h-4 w-1/2 rounded-md bg-gray-500 md:h-8" />
          </div>
        </div>

        <div className="flex justify-between md:hidden">
          <Skeleton className="h-5 w-1/12 rounded-full bg-gray-500" />

          <Skeleton className="h-5 w-1/6 rounded-md bg-gray-500" />

          <Skeleton className="h-5 w-1/12 rounded-full bg-gray-500" />
        </div>
      </div>
    </>
  );
}
