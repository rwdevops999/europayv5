import { defineCountries } from "@/app/server/country";
import Loaded from "./loaded";
import { Suspense } from "react";
import LoadingSpinner from "@/ui/loading-spinner";

const CountryCreator = async () => {
  await defineCountries(true);

  return (
    <>
      <Loaded service="Initialised countries" />
    </>
  );
};

const SetupCountriesWithSuspense = async ({
  _loaded,
}: {
  _loaded: boolean;
}) => {
  if (_loaded) {
    return (
      <>
        <Loaded service="Initialised countries" />
      </>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner label="Initialising..." />}>
      <CountryCreator />
    </Suspense>
  );
};

export default SetupCountriesWithSuspense;
