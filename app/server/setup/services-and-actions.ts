export type dbResult = {
  services: number;
  countries: number;
};

// The first is the service and the array contains all actions on that service
export const servicesandactions: Record<string, string[]> = {
  Europay: [
    "Home",
    "Dashboard",
    "Settings",
    "IAM",
    "Tests",
    "Auth",
    "Social Media",
  ],

  "Social Media": ["Execute"],

  Dashboard: ["Environment", "Version", "Wifi", "Country"],

  "Dashboard.Country": ["Change"],

  Settings: ["Export", "Import"],

  "Settings.Export": [
    "ToViewSS",
    "ToViewP",
    "ToViewR",
    "ToViewU",
    "ToViewG",
    "DbName",
    "ToDbSS",
    "ToDbP",
    "ToDbR",
    "ToDbU",
    "ToDbG",
    "ToDbExport",
    "Clipboard",
  ],

  "Settings.Import": ["DbName", "FromDbImport"],

  IAM: ["Services", "Statements", "Policies", "Roles", "Users", "Groups"],

  Auth: ["Login", "Logout"],
};

// Under here we set all service statements
export type ServiceStatementInfo = {
  service: string;
  action: string;
};

// service statement names will be prefixed bu Allow of Deny
export const managedservicestatements: Record<string, ServiceStatementInfo> =
  {};

export const managedpolicies: Record<string, string[]> = {};

export const managedroles: Record<string, string[]> = {};
