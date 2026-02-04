"use client";

import { auth } from "@/lib/firebase";

export default function DashboardPage() {
  const user = auth.currentUser;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Welcome {user?.email}</h1>
    </main>
  );
}
