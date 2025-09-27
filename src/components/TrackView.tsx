"use client";
import { useEffect } from "react";

export function TrackView({ slug }: { slug: string }) {
  useEffect(() => {
    // 👇 si existe la cookie "ignore_tracking", no contamos
    if (document.cookie.includes("ignore_tracking=true")) {
      console.log("👀 Ignorando mis visitas");
      return;
    }

    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
  }, [slug]);

  return null;
}
