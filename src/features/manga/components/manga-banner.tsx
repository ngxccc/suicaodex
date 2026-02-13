import { cn, getCoverImageUrl } from "@/shared/lib/utils";

interface BannerProps {
  id?: string;
  src: string;
}

export default function Banner({ id, src }: BannerProps) {
  const coverURL = id ? getCoverImageUrl(id, src, "256") : src;

  return (
    <>
      {/* <div
        className="fixed top-0 left-0 z-[-2] w-full h-[640px] blur-xl bg-background"
        style={{
          backgroundImage: `url('${coverURL}')`,
          backgroundPosition: "center 35%",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div> */}

      {/* <div className="absolute top-70 left-0 z-[-1] w-full min-h-screen bg-background"></div> */}

      <div className="absolute top-0 right-0 left-0 z-[-2] block h-70 w-auto">
        <div
          className={cn(
            "absolute h-70 w-full",
            "transition-[width] duration-150 ease-in-out",
            "bg-cover bg-position-[center_top_33%] bg-no-repeat md:bg-fixed",
          )}
          style={{ backgroundImage: `url('${coverURL}')` }}
        ></div>
        <div
          className={cn(
            "pointer-events-none absolute inset-0 h-70 w-auto",
            "backdrop-blur-none md:backdrop-blur-xs",
            "from-background/65 bg-linear-to-r to-transparent",
          )}
        ></div>

        <div
          className={cn(
            "md:hidden",
            "pointer-events-none absolute inset-0 h-70 w-auto backdrop-blur-[1px]",
            "from-background/5 to-background bg-linear-to-b",
          )}
        ></div>
      </div>
    </>
  );
}
