export type tWebResponse = {
  message: string;
};

export type tWebPayment = {
  token: string;
  amount: number;
  sender: string;
  recipient: string;
  message: string;
};
