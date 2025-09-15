"use client";

import React, { use } from "react";
import StartSettings from "./components/start-settings";

const HandleUserSettings = ({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) => {
  const params = use(searchParams);

  const id: string | undefined = params.id;

  const renderComponent = () => {
    return <StartSettings open={id} />;
  };

  return <>{renderComponent()}</>;
};

export default HandleUserSettings;
