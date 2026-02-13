import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { CircleHelp, MonitorCog, NotepadText } from "lucide-react";
import { Alert } from "@/shared/components/ui/alert";
import Notifications from "@/features/notification/components/notifications";

interface pageProps {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export function generateMetadata(): Metadata {
  return {
    title: "Thông báo",
  };
}

export default async function Page({ searchParams }: pageProps) {
  const { page } = await getSearchParams({ searchParams });
  const tabValues = [
    {
      value: "noti",
      label: "Truyện",
      icon: <NotepadText size={16} className="mr-1" />,
    },
    {
      value: "system",
      label: "Hệ thống",
      icon: <MonitorCog size={16} className="mr-1" />,
    },
  ];
  return (
    <>
      <div>
        <hr className="bg-primary h-1 w-9 border-none" />
        <h1 className="text-2xl font-black uppercase">Thông báo</h1>
      </div>

      <Tabs defaultValue="noti" className="mt-4">
        <TabsList className="w-full">
          {tabValues.map((tab) => (
            <TabsTrigger
              key={tab.value}
              className="flex w-full items-center"
              value={tab.value}
            >
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="noti">
          <Accordion
            type="single"
            collapsible
            className="bg-secondary mb-2 rounded-md px-2"
          >
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="py-2">
                <div className="flex items-center gap-1.5">
                  <CircleHelp size={18} /> Có thể bạn cần biết:
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                Thông báo truyện mới sẽ được lưu trên thiết bị của bạn; nếu bạn
                xóa dữ liệu trình duyệt, thông báo cũng sẽ bị xóa theo.
                <br />
                Chính vì hạn chế trên, đôi khi sẽ không có thông báo dù truyện
                có chương mới (sẽ khắc phục khi nhóm chức năng tài khoản được
                triển khai, chắc thế 🐧)
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Notifications page={page} />
        </TabsContent>
        <TabsContent value="system">
          <Alert className="bg-secondary justify-center rounded-sm text-center">
            Không có thông báo nào!
          </Alert>
        </TabsContent>
      </Tabs>
    </>
  );
}

const getSearchParams = async ({ searchParams }: pageProps) => {
  const params = await searchParams;
  let page = params["page"] ? parseInt(params["page"]) : 1;
  if (page < 1) page = 1;

  return { page };
};
