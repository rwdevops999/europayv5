import { NextRequest } from "next/server";
import { tWebPayment, tWebResponse } from "../data/web";
import { json } from "@/app/lib/util";
import { executePayment } from "@/app/(europay)/scripts/server/transaction";

export const POST = async (_request: NextRequest): Promise<Response> => {
  let response: tWebResponse = {
    message: "Not OK",
  };

  const payment: tWebPayment = await _request.json();

  response.message = "Europayv4";

  response.message = await executePayment(
    payment.sender,
    payment.recipient,
    payment.amount,
    payment.message
  );

  return Response.json(response);
};
