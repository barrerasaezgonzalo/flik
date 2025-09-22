import "@testing-library/jest-dom";
import React, { ImgHTMLAttributes } from "react";
import { vi } from "vitest";

// Mock global para next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    // usamos React.createElement en lugar de JSX para evitar problemas de lint
    return React.createElement("img", props);
  },
}));
