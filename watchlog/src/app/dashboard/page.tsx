"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { deleteDoc, doc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";

export default function DashboardPage() {
  const { user } = useAuth();

  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingShow, setEditingShow] = useState<any | null>(null);
  const [editEpisodes, setEditEpisodes] = useState(0);
  const [editRating, setEditRating] = useState(0);
  const startEdit = (show: any) => {
    setEditingShow(show);
    setEditEpisodes(show.episodesWatched);
    setEditRating(show.rating);
  };

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

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Delete this show?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "shows", id));

      // Update UI without refetching
      setShows((prev) => prev.filter((show) => show.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete show");
    }
  };
  const saveEdit = async () => {
    if (!editingShow) return;

    try {
      const ref = doc(db, "shows", editingShow.id);

      await updateDoc(ref, {
        episodesWatched: editEpisodes,
        rating: editRating,
      });

      setShows((prev) =>
        prev.map((s) =>
          s.id === editingShow.id
            ? { ...s, episodesWatched: editEpisodes, rating: editRating }
            : s,
        ),
      );

      setEditingShow(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update show");
    }
  };

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
            <div className="border rounded p-4 flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{show.title}</h2>
                <p className="text-sm text-gray-600">
                  {show.type.toUpperCase()} · Episodes watched:{" "}
                  {show.episodesWatched}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold">⭐ {show.rating}/10</span>
                <button
                  onClick={() => startEdit(show)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(show.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {editingShow && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
              <div className="bg-white p-6 rounded w-80">
                <h2 className="font-bold mb-4">Edit {editingShow.title}</h2>

                <label className="block mb-2">
                  Episodes Watched
                  <input
                    type="number"
                    value={editEpisodes}
                    onChange={(e) => setEditEpisodes(Number(e.target.value))}
                    className="border w-full p-2 mt-1"
                  />
                </label>

                <label className="block mb-4">
                  Rating
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={editRating}
                    onChange={(e) => setEditRating(Number(e.target.value))}
                    className="border w-full p-2 mt-1"
                  />
                </label>

                <div className="flex justify-end gap-3">
                  <button onClick={() => setEditingShow(null)}>Cancel</button>
                  <button
                    onClick={saveEdit}
                    className="bg-black text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
