import type { Tag } from "@/shared/types/common";
import { generateSlug } from "@/shared/lib/utils";
import StatusChip from "./status-tag";
import ContentRatingChip from "./content-rating-tag";
import NormalTag from "./normal-tag";

interface TagsProps {
  tags: Tag[];
  contentRating: string;
  status: string;
}

export default function Tags({ tags, contentRating, status }: TagsProps) {
  return (
    <>
      <StatusChip status={status} isLink />
      <ContentRatingChip rating={contentRating} />
      {tags.map((tag) => (
        <NormalTag key={tag.id} className="uppercase">
          <a
            href={`/tag/${tag.id}/${generateSlug(tag.name)}`}
            className="text-gray-700 hover:underline dark:text-white"
          >
            {tag.name}
          </a>
        </NormalTag>
      ))}
    </>
  );
}
