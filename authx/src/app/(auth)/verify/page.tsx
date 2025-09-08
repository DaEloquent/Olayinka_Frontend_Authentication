"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import Spinner from "@/components/feedback/Spinner";
import AuthCard from "@/components/forms/AuthCard";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    async function verify() {
      try {
        await api.post("/auth/verify-email", { token });
        setStatus("success");
        setMessage("Your email has been successfully verified!");
        setTimeout(() => router.push("/(auth)/sign-in"), 3000);
      } catch (e) {
        const err = e as { unifiedMessage?: string; message?: string };
        setStatus("error");
        setMessage(
          err?.unifiedMessage ||
            err?.message ||
            "Verification failed. Please try again."
        );
      }
    }

    verify();
  }, [token, router]);

  return (
    <div>
      <AuthCard title="Email Verification">
        {status === "loading" && (
          <div className="flex flex-col items-center space-y-2">
            <Spinner />
            <p>{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-green-600 text-center">
            <p>{message}</p>
            <p className="text-sm mt-2">Redirecting to Sign In...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-red-600 text-center">
            <p>{message}</p>
          </div>
        )}
      </AuthCard>
    </div>
  );
}
