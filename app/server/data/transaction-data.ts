import { z } from "zod";

// For mapping tTransaction to table data
const transactionDataScheme = z.object({
  id: z.number(),
  transactionId: z.string(),
  amount: z.string(),
  sender: z.string(),
  receiver: z.string(),
  children: z.array(z.any()).optional(),
});

export type tTransactionData = z.infer<typeof transactionDataScheme>;
