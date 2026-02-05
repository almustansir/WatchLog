"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  const { user } = useAuth();

  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchShows = async () => {
      try {
        const q = query(
          collection(db, "shows"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
        );

        const snapshot = await getDocs(q);

        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setShows(results);
      } catch (err: any) {
        console.error("Firestore fetch error:", err);
        setError(err.message || "Failed to load shows");
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [user]);

  return (
    <ProtectedRoute>
      <main className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Welcome, {user?.email}</h1>

        {loading && <p>Loading your shows...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && shows.length === 0 && (
          <p className="text-gray-500">No shows added yet.</p>
        )}

        <div className="grid gap-4 mt-4">
          {shows.map((show) => (
            <div
              key={show.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{show.title}</h2>
                <p className="text-sm text-gray-600">
                  {show.type.toUpperCase()} · Episodes watched:{" "}
                  {show.episodesWatched}
                </p>
              </div>

              <span className="font-bold">⭐ {show.rating}/10</span>
            </div>
          ))}
        </div>
      </main>
    </ProtectedRoute>
  );
}
