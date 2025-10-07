import "@testing-library/jest-dom";
import React, { ImgHTMLAttributes } from "react";
import { vi } from "vitest";

// Mock global para next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    return React.createElement("img", props);
  },
}));
