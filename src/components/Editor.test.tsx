import { render, screen, fireEvent } from "@testing-library/react";
import Editor from "./Editor";
import { vi } from "vitest";
import React from "react";

// Fake chain API para simular tiptap
const chainMock = {
  focus: vi.fn().mockReturnThis(),
  toggleBold: vi.fn().mockReturnThis(),
  toggleItalic: vi.fn().mockReturnThis(),
  toggleHeading: vi.fn().mockReturnThis(),
  toggleBulletList: vi.fn().mockReturnThis(),
  toggleCodeBlock: vi.fn().mockReturnThis(),
  unsetLink: vi.fn().mockReturnThis(),
  setLink: vi.fn().mockReturnThis(),
  run: vi.fn(),
};

// Fake editor que useEditor debería devolver
const fakeEditor = {
  chain: () => chainMock,
  isActive: vi.fn().mockReturnValue(false),
  getHTML: vi.fn().mockReturnValue("<p>contenido</p>"),
  getAttributes: vi.fn().mockReturnValue({ href: "" }),
};

// Mock de tiptap react
vi.mock("@tiptap/react", () => ({
  __esModule: true,
  useEditor: vi.fn(() => fakeEditor),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EditorContent: ({ editor }: any) => (
    <div data-testid="editor-content">{editor ? "ready" : "null"}</div>
  ),
}));

// Importamos useEditor del mock
import { useEditor } from "@tiptap/react";

describe("Editor component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("no renderiza nada si useEditor devuelve null", () => {
    (useEditor as jest.Mock).mockReturnValueOnce(null); // 👈 solo este test
    const { container } = render(<Editor onChange={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it("renderiza toolbar y área de edición cuando editor está listo", () => {
    render(<Editor onChange={() => {}} />);
    expect(screen.getByTestId("editor-content")).toHaveTextContent("ready");
    expect(screen.getByRole("button", { name: "B" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "I" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "H2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "• Lista" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "</>" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "🔗 Link" })).toBeInTheDocument();
  });

  it("los botones llaman a chain().run()", () => {
    render(<Editor onChange={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: "B" }));
    expect(chainMock.toggleBold).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "I" }));
    expect(chainMock.toggleItalic).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "H2" }));
    expect(chainMock.toggleHeading).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "• Lista" }));
    expect(chainMock.toggleBulletList).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "</>" }));
    expect(chainMock.toggleCodeBlock).toHaveBeenCalled();
  });

  it("setLink usa window.prompt y setea el link", () => {
    const promptSpy = vi
      .spyOn(window, "prompt")
      .mockReturnValue("https://flik.cl");
    render(<Editor onChange={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "🔗 Link" }));

    expect(promptSpy).toHaveBeenCalled();
    expect(chainMock.setLink).toHaveBeenCalledWith({ href: "https://flik.cl" });

    promptSpy.mockRestore();
  });

  it("setLink elimina link si prompt devuelve string vacío", () => {
    vi.spyOn(window, "prompt").mockReturnValue("");
    render(<Editor onChange={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "🔗 Link" }));

    expect(chainMock.unsetLink).toHaveBeenCalled();
  });

  it("setLink no hace nada si prompt devuelve null", () => {
    vi.spyOn(window, "prompt").mockReturnValue(null);
    render(<Editor onChange={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "🔗 Link" }));

    // ni setLink ni unsetLink son llamados
    expect(chainMock.setLink).not.toHaveBeenCalled();
    expect(chainMock.unsetLink).not.toHaveBeenCalled();
  });

  it("onChange es llamado cuando se actualiza el editor", () => {
    const onChange = vi.fn();

    // Sobrescribimos useEditor para simular onUpdate inmediato
    (useEditor as jest.Mock).mockImplementationOnce(({ onUpdate }) => {
      onUpdate({ editor: fakeEditor });
      return fakeEditor;
    });

    render(<Editor onChange={onChange} />);
    expect(onChange).toHaveBeenCalledWith("<p>contenido</p>");
  });

  it("aplica clases activas cuando isActive devuelve true", () => {
    const activeEditor = {
      ...fakeEditor,
      isActive: vi.fn().mockReturnValue(true), // 👈 ahora devuelve true
    };

    // Forzamos useEditor a devolver este editor en este test
    (useEditor as jest.Mock).mockReturnValueOnce(activeEditor);

    render(<Editor onChange={() => {}} />);

    const boldButton = screen.getByRole("button", { name: "B" });
    expect(boldButton.className).toMatch(/bg-blue-500/);
  });
});
