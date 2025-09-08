"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthCard from "@/components/forms/AuthCard";
import PasswordInput from "@/components/forms/PasswordInput";
import LoadingButton from "@/components/feedback/LoadingButton";

const signUpSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const { signUp, error } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(values: SignUpForm) {
    setLoading(true);
    await signUp({
      username: values.username,
      email: values.email,
      password: values.password,
    });
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <AuthCard title="Create an Account">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              {...register("username")}
              className="w-full p-2 border rounded"
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border rounded"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Confirm Password
            </label>
            <PasswordInput
              {...register("confirmPassword")}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <LoadingButton type="submit" loading={loading} className="w-full">
            Sign Up
          </LoadingButton>
        </form>
      </AuthCard>
    </div>
  );
}
