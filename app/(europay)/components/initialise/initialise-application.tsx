import { countServices, defineServices } from "@/app/server/services";
import { servicesandactions } from "@/app/server/setup/services-and-actions";
import SetupServicesWithSuspense from "./setup-services-with-suspense";
import { uploadTemplates } from "@/app/server/templates";
import TemplateLoaderWithSuspense from "./templates-loader-with-suspense";
import { countSettings, createSettings } from "@/app/server/settings";
import { appsettings } from "@/app/server/data/setting-data";
import SetupSettingsWithSuspense from "./setup-settings-with-suspense";

const InitialiseApplication = async () => {
  let loadServices: boolean = false;
  const nrOfServices: number = await countServices();
  const nrOfSettings: number = await countSettings();

  if (
    (nrOfServices === 0 && Object.keys(servicesandactions).length > 0) ||
    nrOfServices < Object.keys(servicesandactions).length
  ) {
    loadServices = true;
  }

  let servicesLoaded = false;
  if (loadServices) {
    servicesLoaded = await defineServices(servicesandactions, nrOfServices > 0);
  }

  const templatesloaded = await uploadTemplates(
    process.env.NEXT_PUBLIC_TEMPLATE_FILE
  );

  const loadSettings: boolean = nrOfSettings < appsettings.length;
  let settingsLoaded = false;
  if (loadSettings) {
    settingsLoaded = await createSettings(appsettings);
  }

  console.log("InitialiseApplication", "loadSettings", loadSettings);

  return (
    <>
      {loadServices && <SetupServicesWithSuspense _loaded={servicesLoaded} />}
      <TemplateLoaderWithSuspense _loaded={templatesloaded} />
      {loadSettings && <SetupSettingsWithSuspense _loaded={settingsLoaded} />}
    </>
  );
};

export default InitialiseApplication;
