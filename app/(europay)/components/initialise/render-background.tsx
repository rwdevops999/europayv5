"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import HideCursor from "./hide-cursor";
import { useInit } from "@/hooks/use-init";

const RenderBackground = () => {
  const { init } = useInit();

  return (
    <>
      {/* <HideCursor /> */}
      {init && (
        <Image
          src="/images/Europay.jpg"
          alt="Europay"
          fill
          style={{ objectFit: "cover" }}
          className="-z-10"
          priority
        />
      )}
    </>
  );
};

export default RenderBackground;
