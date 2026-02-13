"use client";

import { useLocalNotification } from "@/shared/hooks/use-local-notification";
import { getUnreadChapters } from "@/features/notification/api/notifications";
import useSWR from "swr";
import { Button } from "@/shared/components/ui/button";
import { BellOff, CheckCheck, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Chapter } from "@/shared/types/common";
import UnreadCard from "./unread-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { useRouter } from "next/navigation";

interface NotificationsProps {
  page: number;
}

const LIMIT = 32; // Number of notifications per page

export default function Notifications({ page }: NotificationsProps) {
  const { markAllAsRead, localNotification, clearAllLocalNotifications } =
    useLocalNotification();
  const router = useRouter();

  const unreadIds = localNotification.unread;
  const totalPages = Math.ceil(unreadIds.length / LIMIT);
  const idsPerPage = unreadIds.slice((page - 1) * LIMIT, page * LIMIT);

  const { data, error, isLoading } = useSWR(["noti", idsPerPage], ([, ids]) =>
    getUnreadChapters(ids),
  );

  const handlePageChange = (newPage: number) => {
    router.push(`/notifications?page=${newPage}`);
  };

  return (
    <>
      <div className="flex w-full flex-wrap justify-end gap-2">
        <Button
          className="line-clamp-1 flex w-full shrink! break-all! whitespace-normal! md:w-auto"
          size="sm"
          onClick={clearAllLocalNotifications}
          variant="secondary"
        >
          <BellOff />
          <span className="line-clamp-1 break-all">
            Hủy nhận thông báo tất cả
          </span>
        </Button>
        <Button
          className="line-clamp-1 flex w-full shrink! break-all! whitespace-normal! md:w-auto"
          size="sm"
          onClick={markAllAsRead}
          variant="secondary"
        >
          <CheckCheck />
          <span className="line-clamp-1 break-all">
            Đánh dấu tất cả là đã đọc
          </span>
        </Button>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        <NotificationSection isLoading={isLoading} error={error} data={data} />
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationPrevious
              className="h-8 w-8"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            />

            {totalPages <= 7 ? (
              // Show all pages if total is 7 or less
              Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    className="h-8 w-8"
                    isActive={i + 1 === page}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))
            ) : page <= 4 ? (
              // Near start: show 1, 2, 3, 4, 5, ..., lastPage
              <>
                {[1, 2, 3, 4, 5].map((num) => (
                  <PaginationItem key={num}>
                    <PaginationLink
                      className="h-8 w-8"
                      isActive={num === page}
                      onClick={() => handlePageChange(num)}
                    >
                      {num}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationEllipsis />
                <PaginationItem>
                  <PaginationLink
                    className="h-8 w-8"
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            ) : page >= totalPages - 3 ? (
              // Near end: show 1, ..., lastPage-4, lastPage-3, lastPage-2, lastPage-1, lastPage
              <>
                <PaginationItem>
                  <PaginationLink
                    className="h-8 w-8"
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationEllipsis />
                {[
                  totalPages - 4,
                  totalPages - 3,
                  totalPages - 2,
                  totalPages - 1,
                  totalPages,
                ].map((num) => (
                  <PaginationItem key={num}>
                    <PaginationLink
                      className="h-8 w-8"
                      isActive={num === page}
                      onClick={() => handlePageChange(num)}
                    >
                      {num}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </>
            ) : (
              // Middle: show 1, ..., page-1, page, page+1, ..., lastPage
              <>
                <PaginationItem>
                  <PaginationLink
                    className="h-8 w-8"
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationEllipsis />
                {[page - 1, page, page + 1].map((num) => (
                  <PaginationItem key={num}>
                    <PaginationLink
                      className="h-8 w-8"
                      isActive={num === page}
                      onClick={() => handlePageChange(num)}
                    >
                      {num}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationEllipsis />
                <PaginationItem>
                  <PaginationLink
                    className="h-8 w-8"
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationNext
              className="h-8 w-8"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            />
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}

interface NotificationSectionProps {
  isLoading: boolean;
  error: any;
  data: Chapter[] | undefined;
}

function NotificationSection({
  isLoading,
  error,
  data,
}: NotificationSectionProps) {
  if (isLoading) {
    return (
      <Alert className="rounded-sm border-none">
        <AlertDescription className="flex justify-center">
          <Loader2 className="animate-spin" />
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert className="bg-secondary rounded-sm">
        <AlertDescription className="flex justify-center">
          Lỗi mất rồi 😭
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Alert className="bg-secondary rounded-sm">
        <AlertDescription className="flex justify-center">
          Không có thông báo nào
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      {data.map((chapter) => (
        <UnreadCard key={chapter.id} chapter={chapter} />
      ))}
    </>
  );
}
