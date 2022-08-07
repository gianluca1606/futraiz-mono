import z from "zod";

const regexPassword =
  "/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/";
// TODO Regex für vernünftige Passwörter
// .regex(new RegExp(regexPassword)
export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
});

export const createUserOutputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});
export type CreateUserInput = z.TypeOf<typeof createUserSchema>;

export const requestOtpSchema = z.object({
  email: z.string().email(),
  redirect: z.string().default("/"),
});

export type requestOtpinput = z.TypeOf<typeof requestOtpSchema>;

export const verifyOptSchema = z.object({
  hash: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const googleSchema = z.object({
  token: z.string(),
});
