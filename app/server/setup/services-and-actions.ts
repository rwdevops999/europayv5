export type dbResult = {
  services: number;
  countries: number;
};

// The first is the service and the array contains all actions on that service
export const servicesandactions: Record<string, string[]> = {
  Email: ["Send"],
  Tasks: ["Create", "Execute"],
  Pages: ["Show"],
};
