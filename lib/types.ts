import z from "zod";

const extraScheme = z.object({
  subject: z.string().optional(),
  managed: z.boolean().optional(),
  access: z.string().optional(),
  serviceId: z.number().optional(),
  servicename: z.string().optional(),
  parent: z.string().optional(),
  additional: z.any().optional(),
  action: z.any().optional(),
});

const dataScheme = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  children: z.array(z.any()).optional(),
  extra: extraScheme.optional(),
});

export type Data = z.infer<typeof dataScheme>;
