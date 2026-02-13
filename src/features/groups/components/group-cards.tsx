import type { Group } from "@/shared/types/common";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Users } from "lucide-react";
import { generateSlug } from "@/shared/lib/utils";
import NoPrefetchLink from "@/shared/components/custom/no-prefetch-link";

interface GroupCardsProps {
  groups: Group[];
}

export default function GroupCards({ groups }: GroupCardsProps) {
  if (groups.length === 0) {
    return (
      <Card className="mt-4 flex h-16 w-full items-center justify-center rounded-sm">
        Không có kết quả!
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {groups.map((group) => (
        <Button
          asChild
          key={group.id}
          className="shrink! justify-start rounded-sm px-4! break-all! whitespace-normal!"
          variant="secondary"
          size="lg"
        >
          <NoPrefetchLink
            href={`/group/${group.id}/${generateSlug(group.name)}`}
          >
            <Users />
            <span className="line-clamp-1 break-all">{group.name}</span>
          </NoPrefetchLink>
        </Button>
      ))}
    </div>
  );
}
