import Image from "next/image";
import React, { useEffect } from "react";

const RenderBackground = () => {
  return (
    <>
      <Image
        src="/images/Europay.jpg"
        alt="Europay"
        fill
        style={{ objectFit: "cover" }}
        className="-z-10"
        priority
      />
    </>
  );
};

export default RenderBackground;
