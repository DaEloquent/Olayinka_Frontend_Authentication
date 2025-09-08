"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/(auth)/sign-in");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-graay-600">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user.username || user.email}!
      </h1>
      <p className="text-gray-700 mb-6">
        This is a protected dashboard page. Only authenticated users can access
        it.
      </p>
      <button
        onClick={signOut}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Sign Out
      </button>
    </div>
  );
}
