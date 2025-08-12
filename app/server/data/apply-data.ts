import { Gender } from "@/generated/prisma";

export type ApplyData = {
  username?: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  gender?: Gender;
  country?: string;
};
