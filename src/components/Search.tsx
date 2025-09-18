"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Search() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        aria-labelledby="search-button"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-10 px-4 py-2 text-black border border-green-500  rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-48 transition-all duration-300"
      />
      <button
        id="search-button"
        type="submit"
        className="h-10 px-4 py-2 border border-green-500 bg-green-500  text-white rounded-r-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
      >
        Search
      </button>
    </form>
  );
}
