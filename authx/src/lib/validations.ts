import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Add at least one uppercase letter")
  .regex(/[a-z]/, "Add at least one lowercase letter")
  .regex(/[0-9]/, "Add at least one number");

export const signUpSChema = z
  .object({
    username: z.string().min(3, "Username is too short"),
    email: z.email("Enter a valid email"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

export const signInSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email"),
});
export const resetSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });
