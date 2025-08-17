import { JobStatus } from "@/generated/prisma";
import { z } from "zod";

export type JobFunc = (_data: any) => void;

export type JobInfo = {
  func: JobFunc;
  status: JobStatus; // job status
};

const jobDataScheme = z.object({
  id: z.number(),
  jobId: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.string(),
  model: z.string(),
  children: z.array(z.any()).optional(),
});

export type JobData = z.infer<typeof jobDataScheme>;
