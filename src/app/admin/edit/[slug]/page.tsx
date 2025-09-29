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
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [postId, setPostId] = useState<string>("");
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
        // Traer todos los tags
        const { data: allTags } = await supabase
          .from("tags")
          .select("id, name");
        if (allTags) setTags(allTags);

        // Traer todas las categorias
        const { data: cats } = await supabase
          .from("categories")
          .select("id, name");
        if (cats) setCategories(cats);

        // Traer post
        const { data: post } = await supabase
          .from("posts")
          .select(
            "id, title, slug, date, excerpt, image, content, category_id, post_tags(tag_id)",
          )
          .eq("slug", slug)
          .single();

        if (post) {
          setForm({
            title: post.title,
            slug: post.slug,
            date: post.date?.slice(0, 10) || "",
            excerpt: post.excerpt,
            image: post.image,
            content: post.content,
            category_id: post.category_id,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setSelectedTags(post.post_tags?.map((t: any) => t.tag_id) || []);
          setPostId(post.id);
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

    const { error: deleteError } = await supabase
      .from("post_tags")
      .delete()
      .eq("post_id", postId); // asegurate de guardar el id al cargar el post
    if (deleteError) console.error(deleteError);

    // 3. Insertar tags seleccionados
    const rows = selectedTags.map((tagId) => ({
      post_id: postId,
      tag_id: tagId,
    }));

    const { error: insertError } = await supabase
      .from("post_tags")
      .insert(rows);
    if (insertError) console.error(insertError);
  };

  if (!allowed)
    return <div className="p-10 text-center text-red-600">Acceso denegado</div>;
  if (loading) return <div className="p-10 text-center">Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Editar publicación</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label
          htmlFor="title"
          className="block text-lg font-medium text-white mb-1"
        >
          Título
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          onBlur={handleTitleBlur}
          placeholder="Título"
          className="w-full border p-2 rounded"
        />

        <label
          htmlFor="slug"
          className="block text-lg font-medium text-white mb-1"
        >
          Slug
        </label>
        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="Slug"
          className="w-full border p-2 rounded"
        />

        <label
          htmlFor="date"
          className="block text-lg font-medium text-white mb-1"
        >
          Fecha
        </label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          readOnly
        />

        <label
          htmlFor="category_id"
          className="block text-lg font-medium text-white mb-1"
        >
          Categoría
        </label>
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

        <label
          htmlFor="  "
          className="block text-lg font-medium text-white mb-1"
        >
          Resumen corto
        </label>
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
        <div>
          <label className="block font-medium mb-1">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  value={tag.id}
                  checked={selectedTags.includes(tag.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTags([...selectedTags, tag.id]);
                    } else {
                      setSelectedTags(
                        selectedTags.filter((id) => id !== tag.id),
                      );
                    }
                  }}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>
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
