"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Post } from "@/types";

type PostWithCategory = Post & {
  categories?: { name: string };
};

export default function AdminPage() {
  const [allowed, setAllowed] = useState(false);
  const [posts, setPosts] = useState<PostWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (window.location.hostname === "localhost") {
      setAllowed(true);
      fetchPosts();
    }
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });

    if (!error && data) setPosts(data as PostWithCategory[]);
    setLoading(false);
  }

  async function deletePost(slug: string) {
    if (
      !confirm(
        `¿Seguro que quieres eliminar "${slug}"? Esta acción no se puede deshacer.`,
      )
    )
      return;

    const { error } = await supabase.from("posts").delete().eq("slug", slug);

    if (error) {
      console.error(error);
      alert("Error al eliminar");
    } else {
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    }
  }

  if (!allowed) {
    return <div className="p-10 text-center text-red-600">Acceso denegado</div>;
  }

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Panel de administración</h1>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/admin/new"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ➕ Agregar publicación
        </Link>

        <input
          type="text"
          placeholder="Buscar por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-64"
        />
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : filteredPosts.length === 0 ? (
        <p>No hay publicaciones.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-2 text-left text-black">Título</th>
              <th className="border px-2 py-2 text-left text-black">Fecha</th>
              <th className="border px-2 py-2 text-left text-black">
                Categoría
              </th>
              <th className="border px-2 py-2 text-left text-black">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.slug}>
                <td className="border px-2 py-2">{post.title}</td>
                <td className="border px-2 py-2">{post.date}</td>
                <td className="border px-2 py-2">
                  {post.categories?.name || "—"}
                </td>
                <td className="border px-2 py-2 flex gap-2 justify-center">
                  <Link
                    href={`/admin/edit/${post.slug}`}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        const fileName = post.image.replace(/^\//, ""); // quita el "/" inicial
                        const res = await fetch("/api/optimize-image", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ fileName }),
                        });
                        const data = await res.json();
                        if (data.ok) {
                          alert("✅ Imagen optimizada correctamente");
                        } else {
                          alert("⚠️ Error: " + data.error);
                        }
                      } catch (err) {
                        alert("❌ Error optimizando imagen");
                        console.error(err);
                      }
                    }}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Optimizar
                  </button>
                  <button
                    onClick={() => deletePost(post.slug)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
