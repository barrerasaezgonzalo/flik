"use client";

import React, { useEffect, useState } from "react";

export default function LikeButton({ postId }: { postId: string }) {
  const [likes, setLikes] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLikes() {
      try {
        const res = await fetch(`/api/like?postId=${postId}`);
        const data = (await res.json()) as { likes?: number };
        setLikes((data.likes ?? 0) as number);
      } catch {
        setLikes(0);
      } finally {
        setLoading(false);
      }
    }
    fetchLikes();
  }, [postId]);

  async function handleLike() {
    setLoading(true);
    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      const data: { likes: number | null } = await res.json();
      setLikes(data.likes ?? 0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-2 text-white text-sm hover:scale-110 transition"
    >
      click si te gustó → 👍{" "}
      {loading ? (
        <span
          data-testid="spinner"
          className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"
        ></span>
      ) : (
        <span data-testid="likes-count">{likes}</span>
      )}
    </button>
  );
}
