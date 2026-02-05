"use client";

import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";

export default function AddShowPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<"movie" | "tv">("tv");
  const [episodesWatched, setEpisodesWatched] = useState(0);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "shows"), {
        userId: user.uid,
        title,
        type,
        episodesWatched,
        rating,
        createdAt: Timestamp.now(),
      });

      router.push("/dashboard");
    } catch (err) {
      setError("Failed to save show");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add Show</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            placeholder="Show / Movie title"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Type */}
          <select
            className="w-full border p-2 rounded"
            value={type}
            onChange={(e) => setType(e.target.value as "movie" | "tv")}
          >
            <option value="tv">TV Show</option>
            <option value="movie">Movie</option>
          </select>

          {/* Episodes watched */}
          <input
            type="number"
            min={0}
            placeholder="Episodes watched"
            className="w-full border p-2 rounded"
            value={episodesWatched}
            onChange={(e) => setEpisodesWatched(Number(e.target.value))}
          />

          {/* Rating */}
          <input
            type="number"
            min={0}
            max={10}
            placeholder="Rating (0–10)"
            className="w-full border p-2 rounded"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </main>
    </ProtectedRoute>
  );
}
