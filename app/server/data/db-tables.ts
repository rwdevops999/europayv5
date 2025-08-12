export const dbTables: Record<string, string> = {
  countries: "Country",
  services: "Service",
  serviceactions: "ServiceAction",
  addresses: "Address",
  groups: "Group",
  // history: "History",
  // jobs: "Job",
  // otp: "OTP",
  policies: "Policy",
  roles: "Role",
  servicestatements: "ServiceStatement",
  servicestatementactions: "ServiceStatementAction",
  settings: "Setting",
  // tasks: "Task",
  templates: "Template",
  users: "User",
  accounts: "Account",
};

export const linkedDbTables: Record<string, string[]> = {
  services: ["serviceactions"],
  servicestatements: ["servicestatementactions"],
  users: ["addresses"],
};
