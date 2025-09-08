export type dbResult = {
  services: number;
  countries: number;
};

// The first is the service and the array contains all actions on that service
export const servicesandactions: Record<string, string[]> = {
  europay: [
    "Goto Home",
    "View Dashboard",
    "View Lists",
    "View Settings",
    "View IAM",
    "View Manual",
    "Access Auth",
    "View Social Media",
    "View User",
    "View Admin",
    "Apply",
  ],

  "europay:dashboard": [
    "Show Environment",
    "Show Version",
    "Show Wifi",
    "Show Country",
  ],
  "europay:dashboard:country": ["Change"],

  "europay:lists": ["Show Tasks", "Show Jobs", "Show History"],

  "europay:lists:tasks": ["Handle"],
  "europay:lists:jobs": ["Suspend", "Restart", "Remove"],

  "europay:settings": [
    "Show General",
    "Show Storage",
    "Show Limits",
    "Show Export",
    "Show Import",
  ],
  "europay:settings:general": [
    "View Toast",
    "View History",
    "View OTP",
    "View Markdown",
  ],
  "europay:settings:general:toast": ["Change"],
  "europay:settings:general:history": ["Change"],
  "europay:settings:general:otp": ["Change"],
  "europay:settings:general:markdown": ["Change"],

  "europay:settings:storage": ["View Database", "View Selective"],
  "europay:settings:storage:database": [
    "Clear Full",
    "Provision Countries",
    "Clear Work",
    "Load Services",
    "Load Countries",
  ],
  "europay:settings:storage:selective": ["Select", "Clear"],

  "europay:settings:limits": ["Show Job Limits"],
  "europay:settings:limits:jobs": ["Task", "Transaction"],

  "europay:settings:export": [
    "Export To View",
    "Export To DB",
    "Copy To Clipboard",
  ],
  "europay:settings:import": ["Show IAM"],

  "europay:settings:import:iam": ["Import"],

  "europay:manual": ["Show Chapters"],

  "europay:authorisation": ["Login", "Logout", "Settings"],

  "europay:socialmedia": ["Execute"],

  "europay:iam": [
    "Show Services",
    "Show Statements",
    "Handle Policies",
    "Handle Roles",
    "Handle Users",
    "Handle Groups",
  ],

  "europay:iam:statements": ["Delete Managed"],
  "europay:iam:policies": ["Delete Managed"],
  "europay:iam::roles": ["Delete Managed"],
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
