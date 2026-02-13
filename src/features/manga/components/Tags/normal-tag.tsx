import { cn } from "@/shared/lib/utils";
import type { ComponentProps } from "react";

export default function NormalTag(props: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "bg-accent flex w-fit items-center gap-1 rounded-sm px-1.5 py-0 text-[0.625rem] font-bold",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
