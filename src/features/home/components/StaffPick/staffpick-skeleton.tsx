import { Skeleton } from "@/components/ui/skeleton";

export default function StaffPickSkeleton() {
  return (
    <div className="flex flex-col">
      <hr className="bg-primary h-1 w-9 border-none" />
      <h1 className="text-2xl font-black uppercase">Truyện đề cử</h1>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-[300px] w-full rounded-sm bg-gray-500"
          />
        ))}
      </div>
    </div>
  );
}
