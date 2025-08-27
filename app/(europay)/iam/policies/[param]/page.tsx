import { CreatePromise, isNumber, splitURLParams } from "@/lib/util";
import LoadingSpinner from "@/ui/loading-spinner";
import { Suspense } from "react";
import IamPoliciesPage from "../page";

/**
 * this component is called throught the menu (id = undefined) or e.g through roles (id = number)
 *
 * @param params : the id
 * @returns
 */
const PoliciesWithParam = async ({
  params,
}: {
  params: Promise<{ param: string }>;
}) => {
  const { param } = await params;

  let policyId: number | undefined;
  let serviceId: number | undefined;

  /**
   * parse URL parameters
   *
   * @param _param : the url param string
   */
  const parseURLParams = (_param: string) => {
    const params: Record<string, string> = splitURLParams(_param);

    if (isNumber(params["id"])) {
      policyId = parseInt(params["id"]) as number;
    }

    if (isNumber(params["serviceid"])) {
      serviceId = parseInt(params["serviceid"]) as number;
    }
  };

  parseURLParams(param);

  // <Services ... /> is called with serviceId = undefined or a number.
  // http://localhost:3000/iam/services/id sets serviceId to undefined
  // http://localhost:3000/iam/services/id=33 sets serviceId to 33
  const renderComponent = () => {
    /**
     * create a Promise which resolved as policyId
     */
    const promise: Promise<any[]> = CreatePromise([policyId, serviceId]);
    return (
      <Suspense fallback={<LoadingSpinner label="Loading..." />}>
        <IamPoliciesPage params={promise} />
      </Suspense>
    );
  };

  return <>{renderComponent()}</>;
};

export default PoliciesWithParam;
