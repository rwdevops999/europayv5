import { NextRequest } from "next/server";
import { tWebPayment, tWebResponse } from "../data/web";
import { executePayment } from "@/app/server/transaction";

export const POST = async (_request: NextRequest): Promise<Response> => {
  let response: string = "200";

  const payment: tWebPayment = await _request.json();

  response = await executePayment(
    payment.token,
    payment.sender,
    payment.recipient,
    payment.amount,
    payment.message
  );

  return Response.json(response);
};
