import React from "react";
import { countServices, defineServices } from "../server/services";
import { countSettings, createSettings } from "../server/settings";
import { countCountries, defineCountries } from "../server/country";
import { countOngoingOTPs } from "../server/otp";
import { servicesandactions } from "../server/setup/services-and-actions";
import { uploadTemplates } from "../server/templates";
import { appsettings } from "../server/data/setting-data";
import { provisionManagedIAM } from "../server/managed";
import SetupServicesWithSuspense from "../(europay)/components/initialise/setup-services-with-suspense";
import SetupCountriesWithSuspense from "../(europay)/components/initialise/setup-countries-with-suspense";
import TemplateLoaderWithSuspense from "../(europay)/components/initialise/templates-loader-with-suspense";
import SetupSettingsWithSuspense from "../(europay)/components/initialise/setup-settings-with-suspense";
import SetupClientJobs from "../(europay)/components/initialise/setup-client-jobs";
import DeleteJobsWithSuspense from "../(europay)/components/initialise/delete-jobs-with-suspense";
import SetupServerJobsWithSuspense from "../(europay)/components/initialise/setup-server-jobs-with-suspense";

const Initialisation = async () => {
  console.log("RUNNING INITIALISATION");
  let loadServices: boolean = false;
  const nrOfServices: number = await countServices();
  const nrOfSettings: number = await countSettings();

  let loadCountries: boolean = false;
  const nrOfCountries: number = await countCountries();

  const nrOngoingOtps: number = await countOngoingOTPs();
  const needProcessingOtps: boolean = nrOngoingOtps > 0;

  if (
    (nrOfServices === 0 && Object.keys(servicesandactions).length > 0) ||
    nrOfServices < Object.keys(servicesandactions).length
  ) {
    loadServices = true;
  }

  if (nrOfCountries === 0) {
    loadCountries = true;
  }

  let servicesLoaded = false;
  if (loadServices) {
    servicesLoaded = await defineServices(servicesandactions, nrOfServices > 0);
  }

  let countriesLoaded = false;
  if (loadCountries) {
    countriesLoaded = (await defineCountries(true)) > 0;
  }

  const templatesloaded = await uploadTemplates(
    process.env.NEXT_PUBLIC_TEMPLATE_FILE
  );

  const loadSettings: boolean = nrOfSettings < appsettings.length;

  let settingsLoaded = true;
  if (loadSettings) {
    settingsLoaded = await createSettings(appsettings);
  }

  const loadManaged: boolean = true;
  let managedLoaded = false;
  if (loadManaged) {
    managedLoaded = await provisionManagedIAM(true);
  }

  return (
    <>
      {loadServices && <SetupServicesWithSuspense _loaded={servicesLoaded} />}
      {loadCountries && (
        <SetupCountriesWithSuspense _loaded={countriesLoaded} />
      )}
      <TemplateLoaderWithSuspense _loaded={templatesloaded} />
      <SetupSettingsWithSuspense _loaded={settingsLoaded} />

      {/* {loadManaged && <SetupManagedWithSuspense _loaded={managedLoaded} />} */}

      <DeleteJobsWithSuspense _needremoval={true} />

      <SetupServerJobsWithSuspense _needprocessing={needProcessingOtps} />
      <SetupClientJobs />
    </>
  );
};

export default Initialisation;
