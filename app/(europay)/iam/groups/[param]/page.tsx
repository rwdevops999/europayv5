import { Suspense } from "react";
import IamGroupsPage from "../page";
import { CreatePromise, isNumber, splitURLParams } from "@/lib/functions";
import LoadingSpinner from "@/ui/loading-spinner";

/**
 * this component is called throught the menu (id = undefined) or e.g through groups (id = number)
 *
 * @param params : the id
 * @returns
 */
const GroupsWithId = async ({
  params,
}: {
  params: Promise<{ param: string }>;
}) => {
  const { param } = await params;

  let groupId: number | undefined;

  /**
   * parse URL parameters
   *
   * @param _param : the url param string
   */
  const parseURLParams = (_param: string) => {
    const params: Record<string, string> = splitURLParams(_param);

    if (isNumber(params["id"])) {
      groupId = parseInt(params["id"]) as number;
    }
  };

  parseURLParams(param);

  const renderComponent = () => {
    /**
     * create a Promise which resolved as policyId
     */
    const promise: Promise<any[]> = CreatePromise(groupId);

    return (
      <Suspense fallback={<LoadingSpinner label="Loading..." />}>
        <IamGroupsPage params={promise} />
      </Suspense>
    );
  };

  return <>{renderComponent()}</>;
};

export default GroupsWithId;
