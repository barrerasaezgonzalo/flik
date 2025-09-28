import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MapaPage from "./page";

// Mock dependencies
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
  },
}));

import { supabase } from "@/lib/supabaseClient";

describe("Mapa Page", () => {
  const mockPosts = [
    {
      title: "Post 1",
      slug: "post-1",
      category_id: "1",
    },
    {
      title: "Post 2",
      slug: "post-2",
      category_id: "1",
    },
    {
      title: "Post 3",
      slug: "post-3",
      category_id: "2",
    },
  ];

  const mockCategories = [
    {
      id: "1",
      name: "Tecnología",
      slug: "tecnologia",
    },
    {
      id: "2",
      name: "Desarrollo",
      slug: "desarrollo",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset supabase mock
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from as any).mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: mockPosts }),
        };
      } else if (table === "categories") {
        return {
          select: vi.fn().mockResolvedValue({ data: mockCategories }),
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [] }),
      };
    });
  });

  it("renders the site map with posts organized by categories", async () => {
    const MapaComponent = await MapaPage({ searchParams: {} });
    render(MapaComponent);

    // Check main heading
    expect(
      screen.getByRole("heading", { level: 1, name: /Mapa del sitio/i }),
    ).toBeInTheDocument();

    // Check that categories are displayed
    expect(screen.getByText("Tecnología")).toBeInTheDocument();
    expect(screen.getByText("Desarrollo")).toBeInTheDocument();

    // Check that posts are displayed
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 2")).toBeInTheDocument();
    expect(screen.getByText("Post 3")).toBeInTheDocument();

    // Check post counts
    expect(screen.getByText("(2)")).toBeInTheDocument(); // Tecnología has 2 posts
    expect(screen.getByText("(1)")).toBeInTheDocument(); // Desarrollo has 1 post
  });

  it("shows categories mode when modo=categorias", async () => {
    const MapaComponent = await MapaPage({
      searchParams: { modo: "categorias" },
    });
    render(MapaComponent);

    // Should show "Blog de tecnología en español" as title in categories mode
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Blog de tecnología en español/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders advertisement section", async () => {
    const MapaComponent = await MapaPage({ searchParams: {} });
    render(MapaComponent);

    // Check for advertisement
    const adImage = screen.getByAltText(/Ayúdamos a crecer/i);
    expect(adImage).toBeInTheDocument();
    expect(adImage).toHaveAttribute("src", "/ads/ayudanos.png");
  });

  it("shows message when no posts available", async () => {
    // Mock empty posts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from as any).mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: [] }),
        };
      } else if (table === "categories") {
        return {
          select: vi.fn().mockResolvedValue({ data: mockCategories }),
        };
      }
    });

    const MapaComponent = await MapaPage({ searchParams: {} });
    render(MapaComponent);

    expect(screen.getByText(/No hay publicaciones/i)).toBeInTheDocument();
  });

  it("handles posts without valid category_id", async () => {
    // Mock posts with missing or invalid category_id
    const postsWithoutCategory = [
      {
        title: "Post Without Category",
        slug: "post-without-category",
        category_id: null, // This should use "sin-categoria"
      },
      {
        title: "Post With Invalid Category",
        slug: "post-with-invalid-category",
        category_id: "999", // Non-existent category_id
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from as any).mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: postsWithoutCategory }),
        };
      } else if (table === "categories") {
        return {
          select: vi.fn().mockResolvedValue({ data: mockCategories }),
        };
      }
    });

    const MapaComponent = await MapaPage({ searchParams: {} });
    render(MapaComponent);

    // Should display "Sin categoría" section
    expect(screen.getByText("Sin categoría")).toBeInTheDocument();

    // Should show both posts in the "Sin categoría" section
    expect(screen.getByText("Post Without Category")).toBeInTheDocument();
    expect(screen.getByText("Post With Invalid Category")).toBeInTheDocument();

    // Check that the section shows count of 2
    expect(screen.getByText("(2)")).toBeInTheDocument();
  });

  it("handles missing categories gracefully", async () => {
    // Mock posts but no categories
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from as any).mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: mockPosts }),
        };
      } else if (table === "categories") {
        return {
          select: vi.fn().mockResolvedValue({ data: [] }),
        };
      }
    });

    const MapaComponent = await MapaPage({ searchParams: {} });
    render(MapaComponent);

    expect(screen.getByText(/No hay publicaciones/i)).toBeInTheDocument();
  });

  it("creates correct category mapping and grouping", async () => {
    const MapaComponent = await MapaPage({ searchParams: {} });
    render(MapaComponent);

    // Should group posts by category correctly
    // Tecnología section should have 2 posts
    const tecnologiaSection = screen.getByText("Tecnología").closest("section");
    const tecnologiaLinks =
      tecnologiaSection?.querySelectorAll('a[href*="/posts/"]');
    expect(tecnologiaLinks).toHaveLength(2);

    // Desarrollo section should have 1 post
    const desarrolloSection = screen.getByText("Desarrollo").closest("section");
    const desarrolloLinks =
      desarrolloSection?.querySelectorAll('a[href*="/posts/"]');
    expect(desarrolloLinks).toHaveLength(1);
  });

  it("has proper semantic structure", async () => {
    const MapaComponent = await MapaPage({ searchParams: {} });
    render(MapaComponent);

    // Check main element
    expect(screen.getByRole("main")).toBeInTheDocument();

    // Check sections for each category
    const sections =
      screen.getAllByRole("listitem").length > 0
        ? screen.getAllByRole("list")
        : screen.getAllByRole("region");

    // Should have sections (one per category)
    expect(sections.length).toBeGreaterThan(0);
  });
});

describe("generateMetadata", () => {
  it("returns correct metadata for default map view", async () => {
    const { generateMetadata } = await import("./page");
    const metadata = await generateMetadata({ searchParams: {} });

    expect(metadata.title).toBe(
      "Mapa del sitio | Blog de tecnología en español",
    );
    expect(metadata.description).toBe(
      "Encuentra todos los artículos y categorías en Flik. Blog de tecnología en español.",
    );
    expect(metadata.openGraph?.url).toBe("https://flik.cl/mapa");
  });

  it("returns correct metadata for categories view", async () => {
    const { generateMetadata } = await import("./page");
    const metadata = await generateMetadata({
      searchParams: { modo: "categorias" },
    });

    expect(metadata.title).toBe("Categorías | Blog de tecnología en español");
    expect(metadata.description).toBe(
      "Explora todas las categorías de Flik. Blog de tecnología en español.",
    );
    expect(metadata.openGraph?.url).toBe(
      "https://flik.cl/mapa?modo=categorias",
    );
  });
});
