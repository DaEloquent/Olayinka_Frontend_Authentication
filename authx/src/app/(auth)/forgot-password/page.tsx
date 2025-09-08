"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthCard from "@/components/forms/AuthCard";
import LoadingButton from "@/components/feedback/LoadingButton";

const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordForm) {
    setStatus("loading");
    setMessage(null);
    try {
      await api.post("/(auth)/forgot-password", values);
      setStatus("success");
      setMessage("Password reset link has been sent to your email.");
    } catch (e) {
      const err = e as { unifiedMessage?: string; message?: string };
      setStatus("error");
      setMessage(
        err?.unifiedMessage || err?.message || "Failed to send reset link."
      );
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <AuthCard title="Forgot Password">
        {status === "success" ? (
          <p className="text-green-600">{message}</p>
        ) : (
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

            {status === "error" && message && (
              <p className="text-red-500 text-sm">{message}</p>
            )}
            <LoadingButton
              type="submit"
              loading={status === "loading"}
              className="w-full"
            >
              Send Reset Link
            </LoadingButton>
          </form>
        )}
      </AuthCard>
    </div>
  );
}
