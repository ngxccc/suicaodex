import Recent from "@/features/manga/components/lists/recent";
import { Metadata } from "next";

interface pageProps {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export async function generateMetadata({
  searchParams,
}: pageProps): Promise<Metadata> {
  const { page } = await getSearchParams({ searchParams });
  return {
    title:
      page === 1
        ? "Truyện mới - SuicaoDex"
        : `Trang ${page} - Truyện mới - SuicaoDex`,
    description: "Truyện mới, Manga mới nhất, Manga mới cập nhật",
    keywords: ["Truyện mới", "Manga", "SuicaoDex"],
  };
}
export default async function Page({ searchParams }: pageProps) {
  const { page } = await getSearchParams({ searchParams });

  return (
    <>
      <div>
        <hr className="bg-primary h-1 w-9 border-none" />
        <h1 className="text-2xl font-black uppercase">Truyện mới</h1>
      </div>

      <Recent page={page} />
    </>
  );
}

const getSearchParams = async ({ searchParams }: pageProps) => {
  const params = await searchParams;

  let page = params["page"] ? parseInt(params["page"]) : 1;
  if (page < 1) page = 1;

  return { page };
};
