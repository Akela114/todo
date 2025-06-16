import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export const generateSalt = () => {
  return randomBytes(16).toString("hex");
};

export const getHash = async (password: string, salt: string) => {
  const hash = (await scryptAsync(password, salt, 32)) as Buffer;

  return hash.toString("hex");
};
