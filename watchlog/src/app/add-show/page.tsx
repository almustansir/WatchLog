"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function AddShowPage() {
  return (
    <ProtectedRoute>
      <main className="p-6">
        <h1 className="text-2xl font-bold">Add Show</h1>
      </main>
    </ProtectedRoute>
  );
}
