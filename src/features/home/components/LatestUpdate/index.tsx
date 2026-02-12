"use client";

import LatestCard from "./latest-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Chapter } from "@/types/types";

interface LatestUpdateProps {
  initialData: Chapter[];
}

export default function LatestUpdate({ initialData }: LatestUpdateProps) {
  const data = initialData;

  if (!data || data.length === 0) return null;

  const [part1, part2, part3] = splitArr(data);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <div>
          <hr className="bg-primary h-1 w-9 border-none" />
          <h1 className="text-2xl font-black uppercase">Mới cập nhật</h1>
        </div>

        <Button asChild size="icon" variant="ghost" className="[&_svg]:size-6">
          <Link href={`/latest`}>
            <ArrowRight className="size-6" />
          </Link>
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        <div className="grid grid-cols-1 gap-3">
          {part1.map((chapter) => (
            <LatestCard key={chapter.id} chapter={chapter} />
          ))}
        </div>

        <div className="hidden grid-cols-1 gap-3 md:grid">
          {part2.map((chapter) => (
            <LatestCard key={chapter.id} chapter={chapter} />
          ))}
        </div>

        <div className="hidden grid-cols-1 gap-3 lg:grid">
          {part3.map((chapter) => (
            <LatestCard key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </div>
    </div>
  );
}

function splitArr<T>(array: T[]): [T[], T[], T[]] {
  const size = array.length / 3;
  const part1 = array.slice(0, size);
  const part2 = array.slice(size, size * 2);
  const part3 = array.slice(size * 2);

  return [part1, part2, part3];
}
