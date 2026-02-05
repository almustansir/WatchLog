"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const linkClass = (path: string) =>
    `text-sm font-medium transition ${
      pathname === path
        ? "text-indigo-600"
        : "text-slate-600 hover:text-indigo-600"
    }`;

  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="font-bold text-lg text-indigo-600">
            WatchLog
          </Link>

          {user && (
            <div className="hidden sm:flex items-center gap-6">
              <Link href="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>
              <Link href="/add-show" className={linkClass("/add-show")}>
                Add Show
              </Link>
              <Link href="/profile" className={linkClass("/profile")}>
                Profile
              </Link>
            </div>
          )}
        </div>

        {/* Right: User + Logout */}
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden md:block">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-rose-500 hover:text-rose-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
