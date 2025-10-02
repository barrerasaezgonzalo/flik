"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function GlobalLoading() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cada vez que cambia el pathname mostramos el spinner brevemente
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 300); // ajusta el tiempo
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50">
      <div
        role="status"
        className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"
      />
    </div>
  );
}
