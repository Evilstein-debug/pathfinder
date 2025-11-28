import * as z from "zod";
import validator from "email-validator";
import disposableDomains from "disposable-email-domains" with { type: "json" };

// Normalize disposable domains list for case-insensitive checking
const disposableSet = new Set(disposableDomains.map((d) => d.toLowerCase()));

export const emailValidator = z
  .string()
  .min(1, { message: "Email is required" })
  .trim()
  .pipe(
    z.email({ message: "Invalid email format" })
  )
  .refine((email) => validator.validate(email), {
    message: "Email is not valid",
  })
  .refine((email) => {
    const domain = email.split("@")[1]?.toLowerCase();
    return domain && !disposableSet.has(domain);
  }, {
    message: "Disposable email addresses are not allowed",
  })
  .refine((email) => {
    const domain = email.split("@")[1]?.toLowerCase();
    const commonTypos = {
      "gmial.com": "gmail.com",
      "gmai.com": "gmail.com",
      "gmil.com": "gmail.com",
      "yahou.com": "yahoo.com",
      "yaho.com": "yahoo.com",
      "hotmial.com": "hotmail.com",
      "hotmal.com": "hotmail.com",
      "outlok.com": "outlook.com",
    };
    return !(domain in commonTypos);
  }, {
    message: "Email domain appears to be misspelled.",
  });

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(30, { message: "Username must be less than 30 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message:
          "Username can only contain letters, numbers, and underscores",
      })
      .trim(),

    email: emailValidator,

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(100, { message: "Password must be less than 100 characters" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number",
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character",
      }),
  })
  .strict();

export const loginSchema = z
  .object({
    email: emailValidator,
    password: z.string().min(1, { message: "Password is required" }),
  })
  .strict();

export const oauthSchema = z
  .object({
    email: emailValidator,
    username: z.string().optional(), // OAuth providers usually don't supply a username
    provider: z.enum(["google", "github"], {
      errorMap: () => ({ message: "Invalid OAuth provider" }),
    }),
  })
  .strict();

export const refreshTokenSchema = z
  .object({
    refreshToken: z.string().min(1, { message: "Refresh token is required" }),
  })
  .strict();
