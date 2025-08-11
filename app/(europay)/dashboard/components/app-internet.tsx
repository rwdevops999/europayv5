"use client";

import { useWifi } from "@/hooks/use-wifi";

const AppInternet = () => {
  const { isConnected } = useWifi();

  return (
    <div
      data-testid="app-wifi"
      className="flex text-2xl font-bold items-center justify-center"
    >
      {isConnected() && (
        <div className="text-4xl text-green-500">connected</div>
      )}
      {!isConnected() && (
        <div className="text-4xl text-red-500">not connected</div>
      )}
    </div>
  );
};

export default AppInternet;
