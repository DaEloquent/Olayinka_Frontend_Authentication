"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "./../../../lib/api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthCard from "@/components/forms/AuthCard";
import PasswordInput from "@/components/forms/PasswordInput";
import LoadingButton from "@/components/feedback/LoadingButton";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const SearchParams = useSearchParams();
  const router = useRouter();
  const token = SearchParams.get("token");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing reset token");
    }
  }, [token]);

  async function onSubmit(value: ResetPasswordForm) {
    if (!token) return;
    setStatus("loading");
    setMessage(null);
    try {
      await api.post("/(auth)/reset-password", {
        token,
        password: value.password,
      });
      setStatus("success");
      setMessage("Your password has been reset succcessfully.");
      setTimeout(() => router.push("/(auth)/sign-in"), 3000);
    } catch (e) {
      const err = e as { unifiedMessage?: string; message?: string };
      setStatus("error");
      setMessage(
        err?.unifiedMessage || err?.message || "Failed to reset password."
      );
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <AuthCard title="Reset Password">
        {status === "success" ? (
          <div className="text-green-600 text-center">
            <p>{message}</p>
            <p className="text-sm mt-2">Redirecting to Sign In...</p>
          </div>
        ) : !token ? (
          <p className="text-red-600 text-center">{message}</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">New Password</label>
              <PasswordInput {...register("password")} placeholder="••••••••" />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
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
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {status === "error" && message && (
              <p className="text-red-500 text-sm">{message}</p>
            )}

            <LoadingButton
              type="submit"
              loading={status === "loading"}
              className="w-full"
            >
              Reset Password
            </LoadingButton>
          </form>
        )}
      </AuthCard>
    </div>
  );
}
