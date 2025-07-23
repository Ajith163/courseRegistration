"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div>
      <nav className="flex justify-center gap-6 py-4 mb-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <Link
          href="/courses"
          className={`font-semibold transition-colors px-2 py-1 rounded-lg
            ${pathname === "/courses" ? "text-blue-600 dark:text-blue-400 underline underline-offset-4 bg-blue-50 dark:bg-gray-700" : "text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"}`}
        >
          All Courses
        </Link>
        <Link
          href="/courses/registered"
          className={`font-semibold transition-colors px-2 py-1 rounded-lg
            ${pathname === "/courses/registered" ? "text-blue-600 dark:text-blue-400 underline underline-offset-4 bg-blue-50 dark:bg-gray-700" : "text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"}`}
        >
          My Registered Courses
        </Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}
