"use client";

import { useProgressBar } from "@/hooks/use-progress-bar";
import { absoluteUrl } from "@/lib/util";
// import { absoluteUrl } from "@/app/lib/util";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { startTransition } from "react";

const logofile: string = "/images/Europay.png";

const NavbarLogo = () => {
  const progress = useProgressBar();
  const { push } = useRouter();

  const redirect = (href: string) => {
    progress.start(); // show the indicator

    startTransition(() => {
      push(href);
      progress.done(); // only runs when the destination page is fully loaded
    });
  };

  const goHome = (): void => {
    redirect(absoluteUrl("/"));
  };

  return (
    <div className="hover:cursor-pointer">
      <Image
        data-testid="europay-logo"
        priority={true}
        className="w-[100px] h-[35px]" // this should surpress Image warning
        width={100}
        height={35}
        src={logofile}
        alt="Europay"
        onClick={goHome}
      />
    </div>
  );
};

export default NavbarLogo;
