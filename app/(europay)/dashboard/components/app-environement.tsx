import React from "react";
import packageJson from "@/package.json";

const AppEnvironment = () => {
  return (
    <div
      data-testid="app-environment"
      className="p-1 flex text-4xl font-bold items-center justify-center text-red-600"
    >
      {process.env.NODE_ENV}
    </div>
  );
};

export default AppEnvironment;
