import React, { Suspense } from "react";
import Loaded from "./loaded";
import { createSettings } from "@/app/server/settings";
import { appsettings } from "@/app/server/data/setting-data";
import LoadingSpinner from "@/ui/loading-spinner";
import ProcessSettings from "./process-settings";

const ServiceCreator = async () => {
  console.log("ServiceCreator", "createSettings");
  await createSettings(appsettings);

  return (
    <>
      <Loaded service="Initialised settings" />
      <ProcessSettings />
    </>
  );
};

const SetupSettingsWithSuspense = async ({ _loaded }: { _loaded: boolean }) => {
  console.log("SetupSettingsWithSuspense", "_loaded", _loaded);

  if (_loaded) {
    return (
      <>
        <Loaded service="Initialised settings" />
        <ProcessSettings />
      </>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner label="Initialising..." />}>
      <ServiceCreator />
    </Suspense>
  );
};

export default SetupSettingsWithSuspense;
