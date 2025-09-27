import { render, screen, act } from "@testing-library/react";
import GlobalLoading from "./GlobalLoading";
import { usePathname } from "next/navigation";
import { vi } from "vitest";
import React from "react";

// Mock explícito con vi.mock arriba
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("GlobalLoading", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("muestra y oculta el spinner al cambiar el pathname", () => {
    (usePathname as vi.Mock).mockReturnValue("/");

    render(<GlobalLoading />);

    // spinner debería aparecer inmediatamente
    expect(screen.getByRole("status")).toBeInTheDocument();

    // avanzar el timeout
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // spinner ya no debería estar
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
