"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <main className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>

        <div className="space-y-2">
          <p>
            <span className="font-semibold">Email:</span> {user?.email}
          </p>

          <p>
            <span className="font-semibold">User ID:</span> {user?.uid}
          </p>

          <p>
            <span className="font-semibold">Account created:</span>{" "}
            {user?.metadata.creationTime}
          </p>
        </div>
      </main>
    </ProtectedRoute>
  );
}
