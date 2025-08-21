import { inngest } from "@/app/inngest/client";
import { inngestfunctions } from "@/app/inngest/functions";
import { serve } from "inngest/next";

// Create an API that serves zero functions
export const GET = serve({
  client: inngest,
  functions: inngestfunctions,
});

export const POST = serve({
  client: inngest,
  functions: inngestfunctions,
});

export const PUT = serve({
  client: inngest,
  functions: inngestfunctions,
});
