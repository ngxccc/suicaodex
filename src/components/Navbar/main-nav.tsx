"use client";

import Link from "next/link";
import useScrollOffset from "@/shared/hooks/use-scroll-offset";
import { cn } from "@/shared/lib/utils";
// import { usePathname } from "next/navigation";
import Image from "next/image";
import { logos } from "../../shared/components/logos";

export function MainNav() {
  const { isAtTop } = useScrollOffset();
  // const pathname = usePathname();

  return (
    <Link
      href="/"
      className="mr-4 flex items-center justify-start gap-0.5 lg:mr-6"
    >
      <Image
        src={logos.gehenna}
        alt="SuicaoDex's logo"
        className={cn(
          "max-h-8 w-auto contrast-150 grayscale dark:invert",
          // pathname.includes("/manga") && "invert",
          !isAtTop && "invert-0 md:invert-0",
        )}
        quality={100}
        priority
      />
      <Image
        src={logos.scdex}
        alt="SuicaoDex's logo"
        quality={100}
        priority
        className={cn(
          "xs:hidden max-h-[22px] w-auto drop-shadow-md dark:invert",
          // pathname.includes("/manga") && "invert",
          // pathname.includes("/group/") && "md:invert",
          !isAtTop && "filter-none md:filter-none",
        )}
      />
      <Image
        src={logos.suicaodex}
        alt="SuicaoDex's logo"
        quality={100}
        priority
        className={cn(
          "xs:flex hidden max-h-[22px] w-auto drop-shadow-md dark:invert",
          // pathname.includes("/manga") && "invert",
          // pathname.includes("/group/") && "md:invert",
          !isAtTop && "filter-none md:filter-none",
        )}
      />
    </Link>
  );
}
