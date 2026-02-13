"use client";

import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { getTags, groupTags } from "@/lib/mangadex/tag";
import Image from "next/image";
import useSWR from "swr";
import DoroLoading from "#/images/doro-loading.gif";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import NoPrefetchLink from "@/shared/components/custom/no-prefetch-link";
import { generateSlug } from "@/shared/lib/utils";

export default function TagsPage() {
  const { data, error, isLoading } = useSWR(
    ["tags"],
    () => getTags(), // Fetch tags data
  );

  if (isLoading) {
    return (
      <Alert className="mt-4 rounded-sm border-none">
        <AlertDescription className="flex justify-center">
          <Image
            src={DoroLoading}
            alt="Loading..."
            unoptimized
            priority
            className="h-auto w-20"
          />
        </AlertDescription>
      </Alert>
    );
  }

  if (error || !data) {
    return <div>Lỗi mất rồi 😭</div>;
  }

  const groupedTags = groupTags(data);
  //   console.log(groupedTags);

  return (
    <div className="space-y-4">
      {groupedTags.map((group) => (
        <div key={group.group} className="space-y-2">
          <Label className="text-lg font-bold">{group.name}</Label>
          <div className="flex flex-wrap gap-2">
            {group.tags.map((tag) => (
              <Button asChild key={tag.id} variant="secondary" size="sm">
                <NoPrefetchLink
                  href={`/tag/${tag.id}/${generateSlug(tag.name)}`}
                >
                  {tag.name}
                </NoPrefetchLink>
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
