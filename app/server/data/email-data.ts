export type tEmailData = {
  userId: number | null;
  clientId: number | null;
};

export type tEmail = {
  destination: string | undefined;
  cc?: string | undefined;
  template: string;
  params: Record<string, string>;
  attemps?: number;
  data?: tEmailData;
  asHTML?: boolean;
  content?: string;
};
