import { NextRequest } from "next/server";

export const GET = async (request: NextRequest): Promise<Response> => {
  return Response.json("Hello");
};
