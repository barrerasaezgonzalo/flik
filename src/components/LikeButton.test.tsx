import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LikeButton from "./LikeButton";
import { vi } from "vitest";

describe("LikeButton", () => {
  const postId = "test-post-id";

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders loading spinner initially", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () => new Promise(() => {}), // never resolves
      ),
    );
    render(<LikeButton postId={postId} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(
      screen.getByRole("button").querySelector("span"),
    ).toBeInTheDocument();
  });

  it("fetches and displays likes on mount", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({ likes: 5 }),
      }),
    );
    render(<LikeButton postId={postId} />);
    await waitFor(() => expect(screen.getByText("5")).toBeInTheDocument());
  });

  it("shows 0 likes if fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("fail")));
    render(<LikeButton postId={postId} />);
    await waitFor(() => expect(screen.getByText("0")).toBeInTheDocument());
  });

  it("sends POST request and updates likes on click", async () => {
    // First fetch for initial likes
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        json: async () => ({ likes: 2 }),
      })
      // Second fetch for POST like
      .mockResolvedValueOnce({
        json: async () => ({ likes: 3 }),
      });
    vi.stubGlobal("fetch", fetchMock);

    render(<LikeButton postId={postId} />);
    await waitFor(() => expect(screen.getByText("2")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(screen.getByText("3")).toBeInTheDocument());

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/like",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      }),
    );
  });

  it("shows spinner while liking", async () => {
    // Mock: primer fetch devuelve 1
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        json: async () => ({ likes: 1 }),
      })
      // segundo fetch POST devuelve 2
      .mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  json: async () => ({ likes: 2 }),
                }),
              100,
            ),
          ),
      );
    vi.stubGlobal("fetch", fetchMock);

    render(<LikeButton postId="post-123" />);

    // Al inicio debe verse el spinner
    expect(screen.getByTestId("spinner")).toBeInTheDocument();

    // Esperar a que se muestre el contador inicial
    await waitFor(() =>
      expect(screen.getByTestId("likes-count")).toHaveTextContent("1"),
    );

    // Clic para dar like
    fireEvent.click(screen.getByRole("button"));

    // Mientras procesa, vuelve a mostrarse el spinner
    expect(screen.getByTestId("spinner")).toBeInTheDocument();

    // Al final, se debería mostrar el nuevo número
    await waitFor(() =>
      expect(screen.getByTestId("likes-count")).toHaveTextContent("2"),
    );
  });

  it("muestra el número correcto cuando likes existe", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce({
        json: async () => ({ likes: 5 }),
      }),
    );

    render(<LikeButton postId={postId} />);
    await waitFor(() => {
      expect(screen.getByText(/5/)).toBeInTheDocument();
    });
  });

  it("muestra 0 cuando likes es null", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce({
        json: async () => ({ likes: null }),
      }),
    );

    render(<LikeButton postId={postId} />);
    await waitFor(() => {
      expect(screen.getByText(/0/)).toBeInTheDocument();
    });
  });

  it("muestra 0 cuando likes es undefined", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce({
        json: async () => ({
          /* sin likes */
        }),
      }),
    );

    render(<LikeButton postId={postId} />);
    await waitFor(() => {
      expect(screen.getByText(/0/)).toBeInTheDocument();
    });
  });

  it("usa el valor de likes si viene en la respuesta del POST", async () => {
    // Primer fetch (GET inicial)
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ json: async () => ({ likes: 1 }) })
      // Segundo fetch (POST → respuesta con likes=2)
      .mockResolvedValueOnce({ json: async () => ({ likes: 2 }) });

    vi.stubGlobal("fetch", fetchMock);

    render(<LikeButton postId={postId} />);
    await waitFor(() => expect(screen.getByText(/1/)).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(screen.getByText(/2/)).toBeInTheDocument());
  });

  it("cae al fallback 0 si el POST responde sin likes", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ json: async () => ({ likes: 1 }) }) // GET inicial
      .mockResolvedValueOnce({ json: async () => ({}) }); // POST sin likes

    vi.stubGlobal("fetch", fetchMock);

    render(<LikeButton postId={postId} />);
    await waitFor(() => expect(screen.getByText(/1/)).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(screen.getByText(/0/)).toBeInTheDocument()); // 👈 fallback
  });
});
