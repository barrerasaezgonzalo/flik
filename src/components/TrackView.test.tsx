// src/components/TrackView.test.tsx
import { render } from "@testing-library/react";
import { TrackView } from "./TrackView";
import React from "react";

describe("TrackView", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    // @ts-expect-error mock fetch
    global.fetch = vi.fn(() => Promise.resolve({ ok: true }));
    document.cookie = ""; // limpiar cookies
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("hace fetch cuando no existe la cookie ignore_tracking", () => {
    render(<TrackView slug="mi-post" />);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/track-view",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "mi-post" }),
      }),
    );
  });

  it("no hace fetch cuando existe la cookie ignore_tracking", () => {
    document.cookie = "ignore_tracking=true";
    render(<TrackView slug="mi-post" />);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
