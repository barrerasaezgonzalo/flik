import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

vi.mock("@google-analytics/data", () => {
  return {
    BetaAnalyticsDataClient: vi.fn(() => ({
      runReport: vi.fn(),
    })),
  };
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let runReportMock: any;

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  runReportMock = (BetaAnalyticsDataClient as any).mock.results[0].value
    .runReport;
  runReportMock.mockReset();
});

describe("GET /api/views", () => {
  it("retorna 0 si no hay slug", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { url: "http://localhost/api/views" } as any;
    const res = await GET(req);
    const body = await res.json();
    expect(body).toEqual({ views: 0 });
  });

  it("retorna las vistas correctas si GA responde", async () => {
    runReportMock.mockResolvedValue([
      {
        rows: [
          {
            metricValues: [{ value: "42" }],
          },
        ],
      },
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { url: "http://localhost/api/views?slug=mi-post" } as any;
    const res = await GET(req);
    const body = await res.json();

    expect(body).toEqual({ views: "42" });
  });

  it("retorna 0 si GA responde sin filas", async () => {
    runReportMock.mockResolvedValue([{ rows: [] }]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { url: "http://localhost/api/views?slug=mi-post" } as any;
    const res = await GET(req);
    const body = await res.json();

    expect(body).toEqual({ views: "0" });
  });

  it("retorna error si runReport lanza excepción", async () => {
    runReportMock.mockRejectedValue(new Error("Boom!"));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { url: "http://localhost/api/views?slug=mi-post" } as any;
    const res = await GET(req);
    const body = await res.json();

    expect(body).toEqual({ error: "Boom!" });
  });

  it("usa 'GA failed' si el error no tiene message", async () => {
    runReportMock.mockRejectedValue("esto no es un error válido"); // 👈 string, sin .message
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { url: "http://localhost/api/views?slug=mi-post" } as any;
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(500); // 👈 ahora sí es 500
    expect(body).toEqual({ error: "GA failed" });
  });
});
