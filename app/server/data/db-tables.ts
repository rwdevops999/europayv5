export const dbTables: Record<string, string> = {
  services: "Service",
  serviceactions: "ServiceAction",
};

export const linkedDbTables: Record<string, string[]> = {
  services: ["serviceactions"],
};
