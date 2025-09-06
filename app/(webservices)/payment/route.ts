import { NextRequest } from "next/server";
import { tWebPayment, tWebResponse } from "../data/web";
import { executePayment } from "@/app/server/transaction";

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
