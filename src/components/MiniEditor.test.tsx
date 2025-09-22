import { render, screen, fireEvent } from "@testing-library/react";
import MiniEditor from "./MiniEditor";
import { vi } from "vitest";
import React from "react";

// Fake chain API
const chainMock = {
  focus: vi.fn().mockReturnThis(),
  toggleBold: vi.fn().mockReturnThis(),
  toggleCode: vi.fn().mockReturnThis(),
  run: vi.fn(),
};

// Fake editor
const fakeEditor = {
  chain: () => chainMock,
  getHTML: vi.fn().mockReturnValue("<p>nuevo contenido</p>"),
};

// Mock tiptap
vi.mock("@tiptap/react", () => ({
  __esModule: true,
  useEditor: vi.fn(() => fakeEditor),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EditorContent: ({ editor }: any) => (
    <div data-testid="mini-editor-content">{editor ? "ready" : "null"}</div>
  ),
}));

import { useEditor } from "@tiptap/react";

describe("MiniEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("no renderiza nada si useEditor devuelve null", () => {
    (useEditor as jest.Mock).mockReturnValueOnce(null);
    const { container } = render(<MiniEditor value="" onChange={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it("renderiza botones y EditorContent cuando el editor está listo", () => {
    render(<MiniEditor value="<p>Hola</p>" onChange={() => {}} />);
    expect(screen.getByTestId("mini-editor-content")).toHaveTextContent(
      "ready",
    );
    expect(screen.getByRole("button", { name: "B" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "</>" })).toBeInTheDocument();
  });

  it("el botón Bold llama a toggleBold", () => {
    render(<MiniEditor value="" onChange={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "B" }));
    expect(chainMock.toggleBold).toHaveBeenCalled();
  });

  it("el botón Code llama a toggleCode", () => {
    render(<MiniEditor value="" onChange={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "</>" }));
    expect(chainMock.toggleCode).toHaveBeenCalled();
  });

  it("onChange se llama en onUpdate", () => {
    const onChange = vi.fn();
    (useEditor as jest.Mock).mockImplementationOnce(({ onUpdate }) => {
      onUpdate({ editor: fakeEditor });
      return fakeEditor;
    });

    render(<MiniEditor value="<p>init</p>" onChange={onChange} />);
    expect(onChange).toHaveBeenCalledWith("<p>nuevo contenido</p>");
  });
});
