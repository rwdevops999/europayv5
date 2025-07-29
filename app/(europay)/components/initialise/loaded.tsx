import React from "react";
import { GiTrafficLightsReadyToGo } from "react-icons/gi";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

const Loaded = ({
  service,
  final = false,
}: {
  service: string;
  final?: boolean;
}) => {
  return (
    <>
      <div data-testid={`init-${service}`} className="ml-3 flex items-center">
        <div className="text-gray-200">- {service} ...</div>
        <IoCheckmarkDoneOutline style={{ color: "white" }} />
      </div>
      {final && (
        <div data-testid={`init-${service}`} className="ml-3 flex items-center">
          <GiTrafficLightsReadyToGo size={32} style={{ color: "green" }} />
          <div className="text-gray-200">Ready</div>
        </div>
      )}
    </>
  );
};

export default Loaded;
