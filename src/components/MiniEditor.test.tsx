// src/components/MiniEditor.test.tsx
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import React from "react";
import MiniEditor from "./MiniEditor";

// Mocks reutilizables
const runMock = vi.fn();
const toggleBoldMock = vi.fn(() => ({ run: runMock }));
const toggleHeadingMock = vi.fn(() => ({ run: runMock }));
const unsetLinkMock = vi.fn(() => ({ run: runMock }));
const toggleCodeMock = vi.fn(() => ({ run: runMock }));
const toggleCodeBlockMock = vi.fn(() => ({ run: runMock }));
const setLinkMock = vi.fn(() => ({ run: runMock }));
const setImageMock = vi.fn(() => ({ run: runMock }));

// Mock de @tiptap/react
vi.mock("@tiptap/react", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EditorContent: (props: any) => <div data-testid="editor" {...props} />,
  useEditor: () => ({
    chain: () => ({
      focus: () => ({
        toggleBold: toggleBoldMock,
        toggleHeading: toggleHeadingMock,
        unsetLink: unsetLinkMock,
        toggleCode: toggleCodeMock,
        toggleCodeBlock: toggleCodeBlockMock,
        setLink: setLinkMock,
        setImage: setImageMock,
      }),
    }),
    getHTML: () => "<p>mock</p>",
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("MiniEditor toolbar", () => {
  it("ejecuta toggleBold al hacer click en B", () => {
    render(<MiniEditor value="<p>hola</p>" onChange={() => {}} />);
    fireEvent.click(screen.getByText("B"));
    expect(toggleBoldMock).toHaveBeenCalled();
    expect(runMock).toHaveBeenCalled();
  });

  it("ejecuta toggleHeading({ level: 2 }) al hacer click en H2", () => {
    render(<MiniEditor value="<p>hola</p>" onChange={() => {}} />);
    fireEvent.click(screen.getByText("H2"));
    expect(toggleHeadingMock).toHaveBeenCalledWith({ level: 2 });
    expect(runMock).toHaveBeenCalled();
  });

  it("ejecuta unsetLink al hacer click en Unlink", () => {
    render(<MiniEditor value="<p>hola</p>" onChange={() => {}} />);
    fireEvent.click(screen.getByText("Unlink"));
    expect(unsetLinkMock).toHaveBeenCalled();
    expect(runMock).toHaveBeenCalled();
  });

  it("ejecuta toggleCode al hacer click en </>", () => {
    render(<MiniEditor value="<p>hola</p>" onChange={() => {}} />);
    fireEvent.click(screen.getByText("</>"));
    expect(toggleCodeMock).toHaveBeenCalled();
    expect(runMock).toHaveBeenCalled();
  });

  it("ejecuta toggleCodeBlock al hacer click en Code Block", () => {
    render(<MiniEditor value="<p>hola</p>" onChange={() => {}} />);
    fireEvent.click(screen.getByText("Code Block"));
    expect(toggleCodeBlockMock).toHaveBeenCalled();
    expect(runMock).toHaveBeenCalled();
  });

  it("ejecuta setLink con la URL del prompt", () => {
    vi.spyOn(window, "prompt").mockReturnValue("https://flik.cl");
    render(<MiniEditor value="<p>hola</p>" onChange={() => {}} />);
    fireEvent.click(screen.getByText("Link"));
    expect(setLinkMock).toHaveBeenCalledWith({
      href: "https://flik.cl",
      target: "_blank",
      rel: "noopener noreferrer",
    });
    expect(runMock).toHaveBeenCalled();
  });

  it("no llama a setLink si el prompt devuelve null", () => {
    vi.spyOn(window, "prompt").mockReturnValue(null);
    render(<MiniEditor value="<p>hola</p>" onChange={() => {}} />);
    fireEvent.click(screen.getByText("Link"));
    expect(setLinkMock).not.toHaveBeenCalled();
  });

  describe("Imagen", () => {
    it("sube imagen correctamente", async () => {
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ url: "/uploads/fake.png" }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const fakeFile = new File(["x"], "test.png", { type: "image/png" });

      render(<MiniEditor value="<p>hola</p>" onChange={() => {}} />);
      const input = screen.getByLabelText("Img");
      fireEvent.change(input, { target: { files: [fakeFile] } });

      await waitFor(() => {
        expect(setImageMock).toHaveBeenCalledWith({ src: "/uploads/fake.png" });
        expect(runMock).toHaveBeenCalled();
      });
    });

    it("muestra alert si fetch devuelve ok=false", async () => {
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        text: async () => "falló",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
      const fakeFile = new File(["x"], "test.png", { type: "image/png" });

      render(<MiniEditor value="<p>hola</p>" onChange={() => {}} />);
      const input = screen.getByLabelText("Img");
      fireEvent.change(input, { target: { files: [fakeFile] } });

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(
          "Error al subir la imagen: falló",
        );
      });
    });

    it("muestra alert si fetch lanza excepción", async () => {
      vi.spyOn(global, "fetch").mockRejectedValue(
        new Error("network exploded"),
      );
      const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
      const fakeFile = new File(["x"], "test.png", { type: "image/png" });

      render(<MiniEditor value="<p>hola</p>" onChange={() => {}} />);
      const input = screen.getByLabelText("Img");
      fireEvent.change(input, { target: { files: [fakeFile] } });

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(
          expect.stringContaining("network exploded"),
        );
      });
    });
  });

  describe("Expandir / Cerrar", () => {
    it("muestra modal al hacer click en Expandir y lo cierra en Cerrar", () => {
      render(<MiniEditor value="<p>hola</p>" onChange={() => {}} />);
      fireEvent.click(screen.getByText("Expandir"));
      expect(screen.getByText("Cerrar")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Cerrar"));
      expect(screen.queryByText("Cerrar")).not.toBeInTheDocument();
    });
  });

  it("llama a onChange cuando onUpdate se dispara", async () => {
    const onChange = vi.fn();

    // ⚡ resetear módulos antes de redefinir el mock
    vi.resetModules();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let capturedOnUpdate: any;

    vi.doMock("@tiptap/react", () => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      EditorContent: (props: any) => <div data-testid="editor" {...props} />,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      useEditor: (options?: any) => {
        capturedOnUpdate = options?.onUpdate; // guardamos el callback
        return {
          chain: () => ({ focus: () => ({}) }),
          getHTML: () => "<p>desde test</p>",
        };
      },
    }));

    // importar MiniEditor con el mock fresco
    const { default: MiniEditorWithUpdate } = await import("./MiniEditor");

    render(<MiniEditorWithUpdate value="<p>hola</p>" onChange={onChange} />);

    // forzar el callback manualmente
    capturedOnUpdate?.({ editor: { getHTML: () => "<p>desde test</p>" } });

    expect(onChange).toHaveBeenCalledWith("<p>desde test</p>");
  });

  it("retorna null si useEditor devuelve null", async () => {
    vi.resetModules();

    // ⚡ Mock especial: useEditor devuelve null
    vi.doMock("@tiptap/react", () => ({
      EditorContent: () => <div data-testid="editor" />,
      useEditor: () => null,
    }));

    const { default: MiniEditorWithNull } = await import("./MiniEditor");

    const { container } = render(
      <MiniEditorWithNull value="<p>hola</p>" onChange={() => {}} />,
    );

    // si retorna null, el contenedor está vacío
    expect(container).toBeEmptyDOMElement();
  });
});
