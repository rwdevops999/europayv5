import { URL_ENCODING_ASSIGNMENT } from "@/lib/constants";
import { CreatePromise, isNumber } from "@/lib/util";
import LoadingSpinner from "@/ui/loading-spinner";
import { Suspense } from "react";
import IamServicesPage from "../page";

const ServicesWithId = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  let serviceId: number | undefined;

  const getURLDetails = (_id: string) => {
    const serviceIdentifier: string[] = _id.split(URL_ENCODING_ASSIGNMENT);
    const sid: string = serviceIdentifier[1];

    if (isNumber(sid)) {
      serviceId = parseInt(sid) as number;
    }
  };

  getURLDetails(id);

  // <Services ... /> is called with serviceId = undefined or a number.
  // http://localhost:3000/iam/services/id sets serviceId to undefined
  // http://localhost:3000/iam/services/id=33 sets serviceId to 33
  const renderComponent = () => {
    const promise = CreatePromise(serviceId);

    return (
      <Suspense fallback={<LoadingSpinner label="Loading..." />}>
        <IamServicesPage params={promise} />
      </Suspense>
    );
  };

  return <>{renderComponent()}</>;
};

export default ServicesWithId;
