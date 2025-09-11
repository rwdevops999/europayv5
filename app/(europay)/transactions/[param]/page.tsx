import React from "react";
import TransactionViewer from "./transaction-viewer";
import { isNumber, splitURLParams } from "@/lib/util";

export const dynamic = "force-dynamic";

const TransactionWithId = async ({
  params,
}: {
  params: Promise<{ param: string }>;
}) => {
  const { param } = await params;

  let transactionId: number | undefined;

  /**
   * parse URL parameters
   *
   * @param _param : the url param string
   */
  const parseURLParams = (_param: string) => {
    const params: Record<string, string> = splitURLParams(_param);

    if (isNumber(params["id"])) {
      transactionId = parseInt(params["id"]) as number;
    }
  };

  parseURLParams(param);

  const renderComponent = () => {
    return <TransactionViewer transactionId={transactionId} />;
  };

  return <>{renderComponent()}</>;
};

export default TransactionWithId;
