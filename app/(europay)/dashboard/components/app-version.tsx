import React from "react";
import packageJson from "@/package.json";

const AppVersion = () => {
  return (
    <div
      data-testid="app-version"
      className="p-1 flex text-4xl font-bold items-center justify-center"
    >
      v{packageJson.version}
    </div>
  );
};

export default AppVersion;
