import { Inngest } from "inngest";
import { connect } from "inngest/connect";
import { ConnectionState } from "inngest/components/connect/types";
import { inngestfunctions } from "./functions";

export const inngest = new Inngest({
  id: "europay-app",
  name: "Europay Application",
});

// const handleSignupFunction = inngest.createFunction(
//   { id: "handle-signup" },
//   { event: "user.created" },
//   async ({ event, step }) => {
//     console.log("Inngest Signup Function called", event);
//   }
// );

// (async () => {
//   const connection = await connect({
//     apps: [
//       {
//         client: inngest,
//         functions: [handleSignupFunction],
//       },
//     ],
//   });

//   console.log("Worker: connected", connection);
// })();
