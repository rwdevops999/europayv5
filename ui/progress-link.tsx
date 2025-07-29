"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { useProgressBar } from "../hooks/use-progress-bar";

const ProgressLink = ({
  href,
  children,
  className,
  disabled = false,
  ...rest
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) => {
  const { push } = useRouter();
  const progress = useProgressBar();

  const navigateToDestination = (e: any) => {
    e.preventDefault();
    progress.start(); // show the indicator

    startTransition(() => {
      push(href);
      progress.done(); // only runs when the destination page is fully loaded
    });
  };

  return (
    <Link
      prefetch={true}
      href=""
      onClick={disabled ? () => {} : navigateToDestination}
      {...rest}
      className={className}
    >
      {children}
    </Link>
  );
};

export default ProgressLink;
