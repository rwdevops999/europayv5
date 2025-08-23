# Application Settings IAM

ALL (no user)

- DefaultRole

CLIENT

- SocialMediaFullRole
- UserPageRole

ADMIN

- AdminPageRole
- TaskAdminRole
- JobAdminRole
- SettingsAdminRole
- IAMAdminRole

User for ADMIN also add it to CLIENT and ALL
User for CLIENT also add it to ALL

# Roles

DefaultRole

- GotoHomePolicy
- ViewDashboardPolicy
- ListDefaultPolicy
  - View History
- ViewManualPolicy
- DefaultAuthPolicy
  - Handle Auth
  - Login
  - Logout
  - Apply

UserPageRole

- ViewUserMenuPolicy

AdminPageRole

- ViewAdminMenuPolicy

TaskAdminRole

- ViewTaskMenuPolicy
- HandleTaskPolicy

JobAdminRole

- ViewJobMenuPolicy
- DefaultJobActionsPolicy
  - Suspend Job
  - Delete Job
  - Restart Job

SettingsAdminRole

- ViewGeneralPolicy

- ViewStoragePolicy
- HandleDefaultStoragePolicy

- ViewLimitsPolicy
- HandleDefaultLimitsPolicy

- ViewExportPolicy
- HandleDefaultExportPolicy

- ViewImportPolicy
- HandleDefaultImportPolicy

SocialMediaFullRole

- ViewSocialMediaPolicy
- ExecuteSocialMediaPolicy

IAMAdminRole

- ViewStatementsPolicy

  - Handle Statement (Create/Delete/Update)
  - Delete Managed Statement

- ViewPoliciesPolicy

  - Handle Policy
  - Delete Managed Policy

- ViewRolesPolicy

  - Handle Role
  - Delete Managed Role

- ViewUsersPolicy

  - Handle User
  - Delete Managed User

- ViewGroupsPolicy
  - Handle Group
  - Delete Managed Group
