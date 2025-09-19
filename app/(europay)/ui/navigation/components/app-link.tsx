"use client";

import ProgressLink from "@/ui/progress-link";
// import ProgressLink from "@/app/ui/progress-link";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

const AppLink = ({
  href,
  children,
  className,
  disabled = false,
  ...props
}: React.ComponentProps<typeof Link> & { disabled?: boolean }) => {
  // if (process.env.NODE_ENV === "development") {
  return (
    <ProgressLink
      href={href.toString()}
      className={className}
      disabled={disabled}
    >
      {children}
    </ProgressLink>
  );
};
// };

export default AppLink;
