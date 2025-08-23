import { CreatePromise, isNumber, splitURLParams } from "@/lib/util";
import LoadingSpinner from "@/ui/loading-spinner";
import { Suspense } from "react";
import IamRolesPage from "../page";

/**
 * this component is called throught the menu (id = undefined) or e.g through roles (id = number)
 *
 * @param params : the id
 * @returns
 */
const RolesWithParam = async ({
  params,
}: {
  params: Promise<{ param: string }>;
}) => {
  const { param } = await params;

  let roleId: number | undefined;

  /**
   * parse URL parameters
   *
   * @param _param : the url param string
   */
  const parseURLParams = (_param: string) => {
    const params: Record<string, string> = splitURLParams(_param);

    if (isNumber(params["id"])) {
      roleId = parseInt(params["id"]) as number;
    }
  };

  parseURLParams(param);

  const renderComponent = () => {
    /**
     * create a Promise which resolved as policyId
     */
    console.log("[ROLE WITH ID]", roleId);

    const promise: Promise<any[]> = CreatePromise(roleId);

    return (
      <Suspense fallback={<LoadingSpinner label="Loading..." />}>
        <IamRolesPage params={promise} />
      </Suspense>
    );
  };

  return <>{renderComponent()}</>;
};

export default RolesWithParam;
