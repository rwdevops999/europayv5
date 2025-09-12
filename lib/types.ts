import z from "zod";

const extraScheme = z.object({
  subject: z.string().optional(),
  managed: z.boolean().optional(),
  system: z.boolean().optional(),
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

export type ToastFn = (_message: string, _options: any) => void;

export enum ToastType {
  DEFAULT = "default",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

export type tCountryFile = {
  name: string;
  dial_code: string;
  code: string;
  currency: string;
  currencycode: string;
  symbol: string;
};

const historyDataScheme = z.object({
  title: z.string(),
  type: z.string(),
  description: z.string(),
  originator: z.string(),
  date: z.string(),
  children: z.array(z.any()).optional(),
});

export type tHistoryData = z.infer<typeof historyDataScheme>;
