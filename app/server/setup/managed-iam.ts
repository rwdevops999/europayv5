export const AllowedSystemServiceStatements: Record<string, any> = {
  DeleteManagedGroup: {
    description: "IAM delete managed group",
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
    actions: ["Groups", "Users", "Roles", "Policies", "Statements"],
  },
  ShowIAMServices: {
    description: "Show services submenu",
    service: "europay:iam",
    actions: ["Services"],
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
    actions: ["User Settings"],
  },
  ManualShowChapters: {
    description: "View chapters",
    service: "europay:manual",
    actions: ["View Chapters"],
  },
  ImportIAM: {
    description: "Import IAM data",
    service: "europay:settings:import:iam",
    actions: ["Import"],
  },
  ImportShowIAM: {
    description: "View IAM import",
    service: "europay:settings:import",
    actions: ["Import IAM Section"],
  },
  ExportData: {
    description: "Export data",
    service: "europay:settings:export",
    actions: ["Export To View", "Export To DB", "Copy To Clipboard"],
  },
  ChangeJobLimits: {
    description: "Change job limits",
    service: "europay:settings:limits:jobs",
    actions: ["Transaction Limit", "Task Limit"],
  },
  LimitsShowJobs: {
    description: "Show job limit section",
    service: "europay:settings:limits",
    actions: ["Job Limits Section"],
  },
  ClearSelectedTables: {
    description: "Clear entities",
    service: "europay:settings:storage:tables",
    actions: ["Clear Tables"],
  },
  SelectTables: {
    description: "Select entities",
    service: "europay:settings:storage:tables",
    actions: ["Select Tables"],
  },
  LoadDependencies: {
    description: "Select services and countries",
    service: "europay:settings:storage:database",
    actions: ["Load Services", "Load Countries"],
  },
  ClearWorkingTables: {
    description: "Clear working tables",
    service: "europay:settings:storage:database",
    actions: ["Clear Workdata"],
  },
  ProvisionCountries: {
    description: "Provision countries after clear",
    service: "europay:settings:storage:database",
    actions: ["Provision Countries"],
  },
  ClearAllTables: {
    description: "Clear all tables",
    service: "europay:settings:storage:database",
    actions: ["Clear Database"],
  },
  StorageShowTables: {
    description: "View selective section",
    service: "europay:settings:storage",
    actions: ["Tables Section"],
  },
  StorageShowDatabase: {
    description: "View database section",
    service: "europay:settings:storage",
    actions: ["Database Section"],
  },
  ChangeOTPSettings: {
    description: "Change OTP settings",
    service: "europay:settings:general:otp",
    actions: ["Change"],
  },
  GeneralShowOTP: {
    description: "View OTP section",
    service: "europay:settings:general",
    actions: ["View OTP"],
  },
  ShowSettingsImportMenu: {
    description: "Show import submenu",
    service: "europay:settings",
    actions: ["Import Submenu"],
  },
  ShowSettingsExportMenu: {
    description: "Show export submenu",
    service: "europay:settings",
    actions: ["Export Submenu"],
  },
  ShowSettingsLimitsMenu: {
    description: "Show limits submenu",
    service: "europay:settings",
    actions: ["Limits Submenu"],
  },
  ShowSettingsStorageMenu: {
    description: "Show storage submenu",
    service: "europay:settings",
    actions: ["Storage Submenu"],
  },
  ShowSettingsGeneralMenu: {
    description: "Show general submenu",
    service: "europay:settings",
    actions: ["General Submenu"],
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
    actions: ["History Submenu"],
  },
  ShowListsJobsMenu: {
    description: "Show jobs submenu",
    service: "europay:lists",
    actions: ["Jobs Submenu"],
  },
  ShowListsTasksMenu: {
    description: "Show tasks submenu",
    service: "europay:lists",
    actions: ["Tasks Submenu"],
  },
  ShowListsTransactionsMenu: {
    description: "Show transactions submenu",
    service: "europay:lists",
    actions: ["Transactions Submenu"],
  },
  ShowListsExportMenu: {
    description: "Show export submenu",
    service: "europay:lists",
    actions: ["Export Submenu"],
  },
  DashboardCountryChange: {
    description: "Change country",
    service: "europay:dashboard:country",
    actions: ["Change"],
  },
  DashboardShowCountry: {
    description: "Show country section",
    service: "europay:dashboard",
    actions: ["Country"],
  },
  DashboardShowWifi: {
    description: "Show wifi section",
    service: "europay:dashboard",
    actions: ["Wifi"],
  },
  DashboardShowVersion: {
    description: "Show version section",
    service: "europay:dashboard",
    actions: ["Version"],
  },
  DashboardShowEnvironment: {
    description: "Show environment section",
    service: "europay:dashboard",
    actions: ["Environment"],
  },
  AllowApply: {
    description: "ApplyForAnAccount",
    service: "europay",
    actions: ["Apply"],
  },
  ShowAdminMenu: {
    description: "Show admin menu",
    service: "europay",
    actions: ["Admin Menu"],
  },
  ShowUserMenu: {
    description: "Show user menu",
    service: "europay",
    actions: ["User Menu"],
  },
  ShowSocialMedia: {
    description: "Show social media icons",
    service: "europay",
    actions: ["Social Media"],
  },
  AccessAuthAllowed: {
    description: "Access authorisation",
    service: "europay",
    actions: ["Access Auth"],
  },
  ShowManualMenu: {
    description: "Show manual menu",
    service: "europay",
    actions: ["Manual Menu"],
  },
  ShowIAMMenu: {
    description: "Show IAM menu",
    service: "europay",
    actions: ["IAM Menu"],
  },
  ShowSettingsMenu: {
    description: "Show settings menu",
    service: "europay",
    actions: ["Settings Menu"],
  },
  ShowListsMenu: {
    description: "Show lists menu",
    service: "europay",
    actions: ["Lists Menu"],
  },
  ShowDashboardMenu: {
    description: "Show dashboard menu",
    service: "europay",
    actions: ["Dashboard Menu"],
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
  TablesPolicy: {
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
    statement: ["StorageShowDatabase", "StorageShowTables"],
  },
  OTPSettingsPolicy: {
    description: "OTP settings",
    statement: ["ChangeOTPSettings"],
  },
  GeneralPolicy: {
    description: "General settings",
    statement: ["GeneralShowOTP"],
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
      "OTPSettingsPolicy",
      "DatabasePolicy",
      "TablesPolicy",
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
  rwdevops999: {
    lastname: "DevOps",
    firstname: "Rudi",
    email: "rwdevops999@gmail.com",
    password: "27X11x49@",
    passwordless: false,
    type: "EUROPAY",
    country: "Belgium",
    addAccount: true,
    accountAmount: 2000,
  },
  rwelter: {
    lastname: "Welter",
    firstname: "Rudi",
    email: "rudi.welter@gmail.com",
    password: "27X11x49@",
    passwordless: false,
    avatar: "rudi.welter.jpg",
    type: "EUROPAY",
    country: "Belgium",
    addAccount: true,
    accountAmount: 5000,
  },
  test: {
    lastname: "Test",
    firstname: "test",
    email: "steve.counaert@gmail.com",
    passwordless: true,
    type: "GUEST",
    country: "Belgium",
  },
};

export const SystemGroups: Record<string, any> = {
  CLIENTS: {
    decription: "Clients",
    roles: ["ClientRole"],
    users: [
      { lastname: "Welter", firstname: "Rudi" },
      { lastname: "DevOps", firstname: "Rudi" },
    ],
  },
  DEFAULT: {
    decription: "Default",
    roles: ["DefaultRole"],
    users: [
      { lastname: "Welter", firstname: "Rudi" },
      { lastname: "DevOps", firstname: "Rudi" },
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
    users: [{ lastname: "Welter", firstname: "Rudi" }],
  },
};
