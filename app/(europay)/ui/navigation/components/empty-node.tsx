import React from "react";
import { PiEmpty } from "react-icons/pi";

const EmptyNode = () => {
  return (
    <div className="flex items-center justify-center border-1 border-gray-500">
      <PiEmpty size={16} />
    </div>
  );
};

export default EmptyNode;
