import { countServices, defineServices } from "@/app/server/services";
import { servicesandactions } from "@/app/server/setup/services-and-actions";
import SetupServicesWithSuspense from "./setup-services-with-suspense";
import { uploadTemplates } from "@/app/server/templates";
import TemplateLoaderWithSuspense from "./templates-loader-with-suspense";
import { countSettings, createSettings } from "@/app/server/settings";
import { appsettings } from "@/app/server/data/setting-data";
import SetupSettingsWithSuspense from "./setup-settings-with-suspense";
import RenderBackground from "./render-background";
import { countCountries, defineCountries } from "@/app/server/country";
import SetupCountriesWithSuspense from "./setup-countries-with-suspense";
import { provisionManagedIAM } from "@/app/server/managed";
import SetupManagedWithSuspense from "./setup-managed-with-suspense";
import FinalizeInitialisation from "./finalize-initialisation";

const InitialiseApplication = async () => {
  let loadServices: boolean = false;
  const nrOfServices: number = await countServices();
  const nrOfSettings: number = await countSettings();
  let loadCountries: boolean = false;
  const nrOfCountries: number = await countCountries();

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
  let settingsLoaded = false;
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
      <RenderBackground />

      {loadServices && <SetupServicesWithSuspense _loaded={servicesLoaded} />}
      {loadCountries && (
        <SetupCountriesWithSuspense _loaded={countriesLoaded} />
      )}
      <TemplateLoaderWithSuspense _loaded={templatesloaded} />
      {loadSettings && <SetupSettingsWithSuspense _loaded={settingsLoaded} />}

      {loadManaged && <SetupManagedWithSuspense _loaded={managedLoaded} />}

      <FinalizeInitialisation />
    </>
  );
};

export default InitialiseApplication;
