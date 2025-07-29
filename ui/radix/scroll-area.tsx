"use client";

import * as React from "react";
import * as RadixScrollArea from "@radix-ui/react-scroll-area";
import { cn } from "@/app/lib/util";

export const ScrollArea = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadixScrollArea.Root>) => {
  return (
    <RadixScrollArea.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <RadixScrollArea.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {children}
      </RadixScrollArea.Viewport>
      <ScrollBar />
      <RadixScrollArea.Corner />
    </RadixScrollArea.Root>
  );
};

export const ScrollBar = ({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof RadixScrollArea.ScrollAreaScrollbar>) => {
  return (
    <RadixScrollArea.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <RadixScrollArea.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-neutral-content relative flex-1 rounded-full"
      />
    </RadixScrollArea.ScrollAreaScrollbar>
  );
};
