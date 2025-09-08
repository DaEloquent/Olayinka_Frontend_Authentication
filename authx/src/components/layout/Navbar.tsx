"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-6 py-3 flex justify-between items-center shadow">
      <Link href="/" className="font-bold text-lg">
        AuthApp
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {user ? (
          <>
            <span className="text-sm">{user.email}</span>
            <button
              onClick={signOut}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/sign-in" className="hover:underline">
              Sign In
            </Link>
            <Link href="/sign-up" className="hover:underline">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
