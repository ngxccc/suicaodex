"use client";

import useReadingHistory from "@/shared/hooks/use-reading-history";
import { LayoutGrid, List, Loader2 } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useEffect, useState } from "react";
import { Card } from "@/shared/components/ui/card";
import useSWR from "swr";
import { fetchHistory } from "@/features/history/api/history";
import HistoryCompactCard from "./history-compact-card";
import HistoryCoverCard from "./history-cover-card";

export default function History() {
  const [isLoading, setIsLoading] = useState(true);
  const { history } = useReadingHistory();

  useEffect(() => {
    if (history) {
      setIsLoading(false);
    }
  }, [history]);

  const { m_ids, c_ids } = extractIds(history);

  const {
    data,
    error,
    isLoading: swrLoading,
  } = useSWR(
    ["history", m_ids, c_ids],
    ([, m_ids, c_ids]) => fetchHistory(m_ids, c_ids),
    {
      refreshInterval: 1000 * 60 * 10,
      revalidateOnFocus: false,
    },
  );

  if (isLoading || swrLoading) {
    return (
      <DefaultTabs>
        <div className="mt-20">
          <Loader2 className="animate-spin" size={40} />
        </div>
      </DefaultTabs>
    );
  }
  if (error || !data) {
    return (
      <DefaultTabs>
        <Card className="mt-4 flex h-16 w-full items-center justify-center rounded-sm">
          Lỗi mất rồi 😭
        </Card>
      </DefaultTabs>
    );
  }
  if (data.length === 0) {
    return (
      <DefaultTabs>
        <Card className="mt-4 flex h-16 w-full items-center justify-center rounded-sm">
          Bạn chưa đọc gì cả!
        </Card>
      </DefaultTabs>
    );
  }

  const compactView = (
    <div className="flex w-full flex-col gap-3">
      {data.map((chapter) => (
        <HistoryCompactCard key={chapter.id} chapter={chapter} />
      ))}
    </div>
  );

  const coverView = (
    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {data.map((chapter) => (
        <HistoryCoverCard key={chapter.id} chapter={chapter} />
      ))}
    </div>
  );
  return <DefaultTabs compactView={compactView} coverView={coverView} />;
}

interface DefaultTabsProps {
  children?: React.ReactNode;
  compactView?: React.ReactNode;
  coverView?: React.ReactNode;
}

function DefaultTabs({ children, compactView, coverView }: DefaultTabsProps) {
  const tabValues = [
    { value: "compact", icon: <List /> },
    { value: "cover", icon: <LayoutGrid /> },
  ];

  return (
    <Tabs defaultValue="compact" className="w-full justify-items-end">
      <TabsList className="h-10 gap-1.5 rounded-sm">
        {tabValues.map((tab) => (
          <TabsTrigger key={tab.value} className="rounded-sm" value={tab.value}>
            {tab.icon}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent className="w-full justify-items-center" value="compact">
        {compactView || children}
      </TabsContent>

      <TabsContent className="w-full justify-items-center" value="cover">
        {coverView || children}
      </TabsContent>
    </Tabs>
  );
}

function extractIds(data: Record<string, { chapterId: string }>): {
  m_ids: string[];
  c_ids: string[];
} {
  if (Object.keys(data).length === 0) {
    return { m_ids: [], c_ids: [] };
  }
  const m_ids = Object.keys(data);
  const c_ids = Object.values(data).map((item) => item.chapterId);
  return { m_ids, c_ids };
}
