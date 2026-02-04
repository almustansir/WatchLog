"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.email}</h1>

        <p className="text-gray-600 mb-6">
          Track your movies and TV shows here.
        </p>

        {/* Empty state */}
        <div className="border rounded p-6 text-center text-gray-500">
          No shows added yet
        </div>
      </main>
    </ProtectedRoute>
  );
}
