import "./globals.css";
import { ThemeProvider } from "../providers/ThemeProvider";
import AuthProvider from "@/providers/AuthProvider";
import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Auth App",
  description: "A complete authentication flow with Next.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <Navbar />
              <main className="min h-screen">{children}</main>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
