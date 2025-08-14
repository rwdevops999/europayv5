export const dbTables: Record<string, string> = {
  accounts: "Account",
  accountApply: "AccountApply",
  addresses: "Address",
  countries: "Country",
  exports: "Export",
  groups: "Group",
  history: "History",
  jobs: "",
  otp: "OTP",
  policies: "Policy",
  roles: "Role",
  services: "Service",
  serviceactions: "ServiceAction",
  servicestatements: "ServiceStatement",
  servicestatementactions: "ServiceStatementAction",
  settings: "Setting",
  tasks: "Task",
  templates: "Template",
  users: "User",
};

export const linkedDbTables: Record<string, string[]> = {
  services: ["serviceactions"],
  servicestatements: ["servicestatementactions"],
  users: ["addresses", "accounts"],
};

export type dbResult = {
  nrOfservices: number;
  nrOfcountries: number;
};
