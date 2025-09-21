export type dbResult = {
  services: number;
  countries: number;
};

// The first is the service and the array contains all actions on that service
export const servicesandactions: Record<string, string[]> = {
  europay: [
    "Goto Home",
    "Dashboard Menu",
    "Lists Menu",
    "Settings Menu",
    "IAM Menu",
    "Manual Menu",
    "Social Media",
    "User Menu",
    "Admin Menu",
    "Apply",
    "API Menu",
  ],

  "europay:dashboard": ["Environment", "Version", "Wifi", "Country"],
  "europay:dashboard:country": ["Change"],

  "europay:lists": [
    "Task Submenu",
    "Job Submenu",
    "History Submenu",
    "Transaction Submenu",
    "Export Submenu",
  ],

  "europay:lists:tasks": ["Handle"],
  "europay:lists:jobs": ["Suspend", "Restart", "Remove"],

  "europay:settings": [
    "General Submenu",
    "Storage Submenu",
    "Limits Submenu",
    "Export Submenu",
    "Import Submenu",
  ],
  "europay:settings:general": ["View OTP"],

  "europay:settings:general:otp": ["Change"],

  "europay:settings:storage": ["Database Section", "Tables Section"],
  "europay:settings:storage:database": [
    "Clear Database",
    "Provision",
    "Clear Workdata",
    "Load Services",
    "Load Countries",
  ],
  "europay:settings:storage:tables": ["Select Tables", "Clear Tables"],

  "europay:settings:limits": ["Job Limits Section"],

  "europay:settings:limits:jobs": ["Task Limit", "Transaction Limit"],

  "europay:settings:export": [
    "Export To View",
    "Export To DB",
    "Copy To Clipboard",
  ],
  "europay:settings:import": ["Import IAM Section"],

  "europay:settings:import:iam": ["Import"],

  "europay:manual": ["View Chapters"],

  "europay:authorisation": ["Login", "Logout", "User Settings"],

  "europay:socialmedia": ["Execute"],

  "europay:iam": [
    "Services",
    "Statements",
    "Policies",
    "Roles",
    "Users",
    "Groups",
  ],

  "europay:iam:statements": ["Delete Managed"],
  "europay:iam:policies": ["Delete Managed"],
  "europay:iam:roles": ["Delete Managed"],
  "europay:iam:users": ["Delete Managed"],
  "europay:iam:groups": ["Delete Managed"],
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

export const managedusers: Record<string, string[]> = {};

export type managedGroupInfo = {
  description: string;
  roles: string[];
  policies: string[];
};

export const managedgroups: Record<string, managedGroupInfo> = {
  ADMINS: {
    description: "Admins group",
    roles: [],
    policies: [],
  },

  CLIENTS: {
    description: "Clients group",
    roles: [],
    policies: [],
  },
};
