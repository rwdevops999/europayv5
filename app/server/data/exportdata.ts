import { z } from "zod";

export type ServiceStatementActionForExport = {
  name: string;
  serviceaction: string;
};

export type ServiceStatementForExport = {
  name: string;
  description?: string;
  permission?: string;
  managed?: boolean;
  servicename?: string;
  servicestatementactions?: ServiceStatementActionForExport[];
};

export type PolicyForExport = {
  name: string;
  description: string;
  managed: boolean;
  servicestatements: string[];
};

export type RoleForExport = {
  name: string;
  description: string;
  managed: boolean;
  policies: string[];
};

export type UserForExport = {
  username: string;
  lastname: string;
  firstname: string;
  email: string;
  password: string;
  passwordless: boolean;
  blocked: boolean;
  managed: boolean;
  type: string;
  country: string;
  policies: string[];
  roles: string[];
};

export type UserForGroupForExport = {
  lastname: string;
  firstname: string;
};

export type GroupForExport = {
  name: string;
  description: string;
  managed: boolean;
  policies: string[];
  roles: string[];
  users: UserForGroupForExport[];
};

export type IamData = {
  servicestatements: ServiceStatementForExport[];
  policies: PolicyForExport[];
  roles: RoleForExport[];
  users: UserForExport[];
  groups: GroupForExport[];
};

const exportDataScheme = z.object({
  id: z.number(),
  exportId: z.string(),
  name: z.string(),
  exportdate: z.string(),
  children: z.array(z.any()).optional(),
});

export type tExportData = z.infer<typeof exportDataScheme>;
