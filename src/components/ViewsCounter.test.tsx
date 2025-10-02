import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ViewsCounter from "./ViewsCounter";
import { vi } from "vitest";

describe("ViewsCounter", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.clearAllMocks();
  });

  it("shows spinner while loading", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.fetch = vi.fn(() => new Promise(() => {})) as any;
    render(<ViewsCounter slug="test-slug" />);
    waitFor(() => {
      expect(screen.getByTestId("spinner")).toBeTruthy();
    });
  });

  it("renders views after successful fetch", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ views: "123" }),
    });
    render(<ViewsCounter slug="test-slug" />);
    await waitFor(() => {
      expect(screen.getByText(/123/)).toBeInTheDocument();
      expect(screen.getByText(/👀 vistas/)).toBeInTheDocument();
    });
  });

  it("renders 0 if fetch fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("API error"));
    render(<ViewsCounter slug="test-slug" />);
    await waitFor(() => {
      expect(screen.getByText(/0/)).toBeInTheDocument();
      expect(screen.getByText(/👀 vistas/)).toBeInTheDocument();
    });
  });

  it("renders 0 if response is not ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });
    render(<ViewsCounter slug="test-slug" />);
    await waitFor(() => {
      expect(screen.getByText(/0/)).toBeInTheDocument();
    });
  });
});
