import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Cat, getCatImageUrl } from "@/shared/lib/cat";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface CatCardProps {
  cat: Cat;
}

export function CatCard({ cat }: CatCardProps) {
  return (
    <Card className="bg-background relative h-full w-full rounded-sm border-none shadow-none transition-colors duration-200">
      <CardContent className="relative rounded-sm p-0">
        <LazyLoadImage
          wrapperClassName="block! rounded-sm object-cover w-full h-full"
          placeholderSrc="/images/place-doro.webp"
          className="block aspect-5/7 h-auto w-full rounded-sm object-cover"
          src={getCatImageUrl(cat.id, { width: 400, height: 400 })}
          alt={`Ảnh bìa ${cat.id}`}
          onError={(e) => {
            e.currentTarget.src = "/images/xidoco.webp";
          }}
        />
      </CardContent>

      <CardFooter className="flex flex-wrap gap-1 px-0 py-2">
        {cat.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} className="rounded-sm lowercase" variant="secondary">
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
}
