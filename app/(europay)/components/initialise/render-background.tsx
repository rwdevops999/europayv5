import Image from "next/image";
import React from "react";
import { GiTrafficLightsReadyToGo } from "react-icons/gi";

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
      <div data-testid={`init-wait`} className="ml-3 flex items-center">
        <GiTrafficLightsReadyToGo size={32} style={{ color: "red" }} />
        <div className="text-gray-200">Please wait</div>
      </div>
    </>
  );
};

export default RenderBackground;
