"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  if (!user) return null; // hide navbar if not logged in

  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <div className="space-x-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/add-show">Add Show</Link>
        <Link href="/profile">Profile</Link>
      </div>

      <button
        onClick={() => signOut(auth)}
        className="border px-4 py-1 rounded"
      >
        Logout
      </button>
    </nav>
  );
}
