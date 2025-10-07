import { render, screen } from "@testing-library/react";
import PostListItem from "./PostListItem";
import { vi } from "vitest";
import { Post } from "@/types";
import React from "react";

// Mock de formatDate para tener un valor estable
vi.mock("@/lib/utils", () => ({
  formatDate: () => "21 de septiembre de 2025",
}));

// Un post base para reusar
const basePost: Post = {
  id: "1",
  slug: "test-post",
  title: "Título de prueba",
  date: "2025-09-21T00:00:00Z",
  image: "/test.png",
  excerpt: "Un excerpt de prueba",
  content: "Contenido completo",
  featured: false,
  category_id: "c1",
  category: { slug: "tech", name: "Tech" },
  created_at: "2025-09-21T00:00:00Z",
  post_tags: [], // Añadido para cumplir con el tipo Post
};

describe("PostListItem", () => {
  it("renderiza título, excerpt, categoría y comentarios", () => {
    render(<PostListItem post={basePost} />);

    expect(screen.getByText("Título de prueba")).toBeInTheDocument();
    expect(screen.getByText("Un excerpt de prueba")).toBeInTheDocument();
    expect(screen.getByText("Tech")).toBeInTheDocument();
    expect(screen.getByText("21 de septiembre de 2025")).toBeInTheDocument();
  });

  it("tiene links correctos", () => {
    render(<PostListItem post={basePost} />);

    const links = screen.getAllByRole("link", { name: /título de prueba/i });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/posts/test-post");
    expect(links[1]).toHaveAttribute("href", "/posts/test-post");

    expect(screen.getByRole("link", { name: /tech/i })).toHaveAttribute(
      "href",
      "/categories/tech",
    );
    expect(
      screen.getByRole("link", { name: /sigue leyendo/i }),
    ).toHaveAttribute("href", "/posts/test-post");
  });

  it("renderiza imagen cuando existe post.image", () => {
    render(<PostListItem post={basePost} />);
    const img = screen.getByRole("img", { name: /título de prueba/i });
    expect(img).toHaveAttribute("src", "/test.png");
  });

  it("cambia atributos de la imagen si fetchpriority='high'", () => {
    render(<PostListItem post={basePost} fetchpriority="high" />);
    const img = screen.getByRole("img", { name: /título de prueba/i });

    // Next.js agrega cosas distintas en tests, pero podemos verificar atributos básicos
    expect(img).toHaveAttribute("loading", "eager");
  });

  it("no renderiza imagen si post.image está vacío", () => {
    const postWithoutImage = { ...basePost, image: "" };
    render(<PostListItem post={postWithoutImage} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("usa slug y name vacíos cuando no hay categoría", () => {
    const postWithoutCategory = {
      ...basePost,
      category: undefined,
    };

    render(<PostListItem post={postWithoutCategory} />);

    // el link de categoría debería tener href="/categories/"
    const categoryLink = screen.getByRole("link", { name: "" }); // no hay texto visible
    expect(categoryLink).toHaveAttribute("href", "/categories");

    // Como name es "", no debería renderizar ningún texto dentro del span
    // El span existe, pero vacío
    expect(categoryLink.querySelector("span")?.textContent).toBe("");
  });
});
