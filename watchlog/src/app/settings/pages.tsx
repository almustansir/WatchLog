"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <main className="p-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </main>
    </ProtectedRoute>
  );
}
