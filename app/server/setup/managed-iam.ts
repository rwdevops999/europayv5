export const AllowedSystemServiceStatements: Record<string, any> = {
  DeleteManagedGroup: {
    description: "Delete managed groups",
    service: "europay:iam:groups",
    actions: ["Delete Managed"],
  },
  DeleteManagedUser: {
    description: "Delete managed users",
    service: "europay:iam:users",
    actions: ["Delete Managed"],
  },
  DeleteManagedRole: {
    description: "Delete managed roles",
    service: "europay:iam:roles",
    actions: ["Delete Managed"],
  },
  DeleteManagedPolicy: {
    description: "Delete managed policies",
    service: "europay:iam:policies",
    actions: ["Delete Managed"],
  },
  DeleteManagedStatement: {
    description: "Delete managed statements",
    service: "europay:iam:statements",
    actions: ["Delete Managed"],
  },
  ShowIAMEntities: {
    description: "Show IAM item",
    service: "europay:iam",
    actions: [
      "Handle Groups",
      "Handle Users",
      "Handle Roles",
      "Handle Policies",
      "Handle Statements",
    ],
  },
  ShowIAMServices: {
    description: "Show services submenu",
    service: "europay:iam",
    actions: ["Show Services"],
  },
  ExecuteSocialMedia: {
    description: "Execute social media item",
    service: "europay:socialmedia",
    actions: ["Execute"],
  },
  Authorisation: {
    description: "Login and logout",
    service: "europay:authorisation",
    actions: ["Login", "Logout"],
  },
  AuthorisationSetting: {
    description: "User settings",
    service: "europay:authorisation",
    actions: ["Settings"],
  },
  ManualShowChapters: {
    description: "View chapters",
    service: "europay:manual",
    actions: ["Show Chapters"],
  },
  ImportIAM: {
    description: "Import IAM data",
    service: "europay:settings:import:iam",
    actions: ["Import"],
  },
  ImportShowIAM: {
    description: "View IAM import",
    service: "europay:settings:import",
    actions: ["Show IAM"],
  },
  ExportData: {
    description: "Export data",
    service: "europay:settings:export",
    actions: ["Export To View", "Export To DB", "Copy To Clipboard"],
  },
  ChangeJobLimits: {
    description: "Change job limits",
    service: "europay:settings:limits:jobs",
    actions: ["Transaction", "Task"],
  },
  LimitsShowJobs: {
    description: "Show job limit section",
    service: "europay:settings:limits",
    actions: ["Transaction", "Show Job Limits"],
  },
  ClearSelectedTables: {
    description: "Clear entities",
    service: "europay:settings:storage:selective",
    actions: ["Clear"],
  },
  SelectTables: {
    description: "Select entities",
    service: "europay:settings:storage:selective",
    actions: ["Select"],
  },
  LoadDependencies: {
    description: "Select services and countries",
    service: "europay:settings:storage:database",
    actions: ["Load Services", "Load Countries"],
  },
  ClearWorkingTables: {
    description: "Clear working tables",
    service: "europay:settings:storage:database",
    actions: ["Clear Work"],
  },
  ProvisionCountries: {
    description: "Provision countries after clear",
    service: "europay:settings:storage:database",
    actions: ["Provision Countries"],
  },
  ClearAllTables: {
    description: "Clear all tables",
    service: "europay:settings:storage:database",
    actions: ["Clear Full"],
  },
  StorageShowSelective: {
    description: "View selective section",
    service: "europay:settings:storage",
    actions: ["View Selective"],
  },
  StorageShowDatabase: {
    description: "View database section",
    service: "europay:settings:storage",
    actions: ["View Database"],
  },
  ChangeMarkdownSettings: {
    description: "Change markdown settings",
    service: "europay:settings:general:markdown",
    actions: ["Change"],
  },
  ChangeOTPSettings: {
    description: "Change OTP settings",
    service: "europay:settings:general:otp",
    actions: ["Change"],
  },
  ChangeHistorySettings: {
    description: "Change history settings",
    service: "europay:settings:general:history",
    actions: ["Change"],
  },
  ChangeToastSettings: {
    description: "Change toast settings",
    service: "europay:settings:general:toast",
    actions: ["Change"],
  },
  GeneralShowToast: {
    description: "View toast section",
    service: "europay:settings:general",
    actions: ["View Toast"],
  },
  GeneralShowMarkdown: {
    description: "View markdown section",
    service: "europay:settings:general",
    actions: ["View Markdown"],
  },
  GeneralShowOTP: {
    description: "View OTP section",
    service: "europay:settings:general",
    actions: ["View OTP"],
  },
  GeneralShowHistory: {
    description: "View history section",
    service: "europay:settings:general",
    actions: ["View History"],
  },
  ShowSettingsImportMenu: {
    description: "Show import submenu",
    service: "europay:settings",
    actions: ["Show Import"],
  },
  ShowSettingsExportMenu: {
    description: "Show export submenu",
    service: "europay:settings",
    actions: ["Show Export"],
  },
  ShowSettingsLimitsMenu: {
    description: "Show limits submenu",
    service: "europay:settings",
    actions: ["Show Limits"],
  },
  ShowSettingsStorageMenu: {
    description: "Show storage submenu",
    service: "europay:settings",
    actions: ["Show Storage"],
  },
  ShowSettingsGeneralMenu: {
    description: "Show general submenu",
    service: "europay:settings",
    actions: ["Show General"],
  },
  RemoveJobs: {
    description: "Remove jobs",
    service: "europay:lists:jobs",
    actions: ["Remove"],
  },
  RestartJobs: {
    description: "Restart jobs",
    service: "europay:lists:jobs",
    actions: ["Restart"],
  },
  SuspendJobs: {
    description: "Suspend jobs",
    service: "europay:lists:jobs",
    actions: ["Suspend"],
  },
  HandleTasks: {
    description: "Handle tasks",
    service: "europay:lists:tasks",
    actions: ["Handle"],
  },
  ShowListsHistoryMenu: {
    description: "Show history submenu",
    service: "europay:lists",
    actions: ["Show History"],
  },
  ShowListsJobsMenu: {
    description: "Show jobs submenu",
    service: "europay:lists",
    actions: ["Show Jobs"],
  },
  ShowListsTasksMenu: {
    description: "Show tasks submenu",
    service: "europay:lists",
    actions: ["Show Tasks"],
  },
  DashboardCountryChange: {
    description: "Change country",
    service: "europay:dashboard:country",
    actions: ["Change"],
  },
  DashboardShowCountry: {
    description: "Show country section",
    service: "europay:dashboard",
    actions: ["Show Country"],
  },
  DashboardShowWifi: {
    description: "Show wifi section",
    service: "europay:dashboard",
    actions: ["Show Wifi"],
  },
  DashboardShowVersion: {
    description: "Show version section",
    service: "europay:dashboard",
    actions: ["Show Version"],
  },
  DashboardShowEnvironment: {
    description: "Show environment section",
    service: "europay:dashboard",
    actions: ["Show Environment"],
  },
  AllowApply: {
    description: "ApplyForAnAccount",
    service: "europay",
    actions: ["Apply"],
  },
  ShowAdminMenu: {
    description: "Show admin menu",
    service: "europay",
    actions: ["View Admin"],
  },
  ShowUserMenu: {
    description: "Show user menu",
    service: "europay",
    actions: ["View User"],
  },
  ShowSocialMedia: {
    description: "Show social media icons",
    service: "europay",
    actions: ["View Social Media"],
  },
  AccessAuthAllowed: {
    description: "Access authorisation",
    service: "europay",
    actions: ["Access Auth"],
  },
  ShowManualMenu: {
    description: "Show manual menu",
    service: "europay",
    actions: ["View Manual"],
  },
  ShowIAMMenu: {
    description: "Show IAM menu",
    service: "europay",
    actions: ["View IAM"],
  },
  ShowSettingsMenu: {
    description: "Show settings menu",
    service: "europay",
    actions: ["View Settings"],
  },
  ShowListsMenu: {
    description: "Show lists menu",
    service: "europay",
    actions: ["View Lists"],
  },
  ShowDashboardMenu: {
    description: "Show dashboard menu",
    service: "europay",
    actions: ["View Dashboard"],
  },
  GotoHome: {
    description: "Enable home visit",
    service: "europay",
    actions: ["Goto Home"],
  },
};

export const SystemPolicies: Record<string, any> = {
  GroupDeletePolicy: {
    description: "Delete managed groups",
    statement: ["DeleteManagedGroup"],
  },
  UserDeletePolicy: {
    description: "Delete managed users",
    statement: ["DeleteManagedUser"],
  },
  RoleDeletePolicy: {
    description: "Delete managed roles",
    statement: ["DeleteManagedRole"],
  },
  PolicyDeletePolicy: {
    description: "Delete managed policies",
    statement: ["DeleteManagedPolicy"],
  },
  StatementDeletePolicy: {
    description: "Delete managed statement",
    statement: ["DeleteManagedStatement"],
  },
  IAMPolicy: { description: "Policy for IAM", statement: ["ShowIAMEntities"] },
  IAMDefaultPolicy: {
    description: "Default iam view",
    statement: ["ShowIAMServices"],
  },
  SocialMediaPolicy: {
    description: "Social Media",
    statement: ["ExecuteSocialMedia"],
  },
  AuthPolicy: { description: "Authorisation", statement: ["Authorisation"] },
  AuthSettingsPolicy: {
    description: "User settings",
    statement: ["AuthorisationSetting"],
  },
  ManualPolicy: {
    description: "Manual page chapters",
    statement: ["ManualShowChapters"],
  },
  IAMImportPolicy: { description: "Import IAM", statement: ["ImportIAM"] },
  ImportPolicy: { description: "Import", statement: ["ImportShowIAM"] },
  ExportPolicy: { description: "Export", statement: ["ExportData"] },
  JobLimitsPolicy: {
    description: "Job limits",
    statement: ["ChangeJobLimits"],
  },
  LimitsPolicy: {
    description: "Limits settings",
    statement: ["LimitsShowJobs"],
  },
  SelectivePolicy: {
    description: "Selective tables",
    statement: ["SelectTables", "ClearSelectedTables"],
  },
  DatabasePolicy: {
    description: "Database",
    statement: [
      "ClearAllTables",
      "ProvisionCountries",
      "ClearWorkingTables",
      "LoadDependencies",
    ],
  },
  StoragePolicy: {
    description: "Storage",
    statement: ["StorageShowDatabase", "StorageShowSelective"],
  },
  MarkdownSettingsPolicy: {
    description: "Markdown settings",
    statement: ["ChangeMarkdownSettings"],
  },
  OTPSettingsPolicy: {
    description: "OTP settings",
    statement: ["ChangeOTPSettings"],
  },
  HistorySettingsPolicy: {
    description: "History settings",
    statement: ["ChangeHistorySettings"],
  },
  ToastSettingsPolicy: {
    description: "Toast settings",
    statement: ["ChangeToastSettings"],
  },
  GeneralPolicy: {
    description: "General settings",
    statement: [
      "GeneralShowHistory",
      "GeneralShowOTP",
      "GeneralShowToast",
      "GeneralShowMarkdown",
    ],
  },
  SettingsPolicy: {
    description: "Settings",
    statement: [
      "ShowSettingsGeneralMenu",
      "ShowSettingsStorageMenu",
      "ShowSettingsLimitsMenu",
      "ShowSettingsExportMenu",
      "ShowSettingsImportMenu",
    ],
  },
  JobsPolicy: {
    description: "Jobs",
    statement: ["SuspendJobs", "RestartJobs", "RemoveJobs"],
  },
  TasksPolicy: { description: "Tasks", statement: ["HandleTasks"] },
  HistoryViewPolicy: {
    description: "History view",
    statement: ["ShowListsHistoryMenu"],
  },
  JobsViewPolicy: {
    description: "Jobs view",
    statement: ["ShowListsJobsMenu"],
  },
  TasksViewPolicy: {
    description: "Tasks view",
    statement: ["ShowListsTasksMenu"],
  },
  DashboardCountryPolicy: {
    description: "Dashboard country",
    statement: ["DashboardCountryChange"],
  },
  DashboardPolicy: {
    description: "Dashboard",
    statement: [
      "DashboardShowEnvironment",
      "DashboardShowVersion",
      "DashboardShowWifi",
      "DashboardShowCountry",
    ],
  },
  AdminDefaultPolicy: {
    description: "Default admin",
    statement: ["ShowAdminMenu"],
  },
  ClientDefaultPolicy: {
    description: "Default client",
    statement: ["ShowSocialMedia", "ShowUserMenu"],
  },
  DefaultPolicy: {
    description: "Default",
    statement: ["ShowManualMenu", "AccessAuthAllowed", "AllowApply"],
  },
  IAMViewPolicy: { description: "IAM view", statement: ["ShowIAMMenu"] },
  SettingsViewPolicy: {
    description: "Settings view",
    statement: ["ShowSettingsMenu"],
  },
  DefaultViewPolicy: {
    description: "Default views",
    statement: ["GotoHome", "ShowDashboardMenu", "ShowListsMenu"],
  },
};

export const SystemRoles: Record<string, any> = {
  IamAdminRole: {
    description: "IAM admin",
    policy: [
      "IAMPolicy",
      "StatementDeletePolicy",
      "PolicyDeletePolicy",
      "RoleDeletePolicy",
      "UserDeletePolicy",
      "GroupDeletePolicy",
    ],
  },
  AdminRole: { description: "Admin", policy: ["AdminDefaultPolicy"] },
  ClientRole: {
    description: "Client",
    policy: ["ClientDefaultPolicy", "SocialMediaPolicy", "AuthSettingsPolicy"],
  },
  SettingsAdminRole: {
    description: "Settings admin",
    policy: [
      "SettingsViewPolicy",
      "SettingsPolicy",
      "GeneralPolicy",
      "ToastSettingsPolicy",
      "HistorySettingsPolicy",
      "OTPSettingsPolicy",
      "MarkdownSettingsPolicy",
      "DatabasePolicy",
      "SelectivePolicy",
      "LimitsPolicy",
      "JobLimitsPolicy",
      "ExportPolicy",
      "ImportPolicy",
      "IAMImportPolicy",
      "StoragePolicy",
    ],
  },

  JobAdminRole: {
    description: "Job admin",
    policy: ["JobsViewPolicy", "JobsPolicy"],
  },
  TaskAdminRole: {
    description: "Task admin",
    policy: ["TasksViewPolicy", "TasksPolicy"],
  },
  DefaultRole: {
    description: "Default",
    policy: [
      "DefaultViewPolicy",
      "IAMViewPolicy",
      "DefaultPolicy",
      "DashboardPolicy",
      "DashboardCountryPolicy",
      "HistoryViewPolicy",
      "ManualPolicy",
      "IAMDefaultPolicy",
      "AuthPolicy",
    ],
  },
};

// the string in the record will be used for username
export const SystemUsers: Record<string, any> = {
  BBB1: {
    lastname: "Bbb1",
    firstname: "bbb1",
    email: "rwdevops999@gmail.com",
    password: "27X11x49@",
    passwordless: false,
    type: "EUROPAY",
    country: "Belgium",
  },
  AAA1: {
    lastname: "Aaa1",
    firstname: "aaa1",
    email: "rudi.welter@gmail.com",
    password: "27X11x49@",
    passwordless: false,
    type: "EUROPAY",
    country: "Belgium",
  },
};

export const SystemGroups: Record<string, any> = {
  CLIENTS: {
    decription: "Clients",
    roles: ["ClientRole"],
    users: [
      { lastname: "Bbb1", firstname: "bbb1" },
      { lastname: "Aaa1", firstname: "aaa1" },
    ],
  },
  DEFAULT: {
    decription: "Default",
    roles: ["DefaultRole"],
    users: [
      { lastname: "Bbb1", firstname: "bbb1" },
      { lastname: "Aaa1", firstname: "aaa1" },
    ],
  },
  ADMINS: {
    decription: "Admins",
    roles: [
      "TaskAdminRole",
      "JobAdminRole",
      "SettingsAdminRole",
      "AdminRole",
      "IamAdminRole",
    ],
    users: [
      { lastname: "Bbb1", firstname: "bbb1" },
      { lastname: "Aaa1", firstname: "aaa1" },
    ],
  },
};
