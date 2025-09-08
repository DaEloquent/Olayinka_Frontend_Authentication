import { ReactNode } from "react";

export default function AuthCard({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-xl shadow-md bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-semibold mb-6 text-center">{title}</h2>
      {children}
    </div>
  );
}
