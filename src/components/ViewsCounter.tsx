"use client";

import React, { useEffect, useState } from "react";

export default function ViewsCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<string | null>(null);

  useEffect(() => {
    async function fetchViews() {
      try {
        const res = await fetch(`/api/views?slug=${slug}`);
        if (!res.ok) throw new Error("Error en la API");
        const data = await res.json();
        setViews(data.views);
      } catch {
        setViews("0");
      }
    }
    fetchViews();
  }, [slug]);

  return (
    <span className="text-white text-sm flex items-center gap-1">
      {views === null ? (
        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      ) : (
        views
      )}{" "}
      👀 vistas
    </span>
  );
}
