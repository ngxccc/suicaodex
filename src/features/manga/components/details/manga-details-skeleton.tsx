"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

export default function MangaDetailsSkeleton() {
  return (
    <>
      <div className="absolute top-0 right-0 left-0 z-[-2] hidden h-70 w-auto md:block">
        <div
          className={cn(
            "absolute h-70 w-full",
            "transition-[width] duration-150 ease-in-out",
            "bg-center-25 bg-gray-800/50 bg-cover bg-no-repeat",
          )}
        ></div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <div className="bg-background relative rounded-md">
            <Skeleton className="h-[182px] w-[130px] rounded-md bg-gray-500 md:h-[280px] md:w-[200px]" />
          </div>

          <div className="flex w-full flex-col justify-between">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-12 w-full rounded-md bg-gray-500" />
              <Skeleton className="h-6 w-2/3 rounded-md bg-gray-500" />
            </div>

            <Skeleton className="h-4 w-1/2 rounded-md bg-gray-500 md:h-10" />
          </div>
        </div>
      </div>
    </>
  );
}
