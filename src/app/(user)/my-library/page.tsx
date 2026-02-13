import { Metadata } from "next";
import { Alert, AlertTitle } from "@/shared/components/ui/alert";
import {
  Album,
  BookmarkCheck,
  CircleHelp,
  CircleUser,
  CloudOff,
  ListCheck,
  NotebookPen,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import MyLibrary from "@/components/Pages/MyLibrary";
import { auth } from "@/shared/config/authjs";
import SyncLib from "@/shared/components/library/sync-lib";

export function generateMetadata(): Metadata {
  return {
    title: "Thư viện - SuicaoDex",
    // description: "Thư viện",
    // keywords: ["Lịch sử", "History", "SuicaoDex"],
  };
}
export default async function Page() {
  const session = await auth();
  // console.log(session);
  const tabValues = [
    { value: "following", icon: <BookmarkCheck /> },
    { value: "reading", icon: <Album /> },
    { value: "plan", icon: <NotebookPen /> },
    { value: "completed", icon: <ListCheck /> },
  ];
  return (
    <>
      <div>
        <hr className="bg-primary h-1 w-9 border-none" />
        <h1 className="text-2xl font-black uppercase">Thư viện</h1>
      </div>

      <Tabs defaultValue="local" className="mt-4">
        <TabsList className="w-full">
          <TabsTrigger className="flex w-full items-center" value="local">
            <CloudOff size={16} className="mr-1" />
            Từ thiết bị
          </TabsTrigger>
          <TabsTrigger className="flex w-full items-center" value="cloud">
            <CircleUser size={16} className="mr-1" />
            Từ tài khoản
          </TabsTrigger>
        </TabsList>
        <TabsContent value="local">
          <Accordion
            type="single"
            collapsible
            className="bg-secondary rounded-md px-2"
          >
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="py-2">
                <div className="flex items-center gap-1.5">
                  <CircleHelp size={18} /> Có thể bạn cần biết:
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                Đây là thư viện được lưu trên chính thiết bị của bạn, nó không
                đồng bộ với thư viện lưu trên tài khoản. Nếu bạn xóa dữ liệu
                trình duyệt, thư viện này cũng sẽ bị xóa theo.
                <br />
                Ngoài ra, mỗi danh mục chỉ lưu tối đa 500 truyện, khi lưu thêm
                sẽ tự động xóa truyện cũ nhất.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Tabs defaultValue="following" className="mt-2">
            <TabsList className="h-10 gap-1 rounded-sm">
              {tabValues.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  className="rounded-sm"
                  value={tab.value}
                >
                  {tab.icon}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabValues.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="w-full">
                <MyLibrary category={tab.value} />
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
        <TabsContent value="cloud">
          {!!session ? (
            <SyncLib session={session} />
          ) : (
            <Alert className="justify-center rounded-sm text-center">
              <AlertTitle>Bạn cần đăng nhập để dùng chức năng này!</AlertTitle>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
