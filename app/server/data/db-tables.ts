export const dbTables: Record<string, string> = {
  services: "Service",
  serviceactions: "ServiceAction",
  countries: "Country",
};

export const linkedDbTables: Record<string, string[]> = {
  services: ["serviceactions"],
};
