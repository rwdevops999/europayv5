import { provisionManagedIAM } from "@/app/server/managed";
import Loaded from "./loaded";
import { Suspense } from "react";
import LoadingSpinner from "@/ui/loading-spinner";

const ManagedCreator = async () => {
  await provisionManagedIAM(true);

  return (
    <>
      <Loaded service="Initialised managed IAM" />
    </>
  );
};

const SetupManagedWithSuspense = async ({ _loaded }: { _loaded: boolean }) => {
  if (_loaded) {
    return (
      <>
        <Loaded service="Initialised managed IAM" />
      </>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner label="Initialising..." />}>
      <ManagedCreator />
    </Suspense>
  );
};

export default SetupManagedWithSuspense;
