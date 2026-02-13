import TagsPage from "@/features/tag/components";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return {
    title: "Thể loại - SuicaoDex",
    description: "Truyện theo thể loại",
    keywords: ["Thể loại", "Genre", "SuicaoDex"],
  };
}

export default function Page() {
  return (
    <>
      <div>
        <hr className="bg-primary h-1 w-9 border-none" />
        <h1 className="text-2xl font-black uppercase">Thể loại</h1>
      </div>

      <div className="mt-4 w-full">
        <TagsPage />
      </div>
    </>
  );
}
