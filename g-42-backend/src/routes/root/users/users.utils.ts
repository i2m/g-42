import bcrypt from "bcrypt";

export async function hash(
  value: string,
  salt: number | string,
): Promise<string> {
  return await bcrypt.hash(value, salt);
}

export async function compareHash(a: string, b: string): Promise<boolean> {
  return await bcrypt.compare(a, b);
}
