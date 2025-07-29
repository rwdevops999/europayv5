import { CreatePromise, isNumber, splitURLParams } from "@/lib/functions";
import LoadingSpinner from "@/ui/loading-spinner";
import { Suspense } from "react";
import IamStatementsPage from "../page";

/**
 * this component is call throught the menu (id = undefined) or e.g throught policies (id = number)
 *
 * @param params : the id
 * @returns
 */
const ServiceStatementsWithParam = async ({
  params,
}: {
  params: Promise<{ param: string }>;
}) => {
  const { param } = await params;

  let statementId: number | undefined;
  let serviceId: number | undefined;

  /**
   * parse URL parameters
   * .../id=5&serviceid=3 => statementId=5, serviceId=3
   * .../id=5 => statementId=5, serviceId=undefined
   * .../id => statementId=undefined, serviceId=undefined
   *
   * @param _param : the url param string (e.g: id%3D5%26serviceid%3D3), wehere %3D is '=' and %26 is '&'
   */
  const parseURLParams = (_param: string) => {
    const params: Record<string, string> = splitURLParams(_param);

    if (isNumber(params["id"])) {
      statementId = parseInt(params["id"]) as number;
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
     * create a Promise which resolved as an array with [statementId, serviceId]
     */
    const promise: Promise<any[]> = CreatePromise([statementId, serviceId]);

    /**
     * we pass the statement id (undefined or real id) to IamStatementsPage.
     * This page async loads all services and all service statements.
     * That's why it is surrounded with a suspense (showing a loading spinner).
     */
    return (
      <Suspense fallback={<LoadingSpinner label="Loading..." />}>
        <IamStatementsPage params={promise} />
      </Suspense>
    );
  };

  return <>{renderComponent()}</>;
};

export default ServiceStatementsWithParam;
