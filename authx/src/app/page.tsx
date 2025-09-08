import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to Auth Demo</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center max-w-md">
        This is a simple authentication flow built with Next.js, TailwindCSS,
        and TanStack Query. Sign up or log in to access your dashboard.
      </p>
      <div className="flex gap-4">
        <Link
          href="/sign-in"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
        >
          Sign Up
        </Link>
      </div>
    </main>
  );
}

// import { redirect } from "next/navigation";

// export default function HomePage() {
//   redirect("/sign-in");
// }
