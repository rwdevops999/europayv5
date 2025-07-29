import { countServices, defineServices } from "@/app/server/services";
import { servicesandactions } from "@/app/server/setup/services-and-actions";
import SetupServicesWithSuspense from "./setup-services-with-suspense";

const InitialiseApplication = async () => {
  let loadServices: boolean = false;

  const nrOfServices: number = await countServices();

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

  return (
    <>
      {loadServices && <SetupServicesWithSuspense _loaded={servicesLoaded} />}
    </>
  );
};

export default InitialiseApplication;
