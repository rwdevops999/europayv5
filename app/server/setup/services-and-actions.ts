export type dbResult = {
  services: number;
  countries: number;
};

// The first is the service and the array contains all actions on that service
export const servicesandactions: Record<string, string[]> = {
  Europay: ["View Social Media", "Dashboard Menu", "IAM Menu", "Auth"],
  SocialMedia: ["execute"],
  Dashboard: [
    "Show Environment",
    "Show Version",
    "Show Wifi",
    "Show Country Info",
  ],
  DashboardCountryInfo: ["change"],
  IAM: [
    "Show Services",
    "Show Statements",
    "Show Policies",
    "Show Roles",
    "Show Users",
    "Show Groups",
  ],
  Auth: ["login", "logout"],
};

// Under here we set all service statements
export type ServiceStatementInfo = {
  service: string;
  action: string;
};

// service statement names will be prefixed bu Allow of Deny
export const servicestatements: Record<string, ServiceStatementInfo> = {
  EuropayViewSocialMedia: { service: "Europay", action: "View Social Media" },
  EuropayUseDashboard: { service: "Europay", action: "Dashboard Menu" },
  EuropayUseIAM: { service: "Europay", action: "IAM Menu" },
  EuropayAuthorization: { service: "Europay", action: "Auth" },

  DashboardViewEnvironment: {
    service: "Dashboard",
    action: "Show Environement",
  },
  DashboardViewVersion: { service: "Dashboard", action: "Show Version" },
  DashboardViewWifi: { service: "Dashboard", action: "Show Wifi" },
  DashboardViewCountryInfo: {
    service: "Dashboard",
    action: "Show Country Info",
  },

  DashboardCountryInfoChange: {
    service: "DashboardCountryInfo",
    action: "change",
  },

  ExecuteSocialMedia: { service: "SocialMedia", action: "execute" },

  AccessIAMServices: { service: "IAM", action: "Show Services" },
  AccessIAMStatements: { service: "IAM", action: "Show Statements" },
  AccessIAMPolicies: { service: "IAM", action: "Show Policies" },
  AccessIAMRoles: { service: "IAM", action: "Show Roles" },
  AccessIAMUsers: { service: "IAM", action: "Show Users" },
  AccessIAMGroups: { service: "IAM", action: "Show Groups" },

  AuthLogin: { service: "Auth", action: "login" },
  AuthLogout: { service: "Auth", action: "logout" },
};

export const policies: Record<string, string[]> = {
  DefaultEuropayPolicy: [
    "AllowEuropayUseDashboard",
    "AllowEuropayAuthorization",
    "DenyEuropayUserIAM",
  ],
  DefaultSocialMediaPolicy: [
    "AllowEuropayViewSocialMedia",
    "DenyExecuteSocialMedia",
  ],
  DefaultDashboardPolicy: [
    "AllowDashboardViewEnvironment",
    "AllowDashboardViewVersion",
    "AllowDashboardViewWifi",
    "AllowDashboardViewCountryInfo",
    "AllowDashboardCountryInfoChange",
  ],
  DefaultAuthPolicy: ["AllowAuthLogin", "AllowAuthLogout"],
};
