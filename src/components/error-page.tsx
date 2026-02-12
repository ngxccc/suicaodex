"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, RefreshCw, Bug, Check, Clipboard } from "lucide-react";
import {
  SiDiscord,
  SiFacebook,
  SiGithub,
} from "@icons-pack/react-simple-icons";
import { siteConfig } from "@/config/site";
import { toast } from "sonner";
import "@/styles/error-page.css";

interface ErrorPageProps {
  error?: Error;
  reset?: () => void;
  message?: string;
  title?: string;
  statusCode?: number;
}

export default function ErrorPage({
  error,
  reset,
  message = "Có vẻ như có lỗi đã xảy ra. Trang bạn đang tìm kiếm không tồn tại hoặc không thể truy cập.",
  title = "Oops! Có lỗi xảy ra",
  statusCode = 404,
}: ErrorPageProps) {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const quotes = [
    "Trang này đã biến mất như anime season 2 mà bạn đang chờ đợi...",
    "404 - Không tìm thấy trang, giống như tìm một bộ manga đã hoàn thành vậy",
    "Trang này đã biến mất nhanh hơn cả một chapter mới của HxH",
    "Có vẻ như trang này đã isekai sang một thế giới khác",
    "Đừng lo, One Piece vẫn chưa kết thúc, nhưng trang này thì đã kết thúc rồi",
    "Trang này đã biến mất như tóc của Saitama",
    "Bạn đã tìm kiếm trang này nhưng chỉ nhận được MUDA MUDA MUDA MUDA!",
    "Trang này đã bay mất giống như tiền lương khi bạn mua figure anime",
    "Rất tiếc, không ai có thể tìm thấy trang này, kể cả Conan",
    "Trang này đang nghỉ phép, sẽ trở lại sau một hiatus dài như Berserk",
    "404 - Trang này đã bị Thanos búng tay bay mất rồi",
    "Trang này đã bị xóa khỏi Death Note",
    "Trang này đã biến mất như kỹ năng xã hội của một weeb sau khi binge-watch 50 tập anime",
    "Tôi sẽ trở thành Vua Hải Tặc... à không, trang bạn đang tìm kiếm đấy!",
    "Nani?! Trang này không tồn tại?!",
    "Dù có Sharingan bạn cũng không thể tìm thấy trang này đâu",
    "Omae wa mou shindeiru... và cả trang bạn đang tìm kiếm cũng vậy",
    "Đừng lo, đây chỉ là một filler arc, trang bạn cần sẽ xuất hiện ở season sau",
  ];

  const [randomQuote] = useState(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  });

  const handleRetry = () => {
    setIsRetrying(true);
    if (reset) {
      reset();
    } else {
      router.refresh();
    }
    setTimeout(() => setIsRetrying(false), 1000);
  };

  const handleCopyError = async () => {
    if (error) {
      await navigator.clipboard.writeText(error.message);
      setHasCopied(true);
      toast.success("Đã sao chép chi tiết lỗi vào clipboard");
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  return (
    <div className="animate-fadeIn flex min-h-[calc(100vh-80px)] w-full items-center justify-center p-4 opacity-0">
      <Card className="border-primary/10 w-full max-w-2xl overflow-hidden border-2 shadow-lg">
        <CardHeader className="from-primary/10 to-secondary/10 relative overflow-hidden bg-linear-to-r pb-8 text-center">
          <div className="bg-grid-white/10 absolute inset-0 -z-10 mask-[linear-gradient(0deg,transparent,rgba(255,255,255,0.5),transparent)]"></div>
          <div className="text-primary mx-auto mb-4 text-6xl font-bold">
            {statusCode}
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="animate-gentle-pulse relative mx-auto h-60 w-60 shrink-0 md:mx-0">
              <Image
                src="/images/doro_think.webp"
                alt="Error Illustration"
                fill
                className="rounded-md object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
                priority
                unoptimized
              />
            </div>
            <div className="space-y-4 text-center md:text-left">
              <p className="text-muted-foreground">{message}</p>
              <p className="text-muted-foreground text-sm italic">
                {randomQuote}
              </p>
              {error && (
                <div className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15 mt-4 rounded-md border p-3 text-sm shadow-xs transition-colors">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="font-semibold">Chi tiết lỗi:</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-destructive/10 hover:text-destructive h-6 w-6 transition-colors"
                      onClick={void handleCopyError}
                    >
                      {hasCopied ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Clipboard className="text-muted-foreground h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <p className="font-mono break-all">{error.message}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-center gap-2 pt-2 pb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="hover:bg-primary/10 gap-1 transition-all hover:-translate-x-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="hover:bg-primary/90 group gap-1 transition-all hover:shadow-md"
            disabled={isRetrying}
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isRetrying ? "animate-spin" : "group-hover:animate-spin"
              }`}
            />
            Thử lại
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-secondary/70 gap-1 transition-colors"
              >
                <Bug className="h-4 w-4" />
                Báo lỗi
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="animate-fadeScale">
              <DropdownMenuItem asChild>
                <Link
                  href={siteConfig.links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <SiFacebook className="h-4 w-4 text-blue-600" />
                  <span>Facebook</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={siteConfig.links.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                >
                  <SiDiscord className="h-4 w-4 text-indigo-600" />
                  <span>Discord</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <SiGithub className="h-4 w-4" />
                  <span>GitHub</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
    </div>
  );
}
