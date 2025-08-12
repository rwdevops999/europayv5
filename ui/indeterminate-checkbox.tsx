"use client";

import { cn } from "@/lib/util";
import { HTMLProps, useEffect, useRef } from "react";

const IndeterminateCheckbox = ({
  indeterminate,
  className = "",
  ...props
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) => {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !props.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={cn(className, "cursor-pointer")}
      {...props}
    />
  );
};

export default IndeterminateCheckbox;
