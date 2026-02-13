"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CATAAS_BASE, getCatCount } from "@/shared/lib/cat";
import { IdCardIcon } from "lucide-react";
import useSWR from "swr";

export function TotalCatAlert() {
  const {
    data: totalCats,
    error,
    isLoading,
  } = useSWR("cat-count", () => getCatCount());

  return (
    <Alert>
      <IdCardIcon />
      <AlertTitle className="line-clamp-none font-medium">
        Xem ảnh mồn lèo giải trí -
        {totalCats && !isLoading && !error && ` Hiện có ${totalCats} con mèo.`}
      </AlertTitle>
      <AlertDescription>
        <span>
          Dữ liệu được lấy từ:{" "}
          <a
            href={CATAAS_BASE}
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary underline"
          >
            cataas.com
          </a>
        </span>
      </AlertDescription>
    </Alert>
  );
}
