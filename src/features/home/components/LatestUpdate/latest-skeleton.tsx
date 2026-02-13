"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function LatestSkeleton() {
  return (
    <Card className="rounded-sm shadow-xs transition-colors duration-200">
      <CardContent className="flex gap-2 p-1">
        <Skeleton className="h-28 w-20 shrink-0 rounded-sm bg-gray-500" />
        <div className="flex w-full flex-col justify-evenly pr-1">
          <Skeleton className="h-5 w-full rounded-sm bg-gray-500" />
          <Skeleton className="h-4 w-2/3 rounded-sm bg-gray-500" />
          <Skeleton className="h-3 w-1/3 rounded-sm bg-gray-500" />
        </div>
      </CardContent>
    </Card>
  );
}
