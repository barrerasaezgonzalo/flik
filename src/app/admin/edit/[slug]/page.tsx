"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import MiniEditor from "@/components/MiniEditor";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);
  const [allowed, setAllowed] = useState(false);

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    date: "",
    excerpt: "",
    image: "",
    content: "",
    category_id: "",
  });

  useEffect(() => {
    if (window.location.hostname === "localhost") {
      setAllowed(true);

      const loadData = async () => {
        const { data: cats } = await supabase
          .from("categories")
          .select("id, name");
        if (cats) setCategories(cats);

        const { data: post } = await supabase
          .from("posts")
          .select("*")
          .eq("slug", slug)
          .single();
        if (post) {
          setForm({
            title: post.title || "",
            slug: post.slug || "",
            date: post.date?.slice(0, 10) || "",
            excerpt: post.excerpt || "",
            image: post.image || "",
            content: post.content || "",
            category_id: post.category_id || "",
          });
        }
        setLoading(false);
      };
      loadData();
    }
  }, [slug]);

  function generarSlug(texto: string) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  const handleTitleBlur = () => {
    if (form.title) {
      const nuevoSlug = generarSlug(form.title);
      const nuevaImagen = "/" + nuevoSlug + ".png";
      setForm((f) => ({
        ...f,
        slug: nuevoSlug,
        image: nuevaImagen,
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from("posts")
      .update(form)
      .eq("slug", slug);

    if (error) {
      console.error(error);
      alert("Error al actualizar");
    } else {
      alert("Publicación actualizada");
      //router.push("/admin");
    }
  };

  if (!allowed)
    return <div className="p-10 text-center text-red-600">Acceso denegado</div>;
  if (loading) return <div className="p-10 text-center">Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Editar publicación</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          onBlur={handleTitleBlur}
          placeholder="Título"
          className="w-full border p-2 rounded"
        />
        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="Slug"
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black bg-white"
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          name="image"
          type="hidden"
          value={form.image}
          readOnly          
        />
        <input
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          placeholder="Resumen corto"
          className="w-full border p-2 rounded"
        />
        <MiniEditor
          value={form.content}
          onChange={(html) => setForm((f) => ({ ...f, content: html }))}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Guardar cambios
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-4 ml-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Volver al listado
        </button>
      </form>
    </div>
  );
}
