export type ActionRoute = {
  action: string;
  service: string;
  path: string[];
};

export type ValidationConflict = {
  id: number;
  action: string;
  service: string;
  allowedPath: string;
  deniedPath: string;
};
