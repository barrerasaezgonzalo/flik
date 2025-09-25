"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import MiniEditor from "@/components/MiniEditor";

export default function NewPostPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  const [categories, setCategories] = useState<
    { id: string; name: string; slug: string }[]
  >([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    date: new Date().toISOString().slice(0, 10),
    excerpt: "",
    image: "",
    content: "",
    category_id: "",
  });

  useEffect(() => {
    if (window.location.hostname === "localhost") {
      setAllowed(true);
      loadCategories();
    }
  }, []);

  async function loadCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug");
    if (!error && data) setCategories(data);
  }

  if (!allowed) {
    return <div className="p-10 text-center text-red-600">Acceso denegado</div>;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function generarSlug(texto: string) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  const handleTitleBlur = () => {
    if (!form.slug && form.title) {
      const nuevoSlug = generarSlug(form.title);
      const nuevaImagen = "/" + nuevoSlug + ".png";
      setForm((f) => ({ ...f, slug: nuevoSlug, image: nuevaImagen }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.slug || !form.category_id) {
      alert("Título, slug y categoría son obligatorios");
      return;
    }

    const { error } = await supabase.from("posts").insert([
      {
        ...form,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      console.error(error);
      alert("Error al guardar");
    } else {
      alert("Publicación creada");
      router.push("/admin");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Nueva publicación</h1>

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
          placeholder="Slug (se genera automáticamente)"
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

        <input name="image" type="hidden" value={form.image} readOnly />
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
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Guardar publicación
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
