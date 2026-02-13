"use client";

import { Manga } from "@/types/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { LayoutGrid, List, StretchHorizontal } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import DetailsCard from "./details-card";
import MangaCompletedCard from "@/features/home/components/Swiper/Completed/manga-completed-card";
import SemiCard from "./semi-card";
import Image from "next/image";
import DoroLoading from "#/images/doro-loading.gif";

interface ResultTabProps {
  isError: any;
  isLoading: any;
  mangas?: Manga[];
}

export default function ResultTabs({
  mangas,
  isError,
  isLoading,
}: ResultTabProps) {
  if (isLoading || !mangas) {
    return (
      <DefaultTabs>
        <div className="mt-4">
          <Image
            src={DoroLoading}
            alt="Loading..."
            unoptimized
            priority
            className="h-auto w-20"
          />
        </div>
      </DefaultTabs>
    );
  }

  if (isError) {
    return (
      <DefaultTabs>
        <Card className="mt-4 flex h-16 w-full items-center justify-center rounded-sm">
          Lỗi mất rồi 😭
        </Card>
      </DefaultTabs>
    );
  }

  if (mangas.length === 0) {
    return (
      <DefaultTabs>
        <Card className="mt-4 flex h-16 w-full items-center justify-center rounded-sm">
          <p className="italic">Không có kết quả!</p>
        </Card>
      </DefaultTabs>
    );
  }

  const detailView = (
    <div className="mt-4 flex w-full flex-col gap-3">
      {mangas.map((manga) => (
        <DetailsCard key={manga.id} manga={manga} />
      ))}
    </div>
  );

  const semiView = (
    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
      {mangas.map((manga) => (
        <SemiCard key={manga.id} manga={manga} />
      ))}
    </div>
  );

  const coverView = (
    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {mangas.map((manga) => (
        // <Link key={manga.id} href={`/manga/${manga.id}`}>
        //   <RecentlyCard manga={manga} />
        // </Link>
        <MangaCompletedCard key={manga.id} manga={manga} />
      ))}
    </div>
  );

  return (
    <DefaultTabs
      detailView={detailView}
      semiView={semiView}
      coverView={coverView}
    />
  );
}

interface DefaultTabsProps {
  children?: React.ReactNode;
  detailView?: React.ReactNode;
  semiView?: React.ReactNode;
  coverView?: React.ReactNode;
}

function DefaultTabs({
  children,
  detailView,
  semiView,
  coverView,
}: DefaultTabsProps) {
  const tabValues = [
    { value: "detail", icon: <List /> },
    { value: "semi", icon: <StretchHorizontal /> },
    { value: "cover", icon: <LayoutGrid /> },
  ];

  return (
    <Tabs defaultValue="detail" className="w-full justify-items-end">
      <TabsList className="h-10 gap-1.5 rounded-sm">
        {tabValues.map((tab) => (
          <TabsTrigger key={tab.value} className="rounded-sm" value={tab.value}>
            {tab.icon}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent className="w-full justify-items-center" value="detail">
        {detailView || children}
      </TabsContent>
      <TabsContent className="w-full justify-items-center" value="semi">
        {semiView || children}
      </TabsContent>
      <TabsContent className="w-full justify-items-center" value="cover">
        {coverView || children}
      </TabsContent>
    </Tabs>
  );
}
