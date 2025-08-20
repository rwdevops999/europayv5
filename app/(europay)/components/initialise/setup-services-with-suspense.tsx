import { defineServices } from "@/app/server/services";
import { servicesandactions } from "@/app/server/setup/services-and-actions";
import LoadingSpinner from "@/ui/loading-spinner";
import React, { Suspense } from "react";
import Loaded from "./loaded";

const ServiceCreator = async () => {
  await defineServices(servicesandactions, true);

  return null;
};

const SetupServicesWithSuspense = async ({ _loaded }: { _loaded: boolean }) => {
  if (_loaded) {
    return null;
  }

  return (
    <Suspense fallback={<LoadingSpinner label="Initialising..." />}>
      <ServiceCreator />
    </Suspense>
  );
};

export default SetupServicesWithSuspense;
