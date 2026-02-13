import type { Metadata } from "next";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Terminal } from "lucide-react";
import History from "@/features/history/components/history";

export function generateMetadata(): Metadata {
  return {
    title: "Lịch sử đọc truyện",
    description: "Lịch sử đọc truyện",
    keywords: ["Lịch sử", "History", "SuicaoDex"],
  };
}
export default function Page() {
  return (
    <>
      <div>
        <hr className="bg-primary h-1 w-9 border-none" />
        <h1 className="text-2xl font-black uppercase">Lịch sử đọc</h1>
      </div>

      <Alert className="bg-secondary mt-4 rounded-sm">
        <Terminal size={18} />
        <AlertTitle>Có thể bạn cần biết:</AlertTitle>
        <AlertDescription>
          Lịch sử đọc được lưu trên chính thiết bị của bạn, nên nếu bạn xóa dữ
          liệu trình duyệt, lịch sử cũng sẽ bị xóa theo.
        </AlertDescription>
      </Alert>

      <div className="mt-4">
        <History />
      </div>
    </>
  );
}
