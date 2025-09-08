"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthCard from "@/components/forms/AuthCard";
import PasswordInput from "@/components/forms/PasswordInput";
import LoadingButton from "@/components/feedback/LoadingButton";

const signInSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const { signIn, error } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(values: SignInForm) {
    setLoading(true);
    await signIn(values);
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <AuthCard title="Sign In">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <PasswordInput {...register("password")} placeholder="••••••••" />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <LoadingButton type="submit" loading={loading} className="w-full">
            Sign In
          </LoadingButton>
        </form>
      </AuthCard>
    </div>
  );
}
