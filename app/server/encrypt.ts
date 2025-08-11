"use server";

import crypto from "node:crypto";

const secretKey: string = process.env.NEXT_PUBLIC_SECRET_VALUE ?? "Europay2025";
const algorithm = "aes-256-cbc";

const key = crypto
  .createHash("sha512")
  .update(secretKey)
  .digest("hex")
  .substring(0, 32);
const iv = crypto.randomBytes(16);

export const encrypt = async (_data: string): Promise<string> => {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted: string = cipher.update(_data, "utf-8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + encrypted;
};

export const decrypt = async (_data: string): Promise<string> => {
  const inputIV: string = _data.slice(0, 32);
  const encrypted: string = _data.slice(32);
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key),
    Buffer.from(inputIV, "hex")
  );

  let decrypted: string = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
};
